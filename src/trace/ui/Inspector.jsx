import { X, ArrowUpRight } from 'lucide-react';
import { SPAN_BY_ID, ancestorsOf } from '../data/trace';
import { LAYOUT, LAYER_LABEL } from '../data/layout';
import { useTrace, actions } from '../state/store';
import Figures from '../../components/Figures';

/* Everything known about one span.

   The case-study fields the concept calls for — problem, architecture,
   contribution, results — are read straight off the data and simply
   absent until they exist. There is no placeholder prose and no
   generated stand-in: an empty section says the work hasn't been
   written up, which is true, rather than inventing a narrative for a
   project it knows nothing about. */

function fmtRange(span) {
  const opts = { month: 'short', year: 'numeric' };
  const a = span.start.toLocaleDateString(undefined, opts);
  const b = span.end.toLocaleDateString(undefined, opts);
  return a === b ? a : `${a} — ${b}`;
}

function Field({ label, value }) {
  if (!value) return null;
  return (
    <div className="mt-4">
      <div
        className="text-[10.5px] font-mono uppercase tracking-[0.12em] mb-1.5"
        style={{ color: 'var(--text-4)' }}
      >
        {label}
      </div>
      <p className="text-[13.5px] leading-relaxed" style={{ color: 'var(--text-2)' }}>
        <Figures text={value} />
      </p>
    </div>
  );
}

export default function Inspector() {
  const state = useTrace();
  const span = state.focusId ? SPAN_BY_ID[state.focusId] : null;
  if (!span) return null;

  const l = LAYOUT[span.id];
  const d = span.detail || {};
  const chain = ancestorsOf(span.id);
  const caseStudy = [d.problem, d.architecture, d.contribution, d.challenges, d.results];
  const hasCaseStudy = caseStudy.some(Boolean);

  return (
    <aside
      className="rounded-lg p-5 h-full overflow-y-auto"
      style={{ background: 'var(--surface-alt)', border: '1px solid var(--surface-border)' }}
      aria-label={`Details for ${span.name}`}
    >
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          {chain.length > 0 && (
            <nav className="flex items-center gap-1.5 flex-wrap mb-2" aria-label="Breadcrumb">
              {chain.map((a) => (
                // Separator after each crumb, so the trail reads as a
                // path rather than as one run-on string of names.
                <span key={a.id} className="flex items-center gap-1.5">
                  <button
                    onClick={() => actions.focus(a.id)}
                    className="text-[11px] font-mono"
                    style={{ color: 'var(--text-4)' }}
                  >
                    {a.name}
                  </button>
                  <span className="text-[11px] font-mono" style={{ color: 'var(--text-4)' }}>
                    /
                  </span>
                </span>
              ))}
            </nav>
          )}
          <h2 className="text-[17px] font-medium leading-snug" style={{ color: 'var(--text-1)' }}>
            {span.name}
          </h2>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: l.color }} />
            <span className="text-[11px] font-mono" style={{ color: 'var(--text-3)' }}>
              {LAYER_LABEL[span.layer]}
            </span>
            <span style={{ color: 'var(--text-4)' }}>·</span>
            <span className="text-[11px] font-mono" style={{ color: 'var(--text-3)' }}>
              {d.period || fmtRange(span)}
            </span>
          </div>
        </div>
        <button onClick={() => actions.focus(null)} aria-label="Close" className="p-1 -mt-1 -mr-1">
          <X size={15} style={{ color: 'var(--text-4)' }} />
        </button>
      </div>

      {span.indeterminate && (
        <p
          className="mt-3 text-[11.5px] leading-relaxed pl-2.5"
          style={{ color: 'var(--text-4)', borderLeft: '2px solid var(--surface-border)' }}
        >
          Dates not recorded — drawn across the role it was built during.
        </p>
      )}

      {d.description && (
        <p className="text-[13.5px] leading-relaxed mt-4" style={{ color: 'var(--text-2)' }}>
          {d.description}
        </p>
      )}

      {d.proof?.length > 0 && (
        <div className="mt-4">
          <div
            className="text-[10.5px] font-mono uppercase tracking-[0.12em] mb-2"
            style={{ color: 'var(--text-4)' }}
          >
            Shipped
          </div>
          <ul className="space-y-2">
            {d.proof.map((line) => (
              <li
                key={line}
                className="text-[13px] leading-relaxed pl-3.5 relative"
                style={{ color: 'var(--text-2)' }}
              >
                <span className="absolute left-0 top-[0.62em] w-2 h-px" style={{ background: l.color }} />
                <Figures text={line} />
              </li>
            ))}
          </ul>
        </div>
      )}

      <Field label="Problem" value={d.problem} />
      <Field label="Architecture" value={d.architecture} />
      <Field label="My contribution" value={d.contribution} />
      <Field label="Challenges" value={d.challenges} />
      <Field label="Results" value={d.results} />

      {d.type === 'project' && !hasCaseStudy && (
        <p
          className="mt-4 text-[11.5px] leading-relaxed pl-2.5"
          style={{ color: 'var(--text-4)', borderLeft: '2px solid var(--surface-border)' }}
        >
          No write-up yet. Problem, architecture, contribution and results
          appear here once they exist in the project data.
        </p>
      )}

      {span.attributes.length > 0 && (
        <div className="mt-5 pt-4" style={{ borderTop: '1px solid var(--surface-border)' }}>
          <div
            className="text-[10.5px] font-mono uppercase tracking-[0.12em] mb-2"
            style={{ color: 'var(--text-4)' }}
          >
            Attributes
          </div>
          <div className="flex flex-wrap gap-1.5">
            {span.attributes.map((a) => {
              const active = state.filter === a.key;
              return (
                <button
                  key={a.key}
                  onClick={() => actions.toggleFilter(a.key)}
                  className="px-2 py-0.5 rounded text-[11.5px] font-mono"
                  style={{
                    color: active ? '#fff' : 'var(--text-2)',
                    background: active ? 'var(--os-accent)' : 'transparent',
                    border: `1px solid ${active ? 'var(--os-accent)' : 'var(--surface-border)'}`,
                  }}
                  title={active ? 'Clear filter' : `Light every span using ${a.key}`}
                >
                  {a.key}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {(d.github || d.live) && (
        <div className="mt-5 flex flex-col gap-px">
          {d.github && (
            <a
              href={d.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between py-2.5 text-[13px]"
              style={{ color: 'var(--text-1)', borderTop: '1px solid var(--surface-border)' }}
            >
              Source
              <ArrowUpRight size={14} style={{ color: 'var(--text-4)' }} />
            </a>
          )}
        </div>
      )}
    </aside>
  );
}
