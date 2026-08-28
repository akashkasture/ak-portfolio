/* One header for every app. It used to be a centred marketing hero: a
   pulsing green pill, a 60px heading, and a gradient-filled word — the
   look of a SaaS landing page, repeated five times inside an OS.

   Now it's a label, a title and a line of context, left-aligned like
   the rest of the reading. No entrance animation either: this sits at
   the top of a window's scroll container, so a scroll-triggered fade
   measured against the document viewport was leaving headers invisible
   until something scrolled them into view. */

export default function SectionHeader({ label, title, highlight, description }) {
  return (
    <header className="mb-8">
      {label && (
        <div
          className="text-[11px] font-mono uppercase tracking-[0.14em] mb-2"
          style={{ color: 'var(--text-4)' }}
        >
          {label}
        </div>
      )}
      <h2
        className="font-display text-[26px] @sm:text-[30px] leading-[1.15]"
        style={{ color: 'var(--text-1)' }}
      >
        {title}
        {highlight ? ` ${highlight}` : ''}
      </h2>
      {description && (
        <p
          className="mt-2.5 text-[14.5px] leading-relaxed max-w-prose"
          style={{ color: 'var(--text-3)' }}
        >
          {description}
        </p>
      )}
    </header>
  );
}
