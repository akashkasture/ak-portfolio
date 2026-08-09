export default function Wallpaper() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ background: 'var(--bg)' }}>
      {/* Static gradient mesh */}
      <div className="absolute inset-0 wallpaper-aurora" />
      {/* Slow-drifting accent blobs — transform-only animation, GPU-cheap */}
      <div className="absolute aurora-blob-a" style={{ width: '55vw', height: '55vw', top: '-12%', left: '-8%' }} />
      <div className="absolute aurora-blob-b" style={{ width: '50vw', height: '50vw', bottom: '-15%', right: '-10%' }} />
      {/* Dot grid, faded at the edges */}
      <div className="absolute inset-0 wallpaper-dots" />
      {/* Film grain */}
      <div className="absolute inset-0 wallpaper-noise" />
      {/* Vignette to ground the composition */}
      <div className="absolute inset-0 wallpaper-vignette" />
    </div>
  );
}
