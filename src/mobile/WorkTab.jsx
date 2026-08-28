import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { experience, projects } from '../data/portfolio';

/* Experience and Projects answer the same question — "what has this
   person actually done" — so on a phone they're one scroll rather than
   two destinations to find separately.

   This deliberately doesn't reuse the desktop Experience/Projects
   components. Those are built around a full-page scroll: a centred hero
   heading, a category pill, oversized stat cards. Dropped into a 390px
   column that reads as a marketing page someone shrank, which is the
   one thing this workspace is not supposed to be. */

function Role({ exp, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="py-5" style={{ borderBottom: '1px solid var(--surface-border)' }}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full text-left flex items-start gap-3"
      >
        <div className="min-w-0 flex-1">
          <div className="text-[15px] font-medium" style={{ color: 'var(--text-1)' }}>
            {exp.role}
          </div>
          <div className="text-[13px] mt-0.5" style={{ color: 'var(--text-2)' }}>
            {exp.company}
          </div>
          <div className="text-[12px] font-mono mt-1" style={{ color: 'var(--text-4)' }}>
            {exp.period}
          </div>
        </div>
        <ChevronDown
          size={16}
          className="flex-shrink-0 mt-1 transition-transform"
          style={{ color: 'var(--text-4)', transform: open ? 'rotate(180deg)' : 'none' }}
        />
      </button>

      {open && (
        <ul className="mt-4 space-y-2.5">
          {exp.achievements.map((a) => (
            <li
              key={a}
              className="text-[13.5px] leading-relaxed pl-4 relative"
              style={{ color: 'var(--text-2)' }}
            >
              <span
                className="absolute left-0 top-[0.6em] w-1.5 h-px"
                style={{ background: 'var(--text-4)' }}
              />
              {a}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Project({ project }) {
  return (
    <div className="py-5" style={{ borderBottom: '1px solid var(--surface-border)' }}>
      <div className="text-[15px] font-medium" style={{ color: 'var(--text-1)' }}>
        {project.title}
      </div>
      <div className="text-[12px] font-mono mt-1" style={{ color: 'var(--text-4)' }}>
        {project.category}
      </div>
      <p className="text-[13.5px] leading-relaxed mt-2.5" style={{ color: 'var(--text-2)' }}>
        {project.description}
      </p>
      <div className="text-[12.5px] font-mono mt-2.5" style={{ color: 'var(--text-3)' }}>
        {project.tech.join(' · ')}
      </div>
    </div>
  );
}

export default function WorkTab() {
  return (
    <div className="px-5 py-7">
      <h1 className="font-display text-[26px] leading-tight mb-1" style={{ color: 'var(--text-1)' }}>
        Work
      </h1>

      <h2
        className="text-[11px] font-mono uppercase tracking-[0.14em] mt-7 mb-1"
        style={{ color: 'var(--text-4)' }}
      >
        Roles
      </h2>
      {/* Current role expanded, earlier ones collapsed — the thing
          someone is here to read is open, the history is one tap away. */}
      {experience.map((exp, i) => (
        <Role key={exp.id} exp={exp} defaultOpen={i === 0} />
      ))}

      <h2
        className="text-[11px] font-mono uppercase tracking-[0.14em] mt-9 mb-1"
        style={{ color: 'var(--text-4)' }}
      >
        Projects
      </h2>
      {projects.map((p) => (
        <Project key={p.id} project={p} />
      ))}
    </div>
  );
}
