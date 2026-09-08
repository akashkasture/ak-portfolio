import { Suspense } from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import SpanField from './SpanField';
import LinkField from './LinkField';
import CameraRig from './CameraRig';
import { LAYERS, TICKS } from '../data/layout';
import { SPAN_W, LAYER_D, ROW_H, boxOf } from './geometry';
import { useTrace, actions, litSpanIds, visibleSpanIds } from '../state/store';

/* The 3D field.

   No post-processing. Bloom over a field of coloured bars turns adjacent
   spans into one glowing smear, and the concept is explicit that an
   effect has to communicate something — a diagram that is harder to read
   with the effect on has failed. Tiering exists to cut particle budget
   and resolution, not to add a second renderer. */

function Grid({ projection }) {
  // Year lines belong to the time axis, layer lines to the depth axis;
  // each fades as its axis foreshortens, so the floor never contradicts
  // what the camera is actually showing.
  return (
    <group>
      {TICKS.map((tick) => (
        <line key={tick.year}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[
                new Float32Array([
                  tick.x * SPAN_W, 1.2, 0.6,
                  tick.x * SPAN_W, 1.2, -(LAYERS.length - 1) * LAYER_D - 0.6,
                ]),
                3,
              ]}
              count={2}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#1e2636" transparent opacity={0.55 * (1 - projection * 0.8)} />
        </line>
      ))}
      {LAYERS.map((layer, i) => (
        <line key={layer}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[
                new Float32Array([-1, 1.2, -i * LAYER_D, SPAN_W + 1, 1.2, -i * LAYER_D]),
                3,
              ]}
              count={2}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#1e2636" transparent opacity={0.2 + projection * 0.45} />
        </line>
      ))}
    </group>
  );
}

function Playhead({ playhead }) {
  const x = playhead * SPAN_W;
  return (
    <line>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[
            new Float32Array([
              x, 2.2, 1.2,
              x, -3 * ROW_H, -(LAYERS.length - 1) * LAYER_D - 1.2,
            ]),
            3,
          ]}
          count={2}
        />
      </bufferGeometry>
      <lineBasicMaterial color="#6366f1" transparent opacity={0.7} />
    </line>
  );
}

export default function TraceScene({ quality, reduced }) {
  const state = useTrace();
  const litIds = litSpanIds(state);
  const visibleIds = visibleSpanIds(state);

  /* Time literally collapses as the camera rotates to the service map.
     Squeezing X is what makes the topology readable from that angle —
     otherwise a 46-unit span seen end-on is a corridor, not a node — and
     it is a continuous transform of the same objects rather than a
     second scene, so the two views stay one thing rotating. */
  const timeScale = THREE.MathUtils.lerp(1, 0.07, state.projection);

  /* Extent of what is currently drawn, so the camera frames the tree as
     it stands rather than as it could be. Y has been measured this way
     all along; X is the same argument and was missing.

     At the top level it changes nothing — the root span runs the whole
     career by definition, so the drawn extent and the axis extent are
     the same 46 units. It matters once that stops being true: drilled
     into a role, or with the tree collapsed to a couple of branches, the
     camera used to keep framing 2020 whether or not anything was drawn
     there.

     Measured as each span's full extent rather than its centre, or a
     long bar hangs off the edge by half its own length. */
  const bounds = (() => {
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;
    for (const id of visibleIds) {
      const { position, scale } = boxOf(id);
      if (position[0] - scale[0] / 2 < minX) minX = position[0] - scale[0] / 2;
      if (position[0] + scale[0] / 2 > maxX) maxX = position[0] + scale[0] / 2;
      if (position[1] < minY) minY = position[1];
      if (position[1] > maxY) maxY = position[1];
    }
    return Number.isFinite(minY)
      ? { minX, maxX, minY, maxY }
      : { minX: 0, maxX: SPAN_W, minY: 0, maxY: 0 };
  })();

  return (
    <Canvas
      camera={{ position: [SPAN_W / 2, 8, 52], fov: 42, near: 0.5, far: 260 }}
      dpr={quality === 'low' ? 1 : [1, 1.75]}
      gl={{ antialias: quality !== 'low', powerPreference: 'high-performance' }}
      onPointerMissed={() => actions.focus(null)}
    >
      <color attach="background" args={['#05070d']} />
      <fog attach="fog" args={['#05070d', 60, 165]} />

      <Suspense fallback={null}>
        <CameraRig
          projection={state.projection}
          focusId={state.focusId}
          reduced={reduced}
          timeScale={timeScale}
          bounds={bounds}
        />
        <group scale={[timeScale, 1, 1]}>
          <Grid projection={state.projection} />
          <Playhead playhead={state.playhead} />
          <LinkField
            litIds={litIds}
            reduced={reduced || quality === 'low'}
            visibleIds={visibleIds}
          />
          <SpanField
            focusId={state.focusId}
            litIds={litIds}
            playhead={state.playhead}
            hovered={state.hoverId}
            visibleIds={visibleIds}
          />
        </group>
      </Suspense>
    </Canvas>
  );
}
