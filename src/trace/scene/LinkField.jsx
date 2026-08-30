import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { LAYOUT } from '../data/layout';
import { boxOf, LINKS } from './geometry';

/* Parent → child links, and the packets riding them.

   The links are one LineSegments and the packets are one Points — two
   draw calls for the entire flow layer regardless of how many spans
   exist.

   The motion earns its place for the same reason it does on the phone:
   this is an event-driven system, and a still picture of one is
   indistinguishable from a picture of a synchronous one. Under reduced
   motion the packets aren't rendered at all — the links still show what
   is connected to what, which is the information; only the animation
   goes. */

const PER_LINK = 3;

export default function LinkField({ litIds, reduced }) {
  const pointsRef = useRef(null);

  /* A link leaves the parent's right edge and enters the child's left
     edge — the call site and the entry point, rather than centre to
     centre, which would draw lines straight through the boxes. */
  const { linePositions, paths } = useMemo(() => {
    const verts = [];
    const list = [];
    for (const link of LINKS) {
      const a = boxOf(link.from);
      const b = boxOf(link.to);
      const from = new THREE.Vector3(a.position[0] - a.scale[0] / 2, a.position[1], a.position[2]);
      const to = new THREE.Vector3(b.position[0] - b.scale[0] / 2, b.position[1], b.position[2]);
      verts.push(from.x, from.y, from.z, to.x, to.y, to.z);
      list.push({ ...link, from3: from, to3: to });
    }
    return { linePositions: new Float32Array(verts), paths: list };
  }, []);

  const packetGeom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const count = paths.length * PER_LINK;
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(count * 3), 3));
    const colors = new Float32Array(count * 3);
    const c = new THREE.Color();
    paths.forEach((p, i) => {
      c.set(LAYOUT[p.to].color);
      for (let k = 0; k < PER_LINK; k += 1) {
        const o = (i * PER_LINK + k) * 3;
        colors[o] = c.r;
        colors[o + 1] = c.g;
        colors[o + 2] = c.b;
      }
    });
    g.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return g;
  }, [paths]);

  useFrame(({ clock }) => {
    const pts = pointsRef.current;
    if (!pts || reduced) return;
    const attr = pts.geometry.getAttribute('position');
    const t = clock.elapsedTime;
    paths.forEach((p, i) => {
      for (let k = 0; k < PER_LINK; k += 1) {
        // Offsetting by k/PER_LINK spaces the packets evenly rather than
        // letting them clump at the start of every cycle.
        const u = (t * 0.28 + k / PER_LINK + i * 0.13) % 1;
        const idx = i * PER_LINK + k;
        attr.setXYZ(
          idx,
          p.from3.x + (p.to3.x - p.from3.x) * u,
          p.from3.y + (p.to3.y - p.from3.y) * u,
          p.from3.z + (p.to3.z - p.from3.z) * u
        );
      }
    });
    attr.needsUpdate = true;
  });

  // One filter state for the whole layer: with a filter on, the links
  // recede so the lit spans read, rather than each link being tested.
  const filtered = Boolean(litIds);

  return (
    <group>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[linePositions, 3]}
            count={linePositions.length / 3}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color="#4a5568"
          transparent
          opacity={filtered ? 0.1 : 0.28}
          toneMapped={false}
        />
      </lineSegments>

      {!reduced && (
        <points ref={pointsRef} geometry={packetGeom}>
          <pointsMaterial
            size={0.17}
            vertexColors
            transparent
            opacity={filtered ? 0.25 : 0.9}
            sizeAttenuation
            toneMapped={false}
          />
        </points>
      )}
    </group>
  );
}
