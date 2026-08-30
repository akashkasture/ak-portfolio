import { LAYOUT, LAYERS, MAX_DEPTH } from '../data/layout';
import { SPANS, SPAN_BY_ID } from '../data/trace';

/* Layout coordinates → world units.

   `data/layout.js` is the single source of where a span sits; this only
   scales it into the scene. The flat waterfall and the 3D field read
   the same x/width/y/z, which is the whole reason the two projections
   read as one object rotating rather than two pictures cross-fading.

   All three axes carry information, so none of these constants may be
   nudged to improve the composition — changing them changes what the
   picture claims about when something happened, how deeply it nests, or
   which layer of the stack it belongs to. */

export const SPAN_W = 46; // X: the full career, end to end
export const ROW_H = 3.4; // Y: one level of call depth
export const LAYER_D = 3.4; // Z: one architecture layer
export const BAR_H = 0.5;
export const BAR_D = 0.5;
export const MIN_BAR = 0.4; // a span shorter than this is still clickable

export const CENTER = [
  SPAN_W / 2,
  (-MAX_DEPTH * ROW_H) / 2,
  (-(LAYERS.length - 1) * LAYER_D) / 2,
];

/** World-space box for one span: centre and size. */
export function boxOf(spanId) {
  const l = LAYOUT[spanId];
  return {
    position: [(l.x + l.width / 2) * SPAN_W, -l.y * ROW_H, -l.z * LAYER_D],
    scale: [Math.max(MIN_BAR, l.width * SPAN_W), BAR_H, BAR_D],
    color: l.color,
  };
}

/* Instance order is fixed once, here, so every per-frame buffer write
   indexes the same span it did last frame. Deriving it separately in
   each component is how instanced meshes end up colouring the wrong
   box. */
export const INSTANCES = SPANS.map((s) => s.id);
export const INDEX_OF = Object.fromEntries(INSTANCES.map((id, i) => [id, i]));

/* Parent → child links. In a trace this is the call relationship: the
   parent span is what invoked the child. It is the same set of edges in
   both projections, which is what keeps the orbit coherent — rotating
   the camera must not change what is connected to what. */
export const LINKS = SPANS.filter((s) => s.parentId && SPAN_BY_ID[s.parentId]).map((s) => ({
  id: `${s.parentId}->${s.id}`,
  from: s.parentId,
  to: s.id,
}));
