import { TRACE, SPANS } from './trace';

/* Geometry — the only place a span's position is decided.

   Both renderers read from here: the HTML waterfall uses x/width as
   percentages, the WebGL scene uses the same numbers as world units.
   That's deliberate. If the flat view and the 3D view computed their own
   layouts they would drift, and the 90-degree orbit between them — the
   idea the whole concept rests on — only reads as one continuous object
   if both are literally the same coordinates.

     X   time          0 → 1 across the career
     Y   tree depth    root at 0, descending
     Z   layer         edge → compute → backbone → state → store → infra

   All three carry information. Nothing here may be adjusted to make the
   picture prettier: moving a span changes what it claims. */

export const LAYERS = ['edge', 'compute', 'backbone', 'state', 'store', 'infra', 'domain'];

export const LAYER_LABEL = {
  edge: 'Edge',
  compute: 'Compute',
  backbone: 'Event backbone',
  state: 'State',
  store: 'Storage',
  infra: 'Infrastructure',
  domain: 'Domain',
};

// Matches the flow graph's node colours so a span and its service-map
// counterpart are the same colour in both projections.
export const LAYER_COLOR = {
  edge: '#94a3b8',
  compute: '#a78bfa',
  backbone: '#22d3ee',
  state: '#f87171',
  store: '#38bdf8',
  infra: '#4ade80',
  domain: '#f59e0b',
};

const span0 = TRACE.start.getTime();
const total = Math.max(1, TRACE.durationMs);

/** Absolute time → 0..1 along the X axis. */
export function t(date) {
  if (!date) return 0;
  return Math.min(1, Math.max(0, (date.getTime() - span0) / total));
}

export const LAYOUT = Object.fromEntries(
  SPANS.map((s) => {
    const x = t(s.start);
    const x2 = t(s.end);
    return [
      s.id,
      {
        x,
        width: Math.max(0.004, x2 - x),
        y: s.depth,
        z: Math.max(0, LAYERS.indexOf(s.layer)),
        layer: s.layer,
        color: LAYER_COLOR[s.layer] || LAYER_COLOR.compute,
      },
    ];
  })
);

export const MAX_DEPTH = SPANS.reduce((n, s) => Math.max(n, s.depth), 0);

/** Year ticks for the time axis — real calendar years, not divisions. */
export const TICKS = (() => {
  const out = [];
  const first = TRACE.start.getFullYear();
  const last = TRACE.end.getFullYear();
  for (let y = first; y <= last; y += 1) {
    out.push({ year: y, x: t(new Date(y, 0, 1)) });
  }
  return out;
})();

/** Where the playhead sits, as a date, for a 0..1 scroll position. */
export function playheadDate(position) {
  return new Date(span0 + total * Math.min(1, Math.max(0, position)));
}

/** A span is "open" when the playhead is inside it. */
export function isOpenAt(spanId, position) {
  const l = LAYOUT[spanId];
  if (!l) return false;
  return position >= l.x && position <= l.x + l.width;
}
