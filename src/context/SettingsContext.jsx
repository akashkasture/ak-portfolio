import { createContext, useContext, useEffect, useState } from 'react';
import { useNotifications } from './NotificationContext';

const STORAGE_KEY = 'ak-os-settings';

const WALLPAPER_LABELS = { solarsystem: 'Solar System', aurora: 'Aurora', starfield: 'Starfield', gradient: 'Gradient', grid: 'Terminal Grid', minimal: 'Minimal' };

export const DEFAULT_SETTINGS = {
  // A fresh visitor lands on the quiet wallpaper: no WebGL boot, no 3D
  // texture download, nothing moving while they read. The solar system is
  // still fully intact and one click away in Settings.
  wallpaper: 'minimal', // solarsystem | aurora | starfield | gradient | grid | minimal
  wallpaperFx: true,        // drifting ambient blobs on/off (2D wallpapers)
  fxIntensity: 1,           // 0.3 – 1.5
  dockPosition: 'bottom',   // bottom | left | right
  dockSize: 48,             // base icon px
  dockMagnify: true,
  dockAutoHide: false,
  windowRadius: 14,
  /* Windows overlap by design, and at 0.82 the window underneath read as
     sharp text straight through the one on top — two documents interleaved
     on the same pixels. The backdrop blur doesn't rescue it: the drag
     wrapper's transform limits how much it can sample, so it only softens a
     fraction of the frame, and even 4% transparency still let headings read
     through. So windows are opaque and the glass stays where it belongs —
     the dock and the system bar. The slider still goes down to 0.55 for
     anyone who wants it back. */
  windowOpacity: 1,         // 0.55 – 1
  windowShadow: 'normal',   // soft | normal | strong

  // Solar system wallpaper
  spaceQuality: 'auto',          // auto | high | medium | low
  spacePlanetAnimation: true,
  spaceParticles: true,
  spaceShootingStars: true,
  spaceParallax: true,
  spaceNebula: true,
  spaceAmbientGlow: true,
  spaceParticleDensity: 'medium', // low | medium | high
};

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

const Ctx = createContext(null);

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(load);
  const { push } = useNotifications();

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(settings)); } catch { /* ignore */ }
    const root = document.documentElement;
    root.style.setProperty('--os-window-radius', `${settings.windowRadius}px`);
    root.style.setProperty('--os-window-alpha', String(settings.windowOpacity));
  }, [settings]);

  const set = (key, value) => {
    if (key === 'wallpaper' && value !== settings.wallpaper) {
      push({ title: 'Wallpaper Changed', body: WALLPAPER_LABELS[value] || value, kind: 'system' });
    }
    setSettings((s) => ({ ...s, [key]: value }));
  };
  const reset = () => setSettings(DEFAULT_SETTINGS);

  return <Ctx.Provider value={{ settings, set, reset }}>{children}</Ctx.Provider>;
}

export function useSettings() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}
