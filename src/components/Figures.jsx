/* Achievement lines carry the numbers that matter — 15K+ daily messages,
   99.95% uptime, $50M+/month — buried mid-sentence in body text, where a
   recruiter skimming for thirty seconds slides straight past them.

   This lifts them typographically and nothing else. It does not
   reformat, reorder, round, or restate a single figure: the strings come
   from portfolio.js verbatim and are re-emitted verbatim, with the
   numeric runs wrapped. Anything that computed or invented a number here
   would be exactly the fabrication this portfolio is built to avoid. */

// $50M+ · 99.95% · 15K+ · 5K+ · 30% · 2
const FIGURE = /(\$?\d[\d,.]*(?:[KMB]\+?|\+)?%?)/g;

export default function Figures({ text, color = 'var(--text-1)' }) {
  const parts = text.split(FIGURE);
  return parts.map((part, i) =>
    // split() puts captured groups at the odd indices.
    i % 2 === 1 ? (
      // Mono has a taller x-height than the body sans, so at an equal
      // font-size the numbers sit visibly larger and the line jumps.
      <span key={i} className="font-mono font-medium" style={{ color, fontSize: '0.95em' }}>
        {part}
      </span>
    ) : (
      part
    )
  );
}
