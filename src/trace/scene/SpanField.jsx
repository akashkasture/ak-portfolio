import { useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { SPANS, SPAN_BY_ID } from '../data/trace';
import { LAYOUT } from '../data/layout';
import { boxOf, INSTANCES } from './geometry';
import { actions } from '../state/store';

/* Every span in the trace, as one InstancedMesh — a single draw call for
   the whole field.

   ── On dimming ───────────────────────────────────────────────────────
   Filtering and focus dim what isn't relevant. The obvious way is
   per-instance opacity, which means a transparent material, which means
   depth sorting, which on a field of overlapping boxes means visible
   popping as the camera orbits.

   So nothing here is transparent. "Dimmed" is the instance colour lerped
   toward the background instead. It reads identically against a dark
   ground, keeps the whole field opaque and correctly depth-sorted, and
   stays one draw call. */

const BG = new THREE.Color('#05070d');
const tmpObj = new THREE.Object3D();
const tmpColor = new THREE.Color();

// Pre-resolved once — parsing colour strings per frame is the kind of
// thing that quietly costs more than the render.
const BASE_COLORS = INSTANCES.map((id) => new THREE.Color(LAYOUT[id].color));

export default function SpanField({ focusId, litIds, playhead, hovered }) {
  const meshRef = useRef(null);

  // Positions never change — the layout is static — so the matrices are
  // written once rather than every frame.
  useLayoutEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    INSTANCES.forEach((id, i) => {
      const { position, scale } = boxOf(id);
      tmpObj.position.set(...position);
      tmpObj.scale.set(...scale);
      tmpObj.updateMatrix();
      mesh.setMatrixAt(i, tmpObj.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  }, []);

  // Colour is the only thing that varies, and it varies on interaction
  // rather than per frame, so it is written on state change.
  useLayoutEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    INSTANCES.forEach((id, i) => {
      const span = SPAN_BY_ID[id];
      const l = LAYOUT[id];
      const lit = litIds ? litIds.has(id) : true;
      const open = playhead >= l.x && playhead <= l.x + l.width;
      const isFocus = focusId === id;
      const isHover = hovered === id;

      let strength = lit ? (open ? 1 : 0.62) : 0.1;
      if (isFocus || isHover) strength = 1.15;
      // A span with no recorded dates shouldn't read as confidently as
      // one that has them, the same way the flat view hatches it.
      if (span.indeterminate) strength *= 0.72;

      tmpColor.copy(BG).lerp(BASE_COLORS[i], Math.min(1, strength));
      mesh.setColorAt(i, tmpColor);
    });
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [focusId, litIds, playhead, hovered]);

  /* Siblings sit at the same Y by definition, so two roles a few months
     apart put their labels on top of each other. Alternating the lift by
     position among siblings separates them without moving the box, which
     would change what the picture claims. */
  const labelled = useMemo(() => {
    const rank = new Map();
    for (const s of SPANS) {
      const siblings = s.parentId ? SPAN_BY_ID[s.parentId].children : [s];
      rank.set(s.id, siblings.indexOf(s));
    }
    return SPANS.filter(
      (s) => s.depth <= 1 || s.id === focusId || s.id === hovered
    ).map((s) => ({ span: s, lift: 0.9 + (rank.get(s.id) % 2) * 1.25 }));
  }, [focusId, hovered]);

  return (
    <group>
      <instancedMesh
        ref={meshRef}
        args={[undefined, undefined, INSTANCES.length]}
        onPointerMove={(e) => {
          e.stopPropagation();
          const id = INSTANCES[e.instanceId];
          if (id) actions.hover(id);
        }}
        onPointerOut={() => actions.hover(null)}
        onClick={(e) => {
          e.stopPropagation();
          const id = INSTANCES[e.instanceId];
          if (id) actions.focus(focusId === id ? null : id);
        }}
      >
        <boxGeometry args={[1, 1, 1]} />
        {/* Unlit: these are diagram elements, and a shaded material makes
            the same colour mean two different things depending on which
            way a box happens to face.

            No `vertexColors` here. That flag makes the shader read a
            per-vertex `color` attribute, which BoxGeometry doesn't have,
            and every instance renders black. Per-instance colour comes
            through `instanceColor`, which three wires up on its own the
            first time setColorAt is called. */}
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>

      {labelled.map(({ span, lift }) => {
        const { position, scale } = boxOf(span.id);
        const lit = litIds ? litIds.has(span.id) : true;
        return (
          <Html
            key={span.id}
            position={[position[0] - scale[0] / 2, position[1] + lift, position[2]]}
            zIndexRange={[20, 0]}
            style={{ pointerEvents: 'none' }}
          >
            <div
              className="whitespace-nowrap text-[11px] font-mono"
              style={{
                color: lit ? 'var(--text-2)' : 'var(--text-4)',
                opacity: lit ? 1 : 0.4,
                transform: 'translateX(-2px)',
                textShadow: '0 1px 3px rgba(0,0,0,0.9)',
              }}
            >
              {span.name}
            </div>
          </Html>
        );
      })}
    </group>
  );
}
