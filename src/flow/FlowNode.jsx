import { useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

/* A node is the hotspot: the thing you can fly to.

   Labels are drei <Html> rather than 3D text — eleven of them is well
   within what the DOM handles, and it means the type is genuinely crisp
   at any zoom, uses the same tokens as the rest of the OS, and can be
   read by a screen reader. Rendering them as extruded geometry would look
   more "3D" and be worse on every one of those counts.

   The ring around a node is not decoration: it appears on hover and
   selection so the click target is legible before you commit to it. */

export default function FlowNode({ node, selected, dimmed, onSelect, onHover, paused }) {
  const mesh = useRef();
  const [hovered, setHovered] = useState(false);
  const pos = useMemo(() => new THREE.Vector3(...node.position), [node.position]);

  useFrame((state) => {
    if (!mesh.current || paused) return;
    // A slow breath so an idle graph doesn't read as a still image.
    const t = state.clock.elapsedTime;
    const s = 1 + Math.sin(t * 0.9 + pos.x) * 0.018;
    mesh.current.scale.setScalar(s);
  });

  const active = selected || hovered;

  return (
    <group position={pos}>
      <mesh
        ref={mesh}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); onHover(node); document.body.style.cursor = 'pointer'; }}
        onPointerOut={(e) => { e.stopPropagation(); setHovered(false); onHover(null); document.body.style.cursor = ''; }}
        onClick={(e) => { e.stopPropagation(); onSelect(node); }}
      >
        <icosahedronGeometry args={[node.radius, 1]} />
        <meshStandardMaterial
          color={node.color}
          emissive={node.color}
          emissiveIntensity={active ? 0.45 : 0.12}
          roughness={0.7}
          metalness={0.05}
          flatShading
          transparent
          opacity={dimmed ? 0.16 : 0.72}
        />
      </mesh>

      {/* The wireframe shell is what stops these reading as marbles — it
          says "node in a diagram" rather than "glossy ball". */}
      <mesh scale={1.02} raycast={() => null}>
        <icosahedronGeometry args={[node.radius, 1]} />
        <meshBasicMaterial
          color={node.color}
          wireframe
          transparent
          opacity={dimmed ? 0.12 : active ? 0.85 : 0.4}
        />
      </mesh>

      {/* Hit area larger than the mesh — a 0.85-radius icosahedron is a
          fussy target at full-graph zoom. */}
      <mesh
        visible={false}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); onHover(node); document.body.style.cursor = 'pointer'; }}
        onPointerOut={(e) => { e.stopPropagation(); setHovered(false); onHover(null); document.body.style.cursor = ''; }}
        onClick={(e) => { e.stopPropagation(); onSelect(node); }}
      >
        <sphereGeometry args={[node.radius * 1.8, 12, 12]} />
      </mesh>

      <Html
        position={[0, node.radius + 0.62, 0]}
        center
        zIndexRange={[10, 0]}
        style={{ pointerEvents: 'none', opacity: dimmed ? 0.3 : 1, transition: 'opacity 200ms' }}
      >
        <div style={{ textAlign: 'center', whiteSpace: 'nowrap', userSelect: 'none' }}>
          <div
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 13,
              fontWeight: 600,
              color: active ? node.color : 'var(--text-1)',
              textShadow: '0 1px 6px rgba(0,0,0,0.9)',
            }}
          >
            {node.label}
          </div>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 9.5,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--text-4)',
              textShadow: '0 1px 6px rgba(0,0,0,0.9)',
            }}
          >
            {node.kind}
          </div>
        </div>
      </Html>
    </group>
  );
}
