import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/* Fly-to, the same move the solar system uses: lerp the camera toward a
   goal every frame rather than running a timed tween, so a second click
   mid-flight redirects smoothly instead of fighting an animation that is
   still playing.

   The camera stops short of the node and slightly above it, and the rest
   of the graph stays in frame behind — focus + context, not a drill-down
   into an empty void. */

const HOME = new THREE.Vector3(0, 1, 26);
const ORIGIN = new THREE.Vector3(0, 0, 0);

export default function FlowCameraRig({ focus, parallax = true, reduced }) {
  const { camera, pointer } = useThree();
  const look = useRef(new THREE.Vector3(0, 0, 0));

  useFrame(() => {
    let goal;
    let goalLook;

    if (focus) {
      const target = new THREE.Vector3(...focus.position);
      // Stand off by the node's own size. At a fixed 5.2 the node filled a
      // third of the screen and pushed every neighbour out of frame, which
      // turned focus + context into a drill-down.
      const standoff = focus.radius * 4.5 + 7.5;
      goal = target.clone().add(new THREE.Vector3(1.2, 1.6, standoff));
      goalLook = target;
    } else {
      goal = HOME.clone();
      if (parallax && !reduced) {
        goal.x += pointer.x * 2.2;
        goal.y += pointer.y * 1.4;
      }
      goalLook = ORIGIN;
    }

    camera.position.lerp(goal, reduced ? 1 : 0.045);
    look.current.lerp(goalLook, reduced ? 1 : 0.06);
    camera.lookAt(look.current);
  });

  return null;
}
