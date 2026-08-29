import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import FlowNode from './FlowNode';
import FlowEdge from './FlowEdge';
import FlowCameraRig from './FlowCameraRig';
import { GRAPH, RESOLVED_EDGES } from './graph';

/* The scene itself. Deliberately no post-processing, no bloom and no
   god rays: the graph has to stay readable as a diagram first, and a
   bloom pass over eleven emissive nodes turns labels into mush. */

export default function FlowScene({ selected, onSelect, onHover, quality, reduced }) {
  const paused = reduced;

  return (
    <Canvas
      camera={{ position: [0, 1, 26], fov: 50 }}
      dpr={quality === 'low' ? 1 : [1, 1.75]}
      gl={{ antialias: quality !== 'low', powerPreference: 'high-performance' }}
      onPointerMissed={() => onSelect(null)}
    >
      <color attach="background" args={['#05070d']} />
      <fog attach="fog" args={['#05070d', 26, 62]} />

      <ambientLight intensity={0.55} />
      <directionalLight position={[6, 10, 8]} intensity={0.7} />
      <pointLight position={[-8, -6, 6]} intensity={0.4} color="#22d3ee" />

      <Suspense fallback={null}>
        <FlowCameraRig focus={selected} reduced={reduced} />

        {RESOLVED_EDGES.map((e) => (
          <FlowEdge
            key={`${e.from}-${e.to}`}
            edge={e}
            quality={quality}
            paused={paused}
            dimmed={!!selected && selected.id !== e.from && selected.id !== e.to}
          />
        ))}

        {GRAPH.map((n) => (
          <FlowNode
            key={n.id}
            node={n}
            selected={selected?.id === n.id}
            dimmed={!!selected && selected.id !== n.id}
            onSelect={onSelect}
            onHover={onHover}
            paused={paused}
          />
        ))}
      </Suspense>
    </Canvas>
  );
}
