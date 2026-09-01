import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { SPANS, SPAN_BY_ID, ancestorsOf } from '../data/trace';
import { LAYOUT, LAYER_LABEL } from '../data/layout';
import { ATTRIBUTES } from '../data/attributes';
import { actions } from '../state/store';

/* Find anything in the trace.

   The tree is forty-nine spans deep in places and the attribute rail is
   thirty-seven chips long. Both are browsable and neither is
   searchable, which is fine at a glance and useless the moment someone
   arrives looking for one specific thing — "did they use Kafka", "where
   is the rate limiter". Every real trace viewer has this for the same
   reason.

   One input over both indexes rather than two search boxes, because the
   user's question is "where is X", not "is X a span or an attribute".
   Spans carry their path, since the tree legitimately contains five
   different spans called Redis and a list of five identical rows would
   be worse than no search at all. */

const SPAN_ROWS = SPANS.map((span) => ({
  kind: 'span',
  id: span.id,
  label: span.name,
  hint: ancestorsOf(span.id).map((a) => a.name).join(' / ') || 'trace root',
  meta: LAYER_LABEL[span.layer],
  color: LAYOUT[span.id].color,
  haystack: `${span.name} ${span.subtitle || ''} ${LAYER_LABEL[span.layer]}`.toLowerCase(),
}));

const ATTR_ROWS = ATTRIBUTES.map((a) => ({
  kind: 'attribute',
  id: a.key,
  label: a.key,
  hint: `${a.workCount} span${a.workCount === 1 ? '' : 's'}`,
  meta: a.category || 'attribute',
  color: null,
  haystack: `${a.key} ${a.category || ''}`.toLowerCase(),
}));

const ROWS = [...SPAN_ROWS, ...ATTR_ROWS];

/* Ranked, not merely filtered. A substring match anywhere is enough to
   be shown, but a name that starts with the query is almost always what
   was meant — typing "red" should reach Redis before it reaches a span
   whose description happens to mention it. */
function score(row, q) {
  const label = row.label.toLowerCase();
  if (label === q) return 0;
  if (label.startsWith(q)) return 1;
  if (label.includes(q)) return 2;
  if (row.haystack.includes(q)) return 3;
  return -1;
}

function search(query) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return ROWS.map((row) => ({ row, s: score(row, q) }))
    .filter((r) => r.s >= 0)
    /* Attributes before spans when both match exactly, which is not the
       obvious way round. Typing a technology name is nearly always the
       question "where was this used", and the attribute answers it in
       one row by lighting all six places; the span rows below it are the
       individual occurrences, which is the follow-up, not the answer.
       Type a project name and only spans match anyway. */
    .sort((a, b) => a.s - b.s || a.row.kind.localeCompare(b.row.kind) || a.row.label.localeCompare(b.row.label))
    .slice(0, 12)
    .map((r) => r.row);
}

/* What an empty palette offers. A blank box asks the visitor to already
   know what is in the trace, which is exactly what they opened it to
   find out — so it opens on the branches of the tree and the
   technologies that appear in the most work. */
const DEFAULT_ROWS = [
  ...SPAN_ROWS.filter((r) => SPAN_BY_ID[r.id].depth === 1),
  ...ATTR_ROWS.slice(0, 6),
];

/* Mounted only while open, so every session starts on an empty query
   with the cursor at the top without an effect resetting state — which
   is a cascading render, and a real one here: the reset would run after
   the first paint of a palette that had already drawn the previous
   query's results. */
export default function SpanPalette({ onClose }) {
  const [query, setQuery] = useState('');
  const [cursor, setCursor] = useState(0);
  const results = useMemo(() => (query.trim() ? search(query) : DEFAULT_ROWS), [query]);

  const choose = (row) => {
    if (!row) return;
    if (row.kind === 'span') actions.focus(row.id);
    else actions.toggleFilter(row.id);
    onClose();
  };

  const onKeyDown = (e) => {
    // Esc is handled here and stopped, or the stage's own Escape handler
    // would also fire and shed a layer of trace state on the way out.
    if (e.key === 'Escape') { e.stopPropagation(); onClose(); return; }
    if (e.key === 'ArrowDown') { e.preventDefault(); setCursor((c) => Math.min(results.length - 1, c + 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setCursor((c) => Math.max(0, c - 1)); }
    if (e.key === 'Enter') { e.preventDefault(); choose(results[cursor]); }
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center px-4 pt-[12vh]"
      style={{ background: 'rgba(0,0,0,0.55)' }}
      onPointerDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Find in trace"
        className="w-full max-w-[36rem] rounded-lg overflow-hidden"
        style={{
          /* --surface-alt is deliberately translucent, which is right
             for a panel that sits in the layout and wrong for one that
             floats over body copy — the page's text was legible through
             the results. Compositing it over --bg keeps the same colour
             in both themes and makes it opaque. No blur: the brief rules
             out glassmorphism, and a plain solid reads better anyway. */
          background: 'linear-gradient(var(--surface-alt), var(--surface-alt)), var(--bg)',
          border: '1px solid var(--surface-border)',
          boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
        }}
      >
        <div
          className="flex items-center gap-2.5 px-3.5"
          style={{ borderBottom: '1px solid var(--surface-border)' }}
        >
          <Search size={15} style={{ color: 'var(--text-4)' }} />
          <input
            autoFocus
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              // Ranking changes with the query, so the highlight has to
              // return to the top result rather than to whatever now
              // happens to sit at the old index.
              setCursor(0);
            }}
            onKeyDown={onKeyDown}
            placeholder="Find a span or an attribute…"
            aria-label="Find a span or an attribute"
            className="flex-1 bg-transparent outline-none py-3 text-[14px]"
            style={{ color: 'var(--text-1)' }}
          />
          <kbd className="text-[10.5px] font-mono" style={{ color: 'var(--text-4)' }}>esc</kbd>
        </div>

        {query.trim() && results.length === 0 && (
          <p className="px-3.5 py-4 text-[12.5px]" style={{ color: 'var(--text-4)' }}>
            Nothing in the trace matches “{query.trim()}”.
          </p>
        )}

        <ul className="max-h-[52vh] overflow-y-auto">
          {results.map((row, i) => (
            <li key={`${row.kind}-${row.id}`}>
              <button
                onClick={() => choose(row)}
                onPointerEnter={() => setCursor(i)}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-left"
                style={{ background: i === cursor ? 'var(--surface-border)' : 'transparent' }}
                aria-current={i === cursor}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: row.color || 'var(--text-4)' }}
                />
                <span className="text-[13.5px] truncate" style={{ color: 'var(--text-1)' }}>
                  {row.label}
                </span>
                <span className="text-[11px] font-mono truncate" style={{ color: 'var(--text-4)' }}>
                  {row.hint}
                </span>
                <span
                  className="ml-auto text-[10.5px] font-mono uppercase tracking-[0.1em] flex-shrink-0"
                  style={{ color: 'var(--text-4)' }}
                >
                  {row.kind === 'span' ? row.meta : 'attribute'}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
