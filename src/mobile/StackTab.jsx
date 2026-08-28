import { lazy, Suspense } from 'react';
import { skills, personalInfo } from '../data/portfolio';

const ArchitectureLab = lazy(() => import('../apps/ArchitectureLab'));

/* The desktop Skills app is an 800x500 SVG constellation — at 390px wide
   its labels are unreadable, so the phone gets a plain grouped list
   instead of the same graph shrunk. No proficiency bars: a "92% at Spring
   Boot" figure isn't something anyone can actually measure. */

export default function StackTab() {
  return (
    <div className="px-5 py-7">
      <h1 className="font-display text-[26px] leading-tight mb-6" style={{ color: 'var(--text-1)' }}>
        Stack
      </h1>

      <div className="space-y-7">
        {skills.map((group) => (
          <section key={group.category}>
            <h2
              className="text-[11px] font-mono uppercase tracking-[0.14em] mb-2.5 flex items-center gap-2"
              style={{ color: 'var(--text-4)' }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: group.color }} />
              {group.category}
            </h2>
            <div className="flex flex-wrap gap-x-3 gap-y-1.5">
              {group.items.map((item) => (
                <span key={item.name} className="text-[14px]" style={{ color: 'var(--text-2)' }}>
                  {item.name}
                </span>
              ))}
            </div>
          </section>
        ))}

        <section>
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
        </section>
      </div>

      <div className="mt-9 pt-7" style={{ borderTop: '1px solid var(--surface-border)' }}>
        <Suspense fallback={null}>
          <ArchitectureLab />
        </Suspense>
      </div>
    </div>
  );
}
