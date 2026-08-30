import { lazy, Suspense } from 'react';
import { skills, personalInfo } from '../data/portfolio';

const ArchitectureLab = lazy(() => import('../apps/ArchitectureLab'));

/* The desktop Skills app is an 800x500 SVG constellation — at 390px wide
   its labels are unreadable, so the phone can't just shrink it.

   The first version of this tab went the other way and became a flat
   grouped word list, which lost the only thing worth saying: these
   aren't six equal piles of tools, they're layers, and they sit in an
   order. A phone is tall and a stack is vertical, so the phone can
   actually draw the thing the desktop draws as a graph.

   No proficiency bars. A "92% at Spring Boot" figure isn't something
   anyone can measure, and the data's `level` numbers are ignored here on
   purpose. */

// Ordered top-down the way a request travels, with what each layer is
// for — the ordering is the claim, so it's stated rather than implied.
const LAYERS = [
  { category: 'System Design', role: 'how it is shaped' },
  { category: 'Backend', role: 'what runs' },
  { category: 'Messaging', role: 'how it moves' },
  { category: 'Databases', role: 'where it lands' },
  { category: 'DevOps', role: 'what it runs on' },
];

// Not a layer — a domain that happens to sit on top of the same stack.
const DOMAIN = 'Trading & Finance';

const byCategory = Object.fromEntries(skills.map((g) => [g.category, g]));

function Layer({ group, role, foundation }) {
  return (
    <div
      className="relative rounded-lg px-4 py-3.5"
      style={{
        background: 'var(--surface-alt)',
        border: '1px solid var(--surface-border)',
        // The base layer is the one everything above it stands on, so it
        // gets the heavier edge rather than a different shape.
        borderBottomWidth: foundation ? 3 : 1,
        borderBottomColor: foundation ? group.color : 'var(--surface-border)',
      }}
    >
      <span
        className="absolute left-0 top-3 bottom-3 w-[3px] rounded-full"
        style={{ background: group.color }}
      />
      <div className="flex items-baseline gap-2 flex-wrap">
        <span className="text-[13px] font-medium" style={{ color: 'var(--text-1)' }}>
          {group.category}
        </span>
        <span className="text-[11px] font-mono" style={{ color: 'var(--text-4)' }}>
          {role}
        </span>
      </div>
      <div className="flex flex-wrap gap-x-2.5 gap-y-1 mt-2">
        {group.items.map((item, i) => (
          <span key={item.name} className="text-[13px]" style={{ color: 'var(--text-2)' }}>
            {item.name}
            {i < group.items.length - 1 && (
              <span style={{ color: 'var(--text-4)' }}> ·</span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function StackTab() {
  const domain = byCategory[DOMAIN];

  return (
    <div className="px-5 py-7">
      <h1 className="font-display text-[26px] leading-tight" style={{ color: 'var(--text-1)' }}>
        Stack
      </h1>
      <p className="text-[13px] mt-1.5 mb-6" style={{ color: 'var(--text-3)' }}>
        Top to bottom, the way a request travels.
      </p>

      <div className="space-y-1.5">
        {LAYERS.map(({ category, role }, i) => {
          const group = byCategory[category];
          if (!group) return null;
          return (
            <Layer
              key={category}
              group={group}
              role={role}
              foundation={i === LAYERS.length - 1}
            />
          );
        })}
      </div>

      {domain && (
        <div className="mt-8">
          <h2
            className="text-[11px] font-mono uppercase tracking-[0.14em] mb-2.5"
            style={{ color: 'var(--text-4)' }}
          >
            Domain
          </h2>
          <Layer group={domain} role="what I build it for" />
        </div>
      )}

      <div className="mt-8">
        <h2
          className="text-[11px] font-mono uppercase tracking-[0.14em] mb-2.5"
          style={{ color: 'var(--text-4)' }}
        >
          Currently learning
        </h2>
        <div className="flex flex-wrap gap-x-3 gap-y-1.5">
          {personalInfo.currentlyLearning.map((item) => (
            <span key={item} className="text-[14px]" style={{ color: 'var(--text-2)' }}>
              {item}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-9 pt-7" style={{ borderTop: '1px solid var(--surface-border)' }}>
        <Suspense fallback={null}>
          <ArchitectureLab />
        </Suspense>
      </div>
    </div>
  );
}
