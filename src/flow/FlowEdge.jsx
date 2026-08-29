import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three';

/* An edge is a line plus the messages riding it.

   The particles are one InstancedMesh per edge rather than a mesh each —
   twelve edges times a handful of messages is a few hundred objects, and
   drawing them individually would cost more than the whole rest of the
   scene. Each instance carries a phase offset so they arrive staggered
   instead of marching in lockstep.

   `weight` sets how many particles ride the edge. It is a visual density
   and nothing more: it is not a throughput figure and is not presented as
   one anywhere in the UI. */

const dummy = new THREE.Object3D();

export default function FlowEdge({ edge, dimmed, paused, quality }) {
  const ref = useRef();
  const { fromNode, toNode, weight = 2, dashed, trader } = edge;

  const from = useMemo(() => new THREE.Vector3(...fromNode.position), [fromNode]);
  const to = useMemo(() => new THREE.Vector3(...toNode.position), [toNode]);

  // A slight arc keeps parallel edges from overlapping into one stripe.
  const curve = useMemo(() => {
    const mid = from.clone().lerp(to, 0.5);
    const offset = new THREE.Vector3(0, 0, 0.9).applyAxisAngle(
      new THREE.Vector3(0, 1, 0),
      (from.x + to.x) * 0.12
    );
    return new THREE.QuadraticBezierCurve3(from, mid.add(offset), to);
  }, [from, to]);

  const points = useMemo(() => curve.getPoints(28), [curve]);

  const count = quality === 'low' ? Math.max(1, Math.round(weight / 2)) : weight;

  const phases = useMemo(
    () => Array.from({ length: count }, (_, i) => i / count),
    [count]
  );

  useFrame((state) => {
    if (!ref.current || paused) return;
    const t = state.clock.elapsedTime * 0.22;
    for (let i = 0; i < count; i++) {
      const u = (t + phases[i]) % 1;
      const p = curve.getPointAt(u);
      dummy.position.copy(p);
      // Fade in and out at the ends so messages appear to enter and leave
      // a node rather than blink into existence in mid-air.
      const edgeFade = Math.min(u, 1 - u) * 6;
      const s = 0.135 * Math.min(1, edgeFade);
      dummy.scale.setScalar(s);
      dummy.updateMatrix();
      ref.current.setMatrixAt(i, dummy.matrix);
    }
    ref.current.instanceMatrix.needsUpdate = true;
  });

  const color = trader ? '#f59e0b' : '#67e8f9';

  return (
    <group>
      <Line
        points={points}
        color={trader ? '#b45309' : '#3b6ea5'}
        lineWidth={1.6}
        transparent
        opacity={dimmed ? 0.12 : 0.9}
        dashed={!!dashed}
        dashSize={0.3}
        gapSize={0.25}
      />
      <instancedMesh ref={ref} args={[undefined, undefined, count]} frustumCulled={false}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshBasicMaterial color={color} transparent opacity={dimmed ? 0.25 : 1} />
      </instancedMesh>
    </group>
  );
}
