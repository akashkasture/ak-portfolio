import { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import Sun from './Sun';
import Planet from './Planet';
import Earth from './Earth';
import Saturn from './Saturn';
import Starfield from './Starfield';
import PlanetInfoPanel from './PlanetInfoPanel';
import { PLANETS, SUN } from './planetData';
import { TEXTURES } from './textures';

const TEXTURE_MAP = {
  mercury: TEXTURES.mercury,
  venus: TEXTURES.venusSurface,
  mars: TEXTURES.mars,
  jupiter: TEXTURES.jupiter,
  uranus: TEXTURES.uranus,
  neptune: TEXTURES.neptune,
};

const GLOW_MAP = {
  mercury: null,
  venus: '#e8c9a0',
  mars: '#e08a5c',
  jupiter: '#e0c39a',
  uranus: '#9fe0e5',
  neptune: '#7a9bff',
};

export default function SpaceScene({ quality = 'high', timeScale = 1 }) {
  const [hovered, setHovered] = useState(null);

  return (
    <div className="fixed inset-0" style={{ background: '#04050b' }}>
      <Canvas
        camera={{ position: [0, 15, 32], fov: 48, near: 0.1, far: 300 }}
        dpr={quality === 'low' ? 1 : quality === 'medium' ? [1, 1.5] : [1, 2]}
        gl={{ antialias: quality !== 'low', powerPreference: 'high-performance' }}
        onPointerMissed={() => setHovered(null)}
      >
        <color attach="background" args={['#04050b']} />
        <fogExp2 attach="fog" args={['#05060c', 0.0025]} />
        <ambientLight intensity={0.14} />
        <hemisphereLight args={['#3a4a7a', '#050508', 0.18]} />

        <Suspense fallback={null}>
          <Sun quality={quality} />
          <Earth quality={quality} timeScale={timeScale} onHover={setHovered} />
          <Saturn data={PLANETS.find((p) => p.id === 'saturn')} quality={quality} timeScale={timeScale} onHover={setHovered} />
          {PLANETS.filter((p) => !['earth', 'saturn'].includes(p.id)).map((p) => (
            <Planet
              key={p.id}
              data={p}
              texturePath={TEXTURE_MAP[p.id]}
              cloudsPath={p.id === 'venus' ? TEXTURES.venusAtmosphere : undefined}
              glow={GLOW_MAP[p.id]}
              quality={quality}
              timeScale={timeScale}
              onHover={setHovered}
            />
          ))}
          <Starfield quality={quality} timeScale={timeScale} />
        </Suspense>
      </Canvas>

      <PlanetInfoPanel planet={hovered} />
    </div>
  );
}

export { SUN };
