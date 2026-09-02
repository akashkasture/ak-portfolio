import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const DEFAULT_POS = [0, 15, 32];
const ORIGIN = new THREE.Vector3(0, 0, 0);

export default function CameraRig({ parallax = true, focusPoint = null, home = DEFAULT_POS }) {
  const { camera, pointer } = useThree();
  const lookTarget = useRef(new THREE.Vector3(0, 0, 0));

  useFrame(() => {
    let goalPos;
    let goalLook;

    if (focusPoint) {
      const dir = focusPoint.clone().normalize();
      const dist = 3.6;
      goalPos = focusPoint.clone().add(dir.multiplyScalar(dist)).add(new THREE.Vector3(0, dist * 0.4, 0));
      goalLook = focusPoint;
    } else {
      goalPos = new THREE.Vector3(...home);
      if (parallax) {
        goalPos.x += pointer.x * 1.6;
        goalPos.y += pointer.y * 1.0;
      }
      goalLook = ORIGIN;
    }

    camera.position.lerp(goalPos, focusPoint ? 0.035 : 0.04);
    lookTarget.current.lerp(goalLook, 0.05);
    camera.lookAt(lookTarget.current);
  });

  return null;
}
