import { createContext, useContext, useEffect, useState } from 'react';
import { useNotifications } from './NotificationContext';

const STORAGE_KEY = 'ak-os-settings';

const WALLPAPER_LABELS = { aurora: 'Aurora', starfield: 'Starfield', gradient: 'Gradient', grid: 'Terminal Grid', minimal: 'Minimal' };

export const DEFAULT_SETTINGS = {
  wallpaper: 'aurora',      // aurora | starfield | gradient | grid | minimal
  wallpaperFx: true,        // drifting ambient blobs on/off
  fxIntensity: 1,           // 0.3 – 1.5
  dockPosition: 'bottom',   // bottom | left | right
  dockSize: 48,             // base icon px
  dockMagnify: true,
  dockAutoHide: false,
  windowRadius: 14,
  windowOpacity: 0.82,      // 0.55 – 1
  windowShadow: 'normal',   // soft | normal | strong
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
