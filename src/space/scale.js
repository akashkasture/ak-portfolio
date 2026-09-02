import { PLANETS } from './planetData';

/* The one thing an orrery cannot tell the truth about.

   Every orrery ever built lies about scale twice: the bodies are far too
   big and the gaps far too small, because a model with honest
   proportions is either empty or invisible. `planetData` says as much in
   its own header — the orbit radii and sizes in the scene are compressed
   on purpose.

   So the numbers get their own view, drawn to the real proportions with
   nothing compressed. The figures are parsed straight out of the display
   strings rather than duplicated as separate numeric fields, so the bar
   and the caption next to it can never drift apart. */

/** '139,820 km' → 139820 · '1.43B km' → 1_430_000_000 */
export function km(text) {
  const match = /^([\d,.]+)\s*([MB])?/.exec(text);
  if (!match) return 0;
  const value = Number(match[1].replace(/,/g, ''));
  const scale = match[2] === 'B' ? 1e9 : match[2] === 'M' ? 1e6 : 1;
  return value * scale;
}

const MAX_DIAMETER = Math.max(...PLANETS.map((p) => km(p.diameterKm)));
const MAX_DISTANCE = Math.max(...PLANETS.map((p) => km(p.distanceFromSun)));

/* Linear, never logarithmic. A log axis would make Mercury's bar a
   comfortable half of Jupiter's, which is exactly the impression the
   compressed scene already gives and precisely the thing being
   corrected. Mercury really is a 3% sliver, and Neptune really is
   seventy-eight times further out than Mercury; a sliver is the honest
   picture. */
export const DIAMETER_SCALE = PLANETS.map((p) => ({
  id: p.id,
  name: p.name,
  color: p.color,
  label: p.diameterKm,
  fraction: km(p.diameterKm) / MAX_DIAMETER,
}));

export const DISTANCE_SCALE = PLANETS.map((p) => ({
  id: p.id,
  name: p.name,
  color: p.color,
  label: p.distanceFromSun,
  fraction: km(p.distanceFromSun) / MAX_DISTANCE,
}));
