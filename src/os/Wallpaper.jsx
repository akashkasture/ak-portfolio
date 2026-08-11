import { Suspense, lazy, useState } from 'react';
import { useSettings } from '../context/SettingsContext';
import { STAGES, remap01 } from '../space/introTimeline';
import { detectQualityTier, hasWebGLSupport } from '../space/detectQuality';

const SpaceScene = lazy(() => import('../space/SpaceScene'));

function CssWallpaper({ wallpaper, wallpaperFx, fxIntensity }) {
  const minimal = wallpaper === 'minimal';
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ background: 'var(--bg)' }}>
      {wallpaper === 'aurora' && <div className="absolute inset-0 wallpaper-aurora" />}
      {wallpaper === 'gradient' && <div className="absolute inset-0 wallpaper-gradient" />}
      {wallpaper === 'starfield' && (
        <>
          <div className="absolute inset-0 wallpaper-stars-a" />
          <div className="absolute inset-0 wallpaper-stars-b" />
        </>
      )}
      {wallpaper === 'grid' && <div className="absolute inset-0 wallpaper-terminal-grid" />}

      {/* Drifting ambient blobs — transform-only animation, GPU-cheap */}
      {wallpaperFx && !minimal && (
        <div className="absolute inset-0" style={{ opacity: fxIntensity }}>
          <div className="absolute aurora-blob-a" style={{ width: '55vw', height: '55vw', top: '-12%', left: '-8%' }} />
          <div className="absolute aurora-blob-b" style={{ width: '50vw', height: '50vw', bottom: '-15%', right: '-10%' }} />
        </div>
      )}

      {(wallpaper === 'aurora' || wallpaper === 'gradient') && (
        <div className="absolute inset-0 wallpaper-dots" />
      )}
      {!minimal && <div className="absolute inset-0 wallpaper-noise" />}
      <div className="absolute inset-0 wallpaper-vignette" />
    </div>
  );
}

export default function Wallpaper({ introT = 1 }) {
  const { settings } = useSettings();
  const {
    wallpaper, wallpaperFx, fxIntensity, spaceQuality,
    spaceBlackHole, spaceNebula, spaceParticles, spaceShootingStars, spaceParticleDensity, spaceParallax,
    spacePlanetAnimation, spaceAmbientGlow,
  } = settings;

  // Device capability probing touches the DOM (a throwaway canvas) and
  // navigator, so it's a one-time lazy-init rather than a useMemo — same
  // exemption pattern already used elsewhere in this codebase for
  // one-time impure reads (e.g. Clock's useState(() => new Date())).
  const [webglOk] = useState(() => hasWebGLSupport());
  const [autoQuality] = useState(() => detectQualityTier());

  if (wallpaper === 'solarsystem' && webglOk) {
    const resolvedQuality = spaceQuality === 'auto' ? autoQuality : spaceQuality;
    // Curtain hides the freshly-rendered starfield until the very first
    // reveal beat, so "stars appear" reads as an intentional first frame
    // rather than a pop from the fallback background color.
    const curtainOpacity = 1 - remap01(introT, ...STAGES.curtain);
    return (
      <Suspense fallback={<div className="fixed inset-0" style={{ background: '#04050b' }} />}>
        <SpaceScene
          quality={resolvedQuality}
          blackHole={spaceBlackHole}
          nebula={spaceNebula}
          particles={spaceParticles}
          shootingStars={spaceShootingStars}
          particleDensity={spaceParticleDensity}
          parallax={spaceParallax}
          introT={introT}
          planetAnimation={spacePlanetAnimation}
          ambientGlow={spaceAmbientGlow}
        />
        {curtainOpacity > 0 && (
          <div
            className="fixed inset-0 pointer-events-none"
            style={{ background: '#000000', opacity: curtainOpacity, zIndex: 1 }}
          />
        )}
      </Suspense>
    );
  }

  // WebGL unavailable but Solar System was selected — fall back to the
  // starfield CSS wallpaper rather than crashing on a missing context.
  const effectiveWallpaper = wallpaper === 'solarsystem' && !webglOk ? 'starfield' : wallpaper;
  return <CssWallpaper wallpaper={effectiveWallpaper} wallpaperFx={wallpaperFx} fxIntensity={fxIntensity} />;
}
