import { Suspense, useCallback, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import Sun from './Sun';
import Planet from './Planet';
import Earth from './Earth';
import Saturn from './Saturn';
import Starfield from './Starfield';
import Nebula from './Nebula';
import BlackHole from './BlackHole';
import FloatingParticles from './FloatingParticles';
import ShootingStars from './ShootingStars';
import CameraRig from './CameraRig';
import PlanetInfoPanel from './PlanetInfoPanel';
import PlanetDetailOverlay from './PlanetDetailOverlay';
import { trackEvent } from '../utils/analytics';
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

export default function SpaceScene({
  quality = 'high',
  timeScale = 1,
  blackHole = true,
  nebula = true,
  particles = true,
  shootingStars = true,
  parallax = true,
  particleDensity = 'medium',
}) {
  const [hovered, setHovered] = useState(null);
  const [selected, setSelected] = useState(null); // { planet, point }
  const particleCount = particleDensity === 'low' ? 120 : particleDensity === 'high' ? 420 : 240;
  const effectiveTimeScale = selected ? 0 : timeScale;

  const handleSelect = useCallback((planet, point) => {
    setSelected({ planet, point });
    setHovered(null);
    trackEvent('space_planet_select', { planet: planet.name });
  }, []);

  const handleClose = useCallback(() => setSelected(null), []);

  useEffect(() => {
    if (!selected) return;
    const onKey = (e) => { if (e.key === 'Escape') handleClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selected, handleClose]);

  return (
    <div className="fixed inset-0" style={{ background: '#04050b' }}>
      <Canvas
        camera={{ position: [0, 15, 32], fov: 48, near: 0.1, far: 320 }}
        dpr={quality === 'low' ? 1 : quality === 'medium' ? [1, 1.5] : [1, 2]}
        gl={{ antialias: quality !== 'low', powerPreference: 'high-performance' }}
        onPointerMissed={() => setHovered(null)}
      >
        <color attach="background" args={['#04050b']} />
        <fogExp2 attach="fog" args={['#05060c', 0.0025]} />
        <ambientLight intensity={0.14} />
        <hemisphereLight args={['#3a4a7a', '#050508', 0.18]} />
        <CameraRig parallax={parallax && !selected} focusPoint={selected?.point ?? null} />

        <Suspense fallback={null}>
          <Starfield quality={quality} timeScale={effectiveTimeScale} />
          {nebula && <Nebula intensity={quality === 'low' ? 0.6 : 1} />}
          {blackHole && quality !== 'low' && <BlackHole quality={quality} />}
          {particles && <FloatingParticles count={particleCount} />}
          {shootingStars && quality !== 'low' && !selected && <ShootingStars />}

          <Sun quality={quality} />
          <Earth quality={quality} timeScale={effectiveTimeScale} onHover={setHovered} onSelect={handleSelect} isSelected={selected?.planet.id === 'earth'} />
          <Saturn
            data={PLANETS.find((p) => p.id === 'saturn')}
            quality={quality}
            timeScale={effectiveTimeScale}
            onHover={setHovered}
            onSelect={handleSelect}
            isSelected={selected?.planet.id === 'saturn'}
          />
          {PLANETS.filter((p) => !['earth', 'saturn'].includes(p.id)).map((p) => (
            <Planet
              key={p.id}
              data={p}
              texturePath={TEXTURE_MAP[p.id]}
              cloudsPath={p.id === 'venus' ? TEXTURES.venusAtmosphere : undefined}
              glow={GLOW_MAP[p.id]}
              quality={quality}
              timeScale={effectiveTimeScale}
              onHover={setHovered}
              onSelect={handleSelect}
              isSelected={selected?.planet.id === p.id}
            />
          ))}
        </Suspense>
      </Canvas>

      <PlanetInfoPanel planet={!selected ? hovered : null} />
      <PlanetDetailOverlay planet={selected?.planet ?? null} onClose={handleClose} />
    </div>
  );
}

export { SUN };
