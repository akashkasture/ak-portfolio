import { TRACE, SPANS } from '../data/trace';
import { LAYERS, MAX_DEPTH } from '../data/layout';
import { ATTRIBUTES } from '../data/attributes';
import { COVERAGE } from '../data/critical';

/* The trace header, the way a trace viewer has one.

   Every number here is counted off the tree that is drawn below it.
   None of them is a claim: "49 spans" is how many spans there are, not
   an assertion that 49 is impressive. That distinction is the whole
   reason this is allowed to exist on a page whose first rule is that
   nothing may be inflated to look good — a count of what is on screen
   cannot be exaggerated, only read.

   Which is also why the coverage line is here and not in a tooltip. A
   header full of confident figures that quietly omits how much of the
   trace has recorded dates would be exactly the kind of dashboard this
   design was written against. */

const MONTH = 2629800000;

function humanDuration(ms) {
  const months = Math.round(ms / MONTH);
  const y = Math.floor(months / 12);
  const m = months % 12;
  if (!y) return `${m}mo`;
  return m ? `${y}y ${m}mo` : `${y}y`;
}

const usedLayers = new Set(SPANS.map((s) => s.layer));

const STATS = [
  {
    label: 'duration',
    value: humanDuration(TRACE.durationMs),
    title: `${TRACE.start.getFullYear()} to now — the root span's window`,
  },
  { label: 'spans', value: SPANS.length, title: 'Every node in the tree below, including derived subsystems' },
  { label: 'depth', value: MAX_DEPTH + 1, title: 'Deepest call depth in the tree' },
  {
    label: 'layers',
    value: `${usedLayers.size}/${LAYERS.length}`,
    title: 'Architecture layers with at least one span in them',
  },
  { label: 'attributes', value: ATTRIBUTES.length, title: 'Distinct technologies carried by spans' },
  {
    label: 'critical path',
    value: `${COVERAGE.onPath} spans`,
    title: 'Spans whose duration determines how long the whole trace took',
  },
];

export default function TraceSummary() {
  return (
    <div className="mt-7 sm:mt-8">
      <dl
        className="flex flex-wrap"
        style={{ borderTop: '1px solid var(--surface-border)', borderBottom: '1px solid var(--surface-border)' }}
      >
        {STATS.map((s) => (
          <div key={s.label} className="py-3 pr-6 sm:pr-8" title={s.title}>
            <dt
              className="text-[10px] font-mono uppercase tracking-[0.14em]"
              style={{ color: 'var(--text-4)' }}
            >
              {s.label}
            </dt>
            <dd
              className="text-[17px] font-mono tabular-nums mt-0.5"
              style={{ color: 'var(--text-1)' }}
            >
              {s.value}
            </dd>
          </div>
        ))}
      </dl>
      <p className="text-[11.5px] mt-2" style={{ color: 'var(--text-4)' }}>
        {COVERAGE.dated} of {COVERAGE.total} spans carry dates that were actually
        recorded; the rest are drawn across the window of the work they belong to
        and are excluded from the critical path. Every figure above is counted from
        the trace below.
      </p>
    </div>
  );
}
