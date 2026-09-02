import { Suspense, useCallback, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import Sun from './Sun';
import Planet from './Planet';
import Earth from './Earth';
import Saturn from './Saturn';
import Starfield from './Starfield';
import Nebula from './Nebula';
import FloatingParticles from './FloatingParticles';
import ShootingStars from './ShootingStars';
import CameraRig from './CameraRig';
import PlanetInfoPanel from './PlanetInfoPanel';
import PlanetDetailOverlay from './PlanetDetailOverlay';
import { trackEvent } from '../utils/analytics';
import { PLANETS, SUN } from './planetData';
import { texturesFor } from './textures';
import { STAGES, remap01, easeOutCubic, planetRevealWindow } from './introTimeline';
import { useDocumentVisible } from '../hooks/useDocumentVisible';

const textureMap = (tex) => ({
  mercury: tex.mercury,
  venus: tex.venusSurface,
  mars: tex.mars,
  jupiter: tex.jupiter,
  uranus: tex.uranus,
  neptune: tex.neptune,
});

/* Two framings of the same system. A phone is tall and narrow, so the
   desktop camera — low and close — puts Neptune's orbit somewhere off
   the left edge; the portrait framing pulls back and looks further down
   the plane, which trades a little drama for the whole system being on
   screen at once. Nothing else about the scene changes. */
const FRAMING = {
  desktop: { position: [0, 15, 32], fov: 48, home: [0, 15, 32] },
  portrait: { position: [0, 34, 46], fov: 62, home: [0, 34, 46] },
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
  nebula = true,
  particles = true,
  shootingStars = true,
  parallax = true,
  particleDensity = 'medium',
  introT = 1,
  planetAnimation = true,
  ambientGlow = true,
  /* Wallpaper behind a whole desktop, or a scene inside a panel. The
     only difference is which box it pins itself to. */
  fill = false,
  framing = 'desktop',
  /* Selection stays inside the scene — it owns the click point the
     camera needs, which a parent has no way to produce. A caller that
     wants its own detail UI supplies a renderer and gets handed the
     planet plus the way to close it. */
  renderSelection,
}) {
  const [hovered, setHovered] = useState(null);
  const [selected, setSelected] = useState(null); // { planet, point }
  const particleCount = particleDensity === 'low' ? 120 : particleDensity === 'high' ? 420 : 240;
  const tabVisible = useDocumentVisible();
  const view = FRAMING[framing] ?? FRAMING.desktop;
  const TEXTURE_MAP = textureMap(texturesFor(quality));

  const nebulaReveal = easeOutCubic(remap01(introT, ...STAGES.nebula));
  const sunReveal = easeOutCubic(remap01(introT, ...STAGES.sun));
  const orbitStartFactor = easeOutCubic(remap01(introT, ...STAGES.orbitStart));
  const effectiveTimeScale = selected || !planetAnimation ? 0 : timeScale * orbitStartFactor;
  const planetReveal = (id) => easeOutCubic(remap01(introT, ...planetRevealWindow(PLANETS.findIndex((p) => p.id === id))));

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
    <div className={fill ? 'absolute inset-0' : 'fixed inset-0'} style={{ background: '#04050b' }}>
      <Canvas
        camera={{ position: view.position, fov: view.fov, near: 0.1, far: 320 }}
        dpr={quality === 'low' ? 1 : quality === 'medium' ? [1, 1.5] : [1, 2]}
        gl={{ antialias: quality !== 'low', powerPreference: 'high-performance' }}
        onPointerMissed={() => setHovered(null)}
        frameloop={tabVisible ? 'always' : 'never'}
      >
        <color attach="background" args={['#04050b']} />
        <fogExp2 attach="fog" args={['#05060c', 0.0025]} />
        <ambientLight intensity={0.14} />
        <hemisphereLight args={['#3a4a7a', '#050508', 0.18]} />
        <CameraRig parallax={parallax && !selected} focusPoint={selected?.point ?? null} home={view.home} />

        <Suspense fallback={null}>
          <Starfield quality={quality} timeScale={effectiveTimeScale} />
          {nebula && <Nebula intensity={(quality === 'low' ? 0.6 : 1) * nebulaReveal} />}
          {particles && <FloatingParticles count={particleCount} />}
          {shootingStars && quality !== 'low' && !selected && introT >= 0.98 && <ShootingStars />}

          <Sun quality={quality} reveal={sunReveal} ambientGlow={ambientGlow} />
          <Earth
            quality={quality}
            timeScale={effectiveTimeScale}
            onHover={setHovered}
            onSelect={handleSelect}
            isSelected={selected?.planet.id === 'earth'}
            reveal={planetReveal('earth')}
            ambientGlow={ambientGlow}
          />
          <Saturn
            data={PLANETS.find((p) => p.id === 'saturn')}
            quality={quality}
            timeScale={effectiveTimeScale}
            onHover={setHovered}
            onSelect={handleSelect}
            isSelected={selected?.planet.id === 'saturn'}
            reveal={planetReveal('saturn')}
            ambientGlow={ambientGlow}
          />
          {PLANETS.filter((p) => !['earth', 'saturn'].includes(p.id)).map((p) => (
            <Planet
              key={p.id}
              data={p}
              texturePath={TEXTURE_MAP[p.id]}
              cloudsPath={p.id === 'venus' ? texturesFor(quality).venusAtmosphere : undefined}
              glow={GLOW_MAP[p.id]}
              quality={quality}
              timeScale={effectiveTimeScale}
              onHover={setHovered}
              onSelect={handleSelect}
              isSelected={selected?.planet.id === p.id}
              reveal={planetReveal(p.id)}
              ambientGlow={ambientGlow}
            />
          ))}
        </Suspense>
      </Canvas>

      {renderSelection ? (
        renderSelection(selected?.planet ?? null, handleClose)
      ) : (
        <>
          <PlanetInfoPanel planet={!selected ? hovered : null} />
          <PlanetDetailOverlay planet={selected?.planet ?? null} onClose={handleClose} />
        </>
      )}
    </div>
  );
}

export { SUN };
