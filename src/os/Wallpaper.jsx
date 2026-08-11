import { Suspense, lazy } from 'react';
import { useSettings } from '../context/SettingsContext';

const SpaceScene = lazy(() => import('../space/SpaceScene'));

export default function Wallpaper() {
  const { settings } = useSettings();
  const {
    wallpaper, wallpaperFx, fxIntensity, spaceQuality,
    spaceBlackHole, spaceNebula, spaceParticles, spaceShootingStars, spaceParticleDensity, spaceParallax,
  } = settings;
  const minimal = wallpaper === 'minimal';

  if (wallpaper === 'solarsystem') {
    const resolvedQuality = spaceQuality === 'auto' ? 'high' : spaceQuality;
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
        />
      </Suspense>
    );
  }

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
