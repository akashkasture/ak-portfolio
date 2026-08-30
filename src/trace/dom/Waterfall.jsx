import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { TRACE, SPAN_BY_ID } from '../data/trace';
import { LAYOUT, LAYER_LABEL, TICKS, playheadDate } from '../data/layout';
import { useTrace, actions, litSpanIds } from '../state/store';

/* The trace, as HTML.

   This is the primary rendering, not a fallback. It ships first, it is
   what a screen reader walks, it is what a phone gets, and it is what
   remains when WebGL is unavailable or declined. The 3D layer renders
   the same coordinates from `data/layout.js` on top of it.

   Building it this way collapses four requirements — accessibility, the
   no-WebGL path, mobile, and "no information may live only inside
   WebGL" — into one implementation instead of four that drift apart.

   ── On the playhead ──────────────────────────────────────────────────
   It emphasises; it never gates. Every span is fully rendered and
   readable at first paint regardless of where the playhead sits, so a
   recruiter who never touches the page has still read the whole thing.
   Scrubbing changes what is *stressed*, not what exists. A 3D scene that
   withholds content until you scroll far enough is a toll booth, and
   that outranks every effect in the concept. */

const ROW = 34;

function fmt(date) {
  return date.toLocaleDateString(undefined, { month: 'short', year: 'numeric' });
}

function TimeAxis({ playhead, onScrub }) {
  const ref = useRef(null);

  const scrubTo = useCallback(
    (clientX) => {
      const rect = ref.current?.getBoundingClientRect();
      if (!rect || rect.width === 0) return;
      onScrub((clientX - rect.left) / rect.width);
    },
    [onScrub]
  );

  const onPointerDown = (e) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    scrubTo(e.clientX);
  };
  const onPointerMove = (e) => {
    if (e.buttons === 1) scrubTo(e.clientX);
  };

  return (
    <div
      ref={ref}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      className="relative h-7 select-none cursor-ew-resize touch-none"
      style={{ borderBottom: '1px solid var(--surface-border)' }}
      role="slider"
      tabIndex={0}
      aria-label="Time"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(playhead * 100)}
      aria-valuetext={fmt(playheadDate(playhead))}
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft') { e.preventDefault(); onScrub(playhead - 0.02); }
        if (e.key === 'ArrowRight') { e.preventDefault(); onScrub(playhead + 0.02); }
      }}
    >
      {TICKS.map((tick) => (
        <div
          key={tick.year}
          className="absolute top-0 bottom-0 flex items-start"
          style={{ left: `${tick.x * 100}%` }}
        >
          <span
            className="absolute top-0 bottom-0 w-px"
            style={{ background: 'var(--surface-border)' }}
          />
          <span
            className="pl-1.5 text-[10.5px] font-mono"
            style={{ color: 'var(--text-4)' }}
          >
            {tick.year}
          </span>
        </div>
      ))}
    </div>
  );
}

/* Milestones are span events on the root — and they carry the first four
   years on their own, because the professional spans don't start until
   2024. Left as bare 5px dots they made the whole left half of the trace
   look empty when it isn't: that stretch is a degree, learning Spring,
   and picking up Kafka.

   Labels are packed into as many rows as it takes to stop them
   overlapping, measured off an approximate advance width rather than
   guessed at, so adding a milestone can't silently collide with one
   already there. */
/* Deliberately an over-estimate of the mono advance at 10.5px. Packing
   errs one way only: over-estimating costs at most a spare row, while
   under-estimating puts two labels on top of each other. */
const CHAR_PX = 6.8;
const LABEL_PAD = 20;

function packRows(items, widthPx) {
  const rows = [];
  const placed = [];
  for (const m of items) {
    const w = m.label.length * CHAR_PX + LABEL_PAD;
    // Flipped labels extend leftward from their tick, so their extent has
    // to be measured that way or packing collides with what it can't see.
    const left = m.x > 0.78 ? m.x * widthPx - w : m.x * widthPx;
    let row = 0;
    // Drop to the next row until this label clears everything already
    // placed on it.
    while (
      placed.some((p) => p.row === row && left < p.right && left + w > p.left)
    ) {
      row += 1;
    }
    placed.push({ row, left, right: left + w });
    rows[row] = true;
    m.row = row;
  }
  return { items, rowCount: rows.length || 1 };
}

const ROW_H = 17;

function Milestones({ playhead, width }) {
  const marks = TRACE.milestones.map((m) => ({
    ...m,
    x: (m.at - TRACE.start) / TRACE.durationMs,
  }));
  const { rowCount } = packRows(marks, Math.max(320, width));

  return (
    <div className="relative" style={{ height: rowCount * ROW_H + 6 }}>
      {marks.map((m) => {
        const passed = m.x <= playhead;
        // Near the right edge the label would run off the container, so
        // it flips to sit before its tick instead of after it.
        const flip = m.x > 0.78;
        return (
          <div
            key={m.id}
            className={`absolute flex items-center gap-1.5 whitespace-nowrap ${flip ? 'flex-row-reverse' : ''}`}
            style={{
              left: `${m.x * 100}%`,
              transform: flip ? 'translateX(-100%)' : undefined,
              top: m.row * ROW_H,
              opacity: m.upcoming ? 0.45 : passed ? 1 : 0.5,
              transition: 'opacity 180ms var(--ease-standard, ease)',
            }}
            title={
              m.precision === 'year'
                ? `${m.detail} — ${m.at.getFullYear()}, month not recorded`
                : m.detail
            }
          >
            <span
              className="flex-shrink-0"
              style={{
                // A year-only milestone is genuinely imprecise, so it is
                // drawn wide and soft rather than as a confident tick.
                width: m.precision === 'year' ? 9 : 4,
                height: 4,
                borderRadius: 2,
                background: m.color,
                border: m.upcoming ? `1px dashed ${m.color}` : 'none',
              }}
            />
            <span className="text-[10.5px] font-mono" style={{ color: 'var(--text-3)' }}>
              {m.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function Bar({ span, lit, open }) {
  const l = LAYOUT[span.id];
  const dim = lit === false;
  return (
    <div
      className="absolute rounded-sm"
      style={{
        left: `${l.x * 100}%`,
        width: `${l.width * 100}%`,
        top: '50%',
        height: span.root ? 6 : 11,
        transform: 'translateY(-50%)',
        // An indeterminate span has no recorded schedule, so it is drawn
        // as an open outline across its parent's window. A solid bar
        // would assert a start and a duration that were never recorded.
        background: span.indeterminate
          ? `repeating-linear-gradient(115deg, ${l.color}2e 0 5px, transparent 5px 10px)`
          : l.color,
        border: span.indeterminate ? `1px solid ${l.color}66` : 'none',
        opacity: dim ? 0.13 : open ? 1 : 0.72,
        transition: 'opacity 180ms var(--ease-standard, ease)',
      }}
    />
  );
}

function SpanRow({ span, playhead, litIds, state, depth = 0 }) {
  const l = LAYOUT[span.id];
  const hasChildren = span.children.length > 0;
  const isExpanded = state.expanded.has(span.id);
  const isFocused = state.focusId === span.id;
  const lit = litIds ? litIds.has(span.id) : null;
  const open = playhead >= l.x && playhead <= l.x + l.width;

  return (
    <li role="treeitem" aria-expanded={hasChildren ? isExpanded : undefined} aria-level={depth + 1}>
      <div
        className="grid items-center"
        style={{
          gridTemplateColumns: 'minmax(0, 17rem) 1fr',
          height: ROW,
          background: isFocused ? 'var(--surface-alt)' : 'transparent',
        }}
      >
        <div className="flex items-center min-w-0 gap-1 pr-3" style={{ paddingLeft: depth * 14 }}>
          {hasChildren ? (
            <button
              onClick={() => actions.toggleExpanded(span.id)}
              aria-label={isExpanded ? `Collapse ${span.name}` : `Expand ${span.name}`}
              className="flex-shrink-0 p-0.5"
              style={{ color: 'var(--text-4)' }}
            >
              <ChevronRight
                size={13}
                style={{
                  transform: isExpanded ? 'rotate(90deg)' : 'none',
                  transition: 'transform 160ms var(--ease-standard, ease)',
                }}
              />
            </button>
          ) : (
            <span className="w-[18px] flex-shrink-0" />
          )}
          <span
            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{ background: l.color, opacity: lit === false ? 0.25 : 1 }}
          />
          <button
            onClick={() => actions.focus(isFocused ? null : span.id)}
            onMouseEnter={() => actions.hover(span.id)}
            onMouseLeave={() => actions.hover(null)}
            className="truncate text-left text-[13px]"
            style={{
              color: lit === false ? 'var(--text-4)' : open ? 'var(--text-1)' : 'var(--text-2)',
              fontWeight: span.root || isFocused ? 500 : 400,
            }}
            title={span.subtitle ? `${span.name} · ${span.subtitle}` : span.name}
          >
            {span.name}
          </button>
        </div>

        <div className="relative h-full">
          <Bar span={span} lit={lit} open={open} />
        </div>
      </div>

      {hasChildren && isExpanded && (
        <ul role="group">
          {span.children.map((child) => (
            <SpanRow
              key={child.id}
              span={child}
              playhead={playhead}
              litIds={litIds}
              state={state}
              depth={depth + 1}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

export default function Waterfall() {
  const state = useTrace();
  const litIds = litSpanIds(state);
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const [trackWidth, setTrackWidth] = useState(720);

  // Label packing needs real pixels, not an assumption — the column
  // changes width with the viewport and with the inspector opening.
  useEffect(() => {
    const el = trackRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(([entry]) => setTrackWidth(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* Arrow keys walk the tree the same way the pointer does, so nothing
     here is reachable only by mouse. */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onKey = (e) => {
      if (e.key === 'Escape') { actions.escape(); return; }
      if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return;
      const rows = [...el.querySelectorAll('[role="treeitem"] button[title]')];
      const i = rows.indexOf(document.activeElement);
      if (i === -1) return;
      e.preventDefault();
      const next = rows[i + (e.key === 'ArrowDown' ? 1 : -1)];
      next?.focus();
    };
    el.addEventListener('keydown', onKey);
    return () => el.removeEventListener('keydown', onKey);
  }, []);

  const focused = state.focusId ? SPAN_BY_ID[state.focusId] : null;

  return (
    <div ref={containerRef} className="relative">
      <div className="grid" style={{ gridTemplateColumns: 'minmax(0, 17rem) 1fr' }}>
        <div className="flex items-end pb-1.5 pr-3">
          <span
            className="text-[10.5px] font-mono uppercase tracking-[0.12em]"
            style={{ color: 'var(--text-4)' }}
          >
            {focused ? LAYER_LABEL[focused.layer] : 'Trace'}
          </span>
        </div>
        <div ref={trackRef}>
          <Milestones playhead={state.playhead} width={trackWidth} />
          <TimeAxis playhead={state.playhead} onScrub={actions.setPlayhead} />
        </div>
      </div>

      <div className="relative">
        {/* The playhead sits above the rows but must never intercept a
            click meant for a span. */}
        <div
          className="absolute top-0 bottom-0 pointer-events-none z-10"
          style={{
            left: `calc(17rem + ${state.playhead} * (100% - 17rem))`,
            width: 1,
            background: 'var(--os-accent)',
            opacity: 0.55,
          }}
        />
        <ul role="tree" aria-label={`Trace of ${TRACE.root.name}'s work`}>
          <SpanRow span={TRACE.root} playhead={state.playhead} litIds={litIds} state={state} />
        </ul>
      </div>
    </div>
  );
}
