import { ATTRIBUTE_GROUPS } from '../data/attributes';
import { useTrace, actions } from '../state/store';

/* Skills, as a filter rather than a place.

   This is the interaction the brief asked for — "click a technology,
   highlight the projects that used it" — and in a trace it isn't a
   feature, it's what span attributes are for. Selecting one lights every
   span carrying it across every role and project at once, which answers
   the question spatially instead of making someone read ten stacks and
   compare them in their head.

   Counts are shown because they're the honest measure of a skill here:
   how many pieces of real work it appears in. Not a percentage. */

export default function AttributeRail() {
  const state = useTrace();

  return (
    <div>
      <div className="flex items-baseline justify-between gap-3 mb-3">
        <span
          className="text-[10.5px] font-mono uppercase tracking-[0.12em]"
          style={{ color: 'var(--text-4)' }}
        >
          Attributes
        </span>
        {state.filter && (
          <button
            onClick={() => actions.toggleFilter(state.filter)}
            className="text-[11px] font-mono"
            style={{ color: 'var(--os-accent)' }}
          >
            clear
          </button>
        )}
      </div>

      <div className="space-y-4">
        {ATTRIBUTE_GROUPS.map((group) => (
          <section key={group.category}>
            <h3
              className="text-[10.5px] font-mono uppercase tracking-[0.1em] mb-1.5 flex items-center gap-1.5"
              style={{ color: 'var(--text-4)' }}
            >
              {group.color && (
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: group.color }} />
              )}
              {group.category}
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {group.items.map((attr) => {
                const active = state.filter === attr.key;
                return (
                  <button
                    key={attr.key}
                    onClick={() => actions.toggleFilter(attr.key)}
                    aria-pressed={active}
                    className="px-2 py-0.5 rounded text-[11.5px] font-mono flex items-center gap-1.5"
                    style={{
                      color: active ? '#fff' : 'var(--text-2)',
                      background: active ? 'var(--os-accent)' : 'transparent',
                      border: `1px solid ${active ? 'var(--os-accent)' : 'var(--surface-border)'}`,
                    }}
                  >
                    {attr.key}
                    <span
                      style={{
                        color: active ? 'rgba(255,255,255,0.7)' : 'var(--text-4)',
                        fontSize: 10,
                      }}
                    >
                      {attr.workCount}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
