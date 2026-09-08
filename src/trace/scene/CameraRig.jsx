import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { CENTER, boxOf, LAYER_D } from './geometry';
import { LAYERS } from '../data/layout';

/* The camera, and the one constraint the whole concept rests on.

   Waterfall and service map are not two scenes. They are the same span
   field seen from two positions ninety degrees apart, and `projection`
   is where the camera sits on the arc between them:

     0 → looking down −Z   time reads across, depth reads down
     1 → looking down −X   time collapses, the topology resolves

   The camera can be anywhere on that arc and nowhere off it. That single
   constraint is what makes free camera control safe here — there is no
   way to end up under the floor, inside a box, or staring at nothing,
   so the user can explore without needing a reset button.

   Motion is exponential decay (THREE.MathUtils.damp), which is the
   overdamped limit of a spring: it eases to rest, never overshoots, and
   is frame-rate independent. A fixed-duration tween would arrive at the
   same place with a mechanical feel, and an underdamped spring would
   bounce — a camera that bounces reads as a toy rather than an
   instrument. */

// A little yaw at projection 0 so the waterfall still reads as a solid
// object rather than a flat chart that happens to be in a 3D canvas.
const REST_YAW = 0.11;
const FOCUS_RADIUS = 22;
/* A fixed pitch *angle*, not a fixed height. Height was the bug: the fit
   distance changes a lot across the arc, so a constant elevation meant
   the camera looked down by 4° in one view and 12° in another, and the
   further it pitched the more it sheared every horizontal bar into a
   diagonal. Held as an angle the tilt stays put no matter how far back
   the camera has to stand. */
const PITCH_DEG = 6;

/* Half-extents of the field. The width facing the camera changes
   completely across the arc — time at one end, architecture depth at the
   other — so a fixed radius that frames one projection leaves the other
   stranded in the middle of an empty canvas. The distance is solved per
   frame from the extent actually facing the camera and the viewport's
   real aspect instead of being guessed.

   The time half-extent is measured from the drawn spans rather than
   taken as half the axis. With the whole tree in view those are the same
   number, since the root span is the career; they diverge as soon as the
   view is drilled or collapsed, and then framing the axis means framing
   years in which nothing is drawn. */
const HALF_DEPTH = ((LAYERS.length - 1) * LAYER_D) / 2;
/* Breathing room around the fitted extent, and it has to survive both
   ends of the arc. 1.05 filled the waterfall nicely and then clipped the
   service map off the right and bottom edges, because the two
   projections present completely different shapes to the same frame. */
const FIT_MARGIN = 1.13;
const CLEARANCE = 9;
const Y_PAD = 1.6;
const X_PAD = 2.5;

function fitDistance(camera, projection, timeScale, halfHeight, halfTimeRaw) {
  const halfTime = halfTimeRaw * timeScale;
  // What faces the camera, and what recedes from it, swap over the arc.
  const halfAcross = THREE.MathUtils.lerp(halfTime, HALF_DEPTH, projection);
  const halfAlong = THREE.MathUtils.lerp(HALF_DEPTH, halfTime, projection);

  const vFov = THREE.MathUtils.degToRad(camera.fov);
  const hFov = 2 * Math.atan(Math.tan(vFov / 2) * camera.aspect);

  /* `halfAlong` is added, not max'd. The field has real depth along the
     view direction, and what has to fit the frame is its *nearest*
     plane, not its centre — solving for the centre let the closest row
     (the root span, on the front layer) overhang both edges. */
  const forWidth = halfAcross / Math.tan(hFov / 2) + halfAlong;
  const forHeight = halfHeight / Math.tan(vFov / 2) + halfAlong;

  /* Toward the service map the camera looks *down* the time axis, so a
     span's length recedes toward it. Without a floor the camera ends up
     inside the root span, which is exactly what it did. */
  return Math.max(forWidth, forHeight, halfAlong + CLEARANCE) * FIT_MARGIN;
}

const goalPos = new THREE.Vector3();
const goalTarget = new THREE.Vector3();
const center = new THREE.Vector3(...CENTER);

export default function CameraRig({ projection, focusId, reduced, timeScale, bounds }) {
  const target = useRef(new THREE.Vector3(...CENTER));
  const settled = useRef(false);

  useFrame(({ camera }, delta) => {
    const angle = REST_YAW + projection * (Math.PI / 2 - REST_YAW);

    /* Frame what is actually on screen, not the tree's deepest possible
       row. Sizing to MAX_DEPTH meant that with most of the tree
       collapsed the camera stood back far enough for rows that were not
       being drawn, and the visible spans sat high in an empty frame. */
    const midY = (bounds.minY + bounds.maxY) / 2;
    const halfHeight = (bounds.maxY - bounds.minY) / 2 + Y_PAD;
    const midX = (bounds.minX + bounds.maxX) / 2;
    /* A floor under the measured width. With one span selected and its
       children collapsed the occupied range can be a couple of units
       wide, and fitting that exactly puts the camera close enough to
       clip through the field. */
    const halfTimeRaw = Math.max(6, (bounds.maxX - bounds.minX) / 2 + X_PAD);

    // The field is scaled along X as time collapses, so the camera has to
    // aim at where a span actually is, not where it would be unscaled.
    if (focusId) {
      const { position } = boxOf(focusId);
      goalTarget.set(position[0] * timeScale, position[1], position[2]);
    } else {
      goalTarget.set(midX * timeScale, midY, center.z);
    }

    const radius = focusId
      ? FOCUS_RADIUS
      : fitDistance(camera, projection, timeScale, halfHeight, halfTimeRaw);
    const lift = radius * Math.sin(THREE.MathUtils.degToRad(PITCH_DEG));
    goalPos.set(
      goalTarget.x + Math.sin(angle) * radius,
      goalTarget.y + lift,
      goalTarget.z + Math.cos(angle) * radius
    );

    if (reduced || !settled.current) {
      // Reduced motion cuts rather than flies, and the first frame must
      // land composed instead of swooping in from the default position.
      camera.position.copy(goalPos);
      target.current.copy(goalTarget);
      settled.current = true;
    } else {
      const k = 4.5;
      camera.position.x = THREE.MathUtils.damp(camera.position.x, goalPos.x, k, delta);
      camera.position.y = THREE.MathUtils.damp(camera.position.y, goalPos.y, k, delta);
      camera.position.z = THREE.MathUtils.damp(camera.position.z, goalPos.z, k, delta);
      target.current.x = THREE.MathUtils.damp(target.current.x, goalTarget.x, k, delta);
      target.current.y = THREE.MathUtils.damp(target.current.y, goalTarget.y, k, delta);
      target.current.z = THREE.MathUtils.damp(target.current.z, goalTarget.z, k, delta);
    }

    camera.lookAt(target.current);
  });

  return null;
}
