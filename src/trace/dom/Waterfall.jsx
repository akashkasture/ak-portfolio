import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronRight, CornerLeftUp } from 'lucide-react';
import { TRACE, SPAN_BY_ID } from '../data/trace';
import { LAYOUT, LAYER_LABEL, TICKS, playheadDate } from '../data/layout';
import { useTrace, actions, litSpanIds, rootSpan } from '../state/store';
import { SEGMENTS_BY_SPAN } from '../data/critical';

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
const MONTH = 2629800000;

function fmt(date) {
  return date.toLocaleDateString(undefined, { month: 'short', year: 'numeric' });
}

function humanDuration(ms) {
  const months = Math.round(ms / MONTH);
  // A real span shorter than half a month rounds to zero, and "0mo" next
  // to a bar that is visibly there reads as a bug rather than as brevity.
  if (months < 1) return '<1mo';
  const y = Math.floor(months / 12);
  const m = months % 12;
  if (!y) return `${m}mo`;
  return m ? `${y}y ${m}mo` : `${y}y`;
}

/* What a row says about itself when the bar is too small to say it.

   On a 390px screen the timeline is the full width and the work still
   only occupies its right third, because the career genuinely starts in
   2024 — so a project's bar is about a hundred pixels and its duration
   is unreadable as a length. Text carries what the pixels cannot. This
   is the same information the bar encodes, not an extra claim.

   Only dated spans get one. Forty-two of the forty-nine are
   indeterminate, and labelling each of them "window not recorded" put
   the same eight words down the screen eight times and squeezed every
   project name into an ellipsis — repeating the caveat cost more than
   it told anyone. The hatched bar already says it, and the inspector
   says it in full. */
function spanMeta(span) {
  if (span.indeterminate || !span.start || !span.end) return null;
  return `${fmt(span.start)} → ${fmt(span.end)} · ${humanDuration(span.end - span.start)}`;
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

function Milestones({ playhead, width, compact = false }) {
  const marks = TRACE.milestones.map((m) => ({
    ...m,
    x: (m.at - TRACE.start) / TRACE.durationMs,
  }));

  /* Eight labels will not pack into 390px — they would need eight rows
     and push the trace itself off the screen. So the phone shows the
     ticks and names only the one the playhead has reached, revealing
     them one at a time as you scrub. That is what a playhead is for, and
     it turns a layout problem into the interaction. */
  if (compact) {
    /* `upcoming` marks an aspiration, not something that happened — the
       2026 "Next Chapter" entry. Its date is already in the past, so a
       plain date comparison named it as the milestone reached, which
       reads as a claim that it is done. It is excluded from the pick and
       only ever drawn as a dashed tick. */
    const reached = marks.filter((m) => m.x <= playhead && !m.upcoming);
    const current = reached[reached.length - 1] ?? marks.find((m) => !m.upcoming) ?? marks[0];
    return (
      <div>
        <div className="relative h-3">
          {marks.map((m) => (
            <span
              key={m.id}
              className="absolute top-1"
              style={{
                left: `${m.x * 100}%`,
                transform: 'translateX(-50%)',
                width: m.precision === 'year' ? 9 : 4,
                height: 4,
                borderRadius: 2,
                background: m.color,
                opacity: m.upcoming ? 0.35 : m.x <= playhead ? 1 : 0.4,
                border: m.upcoming ? `1px dashed ${m.color}` : 'none',
              }}
            />
          ))}
        </div>
        <div className="flex items-center gap-1.5 h-5 min-w-0">
          <span
            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{ background: current.color }}
          />
          <span className="text-[11px] font-mono truncate" style={{ color: 'var(--text-3)' }}>
            {current.label}
          </span>
        </div>
      </div>
    );
  }

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

/* Chronological entrance. A span's delay is its own position on the
   time axis, so the field fills left to right in the order the work
   actually happened rather than in DOM order — which would run down the
   tree and cross back over time on every branch. Capped so a trace that
   grows a longer tail never turns the entrance into a wait. */
const drawDelay = (x) => `${Math.round(Math.min(0.8, x) * 620)}ms`;

/* Year rules carried down through the whole field.

   The ticks used to live only in the 28px axis strip, so a bar four
   hundred pixels below it floated in undifferentiated black and its
   position was unreadable — you could see that a span was long without
   being able to say when it ran. Every real trace viewer rules its
   field for exactly this reason. Drawn behind the rows and inert to the
   pointer, at an opacity that reads as structure rather than as
   content. */
function YearGrid() {
  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      {TICKS.map((tick) => (
        <span
          key={tick.year}
          className="absolute top-0 bottom-0"
          style={{
            left: `${tick.x * 100}%`,
            width: 1,
            background: 'var(--surface-border)',
            opacity: 0.5,
          }}
        />
      ))}
    </div>
  );
}

function Bar({ span, lit, open, hot }) {
  const l = LAYOUT[span.id];
  const dim = lit === false;
  const critical = SEGMENTS_BY_SPAN[span.id];
  const height = span.root ? 6 : 11;
  return (
    <>
    {/* Span events — a timestamped point inside a span, which is what a
        commit is. Drawn on the bar at its own moment rather than in the
        milestone lane, because it belongs to this span and not to the
        trace as a whole. */}
    {span.events.map((e) => {
      const x = (e.at - TRACE.start) / TRACE.durationMs;
      if (x < l.x || x > l.x + l.width) return null;
      return (
        <span
          key={e.id}
          title={e.detail || e.label}
          className="absolute rounded-full pointer-events-none z-[2]"
          style={{
            left: `${x * 100}%`,
            top: '50%',
            width: 4,
            height: 4,
            transform: 'translate(-50%, -50%)',
            background: e.color || 'var(--text-1)',
            outline: '1.5px solid var(--bg)',
            opacity: dim ? 0.15 : 1,
          }}
        />
      );
    })}
    <div
      className="absolute rounded-sm ak-span-draw"
      style={{
        left: `${l.x * 100}%`,
        width: `${l.width * 100}%`,
        top: '50%',
        height,
        transform: 'translateY(-50%)',
        '--ak-delay': drawDelay(l.x),
        // An indeterminate span has no recorded schedule, so it is drawn
        // as an open outline across its parent's window. A solid bar
        // would assert a start and a duration that were never recorded.
        background: span.indeterminate
          ? `repeating-linear-gradient(115deg, ${l.color}2e 0 5px, transparent 5px 10px)`
          : // A solid bar is lit from above rather than filled flat, so a
            // row of them reads as objects sitting in the field instead
            // of as swatches. One stop, no glow.
            `linear-gradient(${l.color}, ${l.color}) padding-box, linear-gradient(180deg, rgba(255,255,255,0.22), rgba(255,255,255,0) 62%)`,
        border: span.indeterminate ? `1px solid ${l.color}66` : 'none',
        // Hovering the name lifts its bar out of the field. Feedback for
        // an aimed action, so it survives the animation rule.
        boxShadow: hot && !dim ? `0 0 0 1px var(--bg), 0 0 0 2px ${l.color}` : 'none',
        opacity: dim ? 0.13 : open || hot ? 1 : 0.72,
        transition: 'opacity 180ms var(--ease-standard, ease), box-shadow 140ms var(--ease-standard, ease)',
      }}
    />

    {/* The critical path, drawn the way a trace viewer draws it: a rule
        under the part of this span that nothing else was accounting for.
        Because the segments tile the trace exactly once, the rules on
        consecutive rows meet end to end and read as one line stepping
        down into the tree and back out — which is literally what the
        walk computed. */}
    {critical?.map((seg) =>
      /* Sub-pixel segments are dropped here rather than in the data. The
         walk has to tile the window exactly to be provably correct, and
         it does produce a genuine one-day sliver between two adjacent
         roles — real, and worth nothing to look at. */
      seg.width < 0.002 ? null : (
        <span
          key={seg.x}
          className="absolute pointer-events-none ak-rule-draw"
          style={{
            left: `${seg.x * 100}%`,
            width: `${seg.width * 100}%`,
            top: '50%',
            height: 2,
            '--rule-y': `${span.root ? 6 : 8.5}px`,
            '--rule-o': dim ? 0.12 : 0.85,
            '--ak-delay': drawDelay(seg.x),
            background: 'var(--text-1)',
          }}
          title={`Critical path · ${fmt(seg.from)} → ${fmt(seg.to)} · time this span alone accounts for`}
        />
      )
    )}
    </>
  );
}

function SpanRow({ span, playhead, litIds, state, depth = 0, compact = false }) {
  const l = LAYOUT[span.id];
  const hasChildren = span.children.length > 0;
  const isExpanded = state.expanded.has(span.id);
  const isFocused = state.focusId === span.id;
  const lit = litIds ? litIds.has(span.id) : null;
  const open = playhead >= l.x && playhead <= l.x + l.width;
  const hot = state.hoverId === span.id;
  const meta = compact ? spanMeta(span) : null;

  /* Compact stacks the name over a full-width track instead of putting
     it in a gutter. On a 390px screen a 17rem gutter leaves about 150px
     of timeline, which is too little for a duration to mean anything —
     and a phone has the vertical room to spend a second line on it. */
  return (
    <li role="treeitem" aria-expanded={hasChildren ? isExpanded : undefined} aria-level={depth + 1}>
      <div
        className={compact ? 'py-1.5' : 'grid items-center'}
        style={{
          ...(compact
            ? { paddingLeft: depth * 12 }
            : { gridTemplateColumns: 'minmax(0, 17rem) 1fr', height: ROW }),
          background: isFocused
            ? 'var(--surface-alt)'
            : hot
              ? 'rgba(255,255,255,0.035)'
              : 'transparent',
          transition: 'background 140ms var(--ease-standard, ease)',
        }}
        onMouseEnter={() => actions.hover(span.id)}
        onMouseLeave={() => actions.hover(null)}
      >
        <div
          className="flex items-center min-w-0 gap-1 pr-3"
          style={{ paddingLeft: compact ? 0 : depth * 14 }}
        >
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
            className="truncate text-left text-[13px]"
            style={{
              color: lit === false ? 'var(--text-4)' : open ? 'var(--text-1)' : 'var(--text-2)',
              fontWeight: span.root || isFocused ? 500 : 400,
            }}
            title={span.subtitle ? `${span.name} · ${span.subtitle}` : span.name}
          >
            {span.name}
          </button>

          {compact && meta && (
            <span
              className="ml-auto pl-2 flex-shrink-0 text-[10px] font-mono tabular-nums whitespace-nowrap"
              style={{ color: lit === false ? 'var(--text-4)' : 'var(--text-3)', opacity: 0.85 }}
            >
              {meta}
            </span>
          )}
        </div>

        <div className={compact ? 'relative h-4' : 'relative h-full'}>
          <Bar span={span} lit={lit} open={open} hot={hot} />
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
              compact={compact}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

export default function Waterfall({ compact = false }) {
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
  const root = rootSpan(state);
  const drilled = root !== TRACE.root;
  // The label gutter only exists in the wide layout; compact gives the
  // whole width to the timeline, so the playhead spans the whole width.
  const gutter = compact ? '0rem' : '17rem';

  return (
    <div ref={containerRef} className="relative">
      {/* Drilled in, the way back has to be visible at all times — the
          tree no longer shows its own context. */}
      {drilled && (
        <button
          onClick={() => actions.surface()}
          className="flex items-center gap-1.5 mb-2 text-[11.5px] font-mono"
          style={{ color: 'var(--os-accent)' }}
        >
          <CornerLeftUp size={13} />
          {root.parentId ? SPAN_BY_ID[root.parentId].name : TRACE.root.name}
        </button>
      )}
      {/* On a phone the tree runs several screens deep, so the axis has
          to come with it — scrolled past, every bar below is a length
          with no position, which is most of what a bar is for.

          It is a direct child of the tall container rather than of the
          two-column grid: a sticky element can only travel inside its
          own parent's box, and the grid row here is exactly as tall as
          the axis, so nesting it there pinned it to nothing. The desktop
          keeps the grid, because that is where the gutter label lives. */}
      {compact ? (
        <div
          ref={trackRef}
          className="sticky top-0 z-20 pb-0.5"
          style={{ background: 'var(--bg)' }}
        >
          <Milestones playhead={state.playhead} width={trackWidth} compact />
          <TimeAxis playhead={state.playhead} onScrub={actions.setPlayhead} />
        </div>
      ) : (
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
      )}

      <div className="relative">
        {/* Structure first, behind everything: the year rules occupy the
            timeline half of the grid, so they start where the gutter
            ends and never run under the labels. */}
        <div
          className="absolute top-0 bottom-0 pointer-events-none"
          style={{ left: gutter, right: 0 }}
        >
          <YearGrid />
        </div>

        {/* The playhead sits above the rows but must never intercept a
            click meant for a span. It carries a head at the top now —
            a 1px line with nothing on it read as a rendering artefact
            rather than as something you could take hold of. */}
        <div
          className="absolute top-0 bottom-0 pointer-events-none z-10"
          style={{
            left: `calc(${gutter} + ${state.playhead} * (100% - ${gutter}))`,
            width: 1,
            background: 'var(--os-accent)',
            opacity: 0.55,
          }}
        >
          <span
            className="absolute"
            style={{
              top: -3,
              left: -3,
              width: 7,
              height: 7,
              borderRadius: 2,
              background: 'var(--os-accent)',
              transform: 'rotate(45deg)',
            }}
          />
        </div>
        <ul role="tree" aria-label={`Trace of ${TRACE.root.name}'s work`}>
          <SpanRow
            span={root}
            playhead={state.playhead}
            litIds={litIds}
            state={state}
            compact={compact}
          />
        </ul>
      </div>
    </div>
  );
}
