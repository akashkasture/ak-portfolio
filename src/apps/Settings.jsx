import { useState } from 'react';
import {
  Check, Image, RotateCcw, Palette, PanelBottom, AppWindow, Info, Keyboard, Orbit,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useSettings } from '../context/SettingsContext';
import { trackEvent } from '../utils/analytics';

const ACCENT_SWATCHES = [
  { id: 'default', label: 'Default', colors: ['#6366f1', '#06b6d4'] },
  { id: 'midnight', label: 'Midnight', colors: ['#4f46e5', '#7c3aed'] },
  { id: 'terminal', label: 'Terminal', colors: ['#22c55e', '#16a34a'] },
  { id: 'arctic', label: 'Arctic', colors: ['#0ea5e9', '#38bdf8'] },
  { id: 'cyber', label: 'Cyber', colors: ['#ec4899', '#a855f7'] },
];

const WALLPAPERS = [
  { id: 'solarsystem', label: 'Solar System', preview: 'radial-gradient(circle at 38% 45%, #ffdca8, #ff9d42 22%, transparent 45%), radial-gradient(1px 1px at 15% 20%, #fff, transparent 30%), radial-gradient(1px 1px at 75% 15%, #fff, transparent 30%), radial-gradient(1.5px 1.5px at 60% 75%, #818cf8, transparent 30%), radial-gradient(1px 1px at 85% 60%, #fff, transparent 30%), #04050b' },
  { id: 'aurora', label: 'Aurora', preview: 'radial-gradient(ellipse 70% 60% at 25% 20%, rgba(99,102,241,0.5), transparent 65%), radial-gradient(ellipse 60% 50% at 80% 85%, rgba(6,182,212,0.4), transparent 60%), #06060c' },
  { id: 'starfield', label: 'Starfield', preview: 'radial-gradient(1px 1px at 20% 30%, #fff, transparent 30%), radial-gradient(1px 1px at 70% 60%, #fff, transparent 30%), radial-gradient(1.5px 1.5px at 45% 75%, #818cf8, transparent 30%), radial-gradient(1px 1px at 85% 20%, #fff, transparent 30%), #04040a' },
  { id: 'gradient', label: 'Gradient', preview: 'linear-gradient(140deg, rgba(99,102,241,0.6), #0a0a14 45%, rgba(6,182,212,0.5))' },
  { id: 'grid', label: 'Terminal', preview: 'linear-gradient(rgba(34,197,94,0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.25) 1px, transparent 1px), #04070a', previewSize: '12px 12px' },
  { id: 'minimal', label: 'Minimal', preview: '#08080e' },
];

const SHORTCUTS = [
  { keys: ['⌘', 'K'], desc: 'Search / command palette' },
  { keys: ['⌘', 'P'], desc: 'Command palette' },
  { keys: ['Esc'], desc: 'Close palette' },
  { keys: ['Drag title bar'], desc: 'Move window' },
  { keys: ['Drag to screen edge'], desc: 'Snap left / right / maximize' },
  { keys: ['Double-click title bar'], desc: 'Maximize / restore' },
  { keys: ['Drag corner'], desc: 'Resize window' },
];

const SECTIONS = [
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'wallpaper', label: 'Wallpaper', icon: Image },
  { id: 'space', label: 'Space', icon: Orbit },
  { id: 'dock', label: 'Dock', icon: PanelBottom },
  { id: 'windows', label: 'Windows', icon: AppWindow },
  { id: 'shortcuts', label: 'Keyboard', icon: Keyboard },
  { id: 'about', label: 'About AK OS', icon: Info },
];

function Row({ label, hint, children }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3" style={{ borderBottom: '1px solid var(--surface-border)' }}>
      <div className="min-w-0">
        <div className="text-sm" style={{ color: 'var(--text-1)' }}>{label}</div>
        {hint && <div className="text-xs mt-0.5" style={{ color: 'var(--text-4)' }}>{hint}</div>}
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  );
}

function Toggle({ checked, onChange, label }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className="relative w-10 h-6 rounded-full transition-colors duration-200"
      style={{ background: checked ? 'var(--os-accent)' : 'rgba(255,255,255,0.14)' }}
    >
      <span
        className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-200"
        style={{ left: checked ? 18 : 2 }}
      />
    </button>
  );
}

function Slider({ value, onChange, min, max, step = 1, label }) {
  return (
    <input
      type="range"
      value={value}
      min={min}
      max={max}
      step={step}
      aria-label={label}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-36"
      style={{ accentColor: 'var(--os-accent)' }}
    />
  );
}

function Segmented({ value, options, onChange }) {
  return (
    <div className="flex rounded-lg p-0.5" style={{ background: 'rgba(255,255,255,0.06)' }}>
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className="px-3 py-1.5 rounded-md text-xs font-medium transition-all"
          style={{
            background: value === opt.value ? 'var(--os-accent)' : 'transparent',
            color: value === opt.value ? '#fff' : 'var(--text-3)',
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function AppearancePane() {
  const { theme, toggle, accent, setAccent } = useTheme();
  return (
    <>
      <Row label="Mode">
        <Segmented
          value={theme}
          onChange={(v) => { if (v !== theme) toggle(); }}
          options={[{ value: 'dark', label: 'Dark' }, { value: 'light', label: 'Light' }]}
        />
      </Row>
      <div className="py-3" style={{ borderBottom: '1px solid var(--surface-border)' }}>
        <div className="text-sm mb-3" style={{ color: 'var(--text-1)' }}>Accent</div>
        <div className="flex flex-wrap gap-2">
          {ACCENT_SWATCHES.map(({ id, label, colors }) => (
            <button
              key={id}
              onClick={() => { setAccent(id); trackEvent('accent_theme_change', { accent: id }); }}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all"
              style={{
                border: `1px solid ${accent === id ? colors[0] : 'var(--surface-border)'}`,
                background: accent === id ? `${colors[0]}12` : 'rgba(255,255,255,0.03)',
                color: accent === id ? colors[0] : 'var(--text-2)',
              }}
            >
              <span className="w-4 h-4 rounded-full flex-shrink-0" style={{ background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})` }} />
              {label}
              {accent === id && <Check size={12} />}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

function WallpaperPane() {
  const { settings, set } = useSettings();
  return (
    <>
      <div className="py-3" style={{ borderBottom: '1px solid var(--surface-border)' }}>
        <div className="text-sm mb-3" style={{ color: 'var(--text-1)' }}>Wallpaper</div>
        <div className="grid grid-cols-2 @sm:grid-cols-3 gap-3">
          {WALLPAPERS.map(({ id, label, preview, previewSize }) => (
            <button
              key={id}
              onClick={() => { set('wallpaper', id); trackEvent('wallpaper_change', { wallpaper: id }); }}
              className="group text-left"
            >
              <div
                className="aspect-video rounded-lg mb-1.5 transition-all"
                style={{
                  background: preview,
                  backgroundSize: previewSize,
                  outline: settings.wallpaper === id ? '2px solid var(--os-accent)' : '1px solid var(--surface-border)',
                  outlineOffset: 2,
                }}
              />
              <span className="text-xs" style={{ color: settings.wallpaper === id ? 'var(--os-accent)' : 'var(--text-3)' }}>{label}</span>
            </button>
          ))}
        </div>
      </div>
      <Row label="Ambient motion" hint="Slow-drifting accent glow">
        <Toggle checked={settings.wallpaperFx} onChange={(v) => set('wallpaperFx', v)} label="Ambient motion" />
      </Row>
      {settings.wallpaperFx && (
        <Row label="Effect intensity">
          <Slider value={settings.fxIntensity} onChange={(v) => set('fxIntensity', v)} min={0.3} max={1.5} step={0.1} label="Effect intensity" />
        </Row>
      )}
    </>
  );
}

function SpacePane() {
  const { settings, set } = useSettings();
  const isActive = settings.wallpaper === 'solarsystem';
  return (
    <>
      {!isActive && (
        <div
          className="text-xs rounded-lg px-3 py-2.5 mb-1"
          style={{ background: 'rgba(255,255,255,0.04)', color: 'var(--text-4)', border: '1px solid var(--surface-border)' }}
        >
          These apply when the Solar System wallpaper is active — pick it under Wallpaper to see them live.
        </div>
      )}
      <Row label="Quality" hint="Auto picks a tier from your device's cores and memory">
        <Segmented
          value={settings.spaceQuality}
          onChange={(v) => set('spaceQuality', v)}
          options={[{ value: 'auto', label: 'Auto' }, { value: 'high', label: 'High' }, { value: 'medium', label: 'Medium' }, { value: 'low', label: 'Low' }]}
        />
      </Row>
      <Row label="Particle density">
        <Segmented
          value={settings.spaceParticleDensity}
          onChange={(v) => set('spaceParticleDensity', v)}
          options={[{ value: 'low', label: 'Low' }, { value: 'medium', label: 'Medium' }, { value: 'high', label: 'High' }]}
        />
      </Row>
      <Row label="Planet animation" hint="Orbits and rotation">
        <Toggle checked={settings.spacePlanetAnimation} onChange={(v) => set('spacePlanetAnimation', v)} label="Planet animation" />
      </Row>
      <Row label="Ambient glow" hint="Sun halo and atmosphere rim light — the priciest layer">
        <Toggle checked={settings.spaceAmbientGlow} onChange={(v) => set('spaceAmbientGlow', v)} label="Ambient glow" />
      </Row>
      <Row label="Nebula clouds">
        <Toggle checked={settings.spaceNebula} onChange={(v) => set('spaceNebula', v)} label="Nebula clouds" />
      </Row>
      <Row label="Floating particles">
        <Toggle checked={settings.spaceParticles} onChange={(v) => set('spaceParticles', v)} label="Floating particles" />
      </Row>
      <Row label="Shooting stars">
        <Toggle checked={settings.spaceShootingStars} onChange={(v) => set('spaceShootingStars', v)} label="Shooting stars" />
      </Row>
      <Row label="Mouse parallax">
        <Toggle checked={settings.spaceParallax} onChange={(v) => set('spaceParallax', v)} label="Mouse parallax" />
      </Row>
    </>
  );
}

function DockPane() {
  const { settings, set } = useSettings();
  return (
    <>
      <Row label="Position">
        <Segmented
          value={settings.dockPosition}
          onChange={(v) => set('dockPosition', v)}
          options={[{ value: 'left', label: 'Left' }, { value: 'bottom', label: 'Bottom' }, { value: 'right', label: 'Right' }]}
        />
      </Row>
      <Row label="Icon size" hint={`${settings.dockSize}px`}>
        <Slider value={settings.dockSize} onChange={(v) => set('dockSize', v)} min={38} max={64} label="Dock icon size" />
      </Row>
      <Row label="Magnification" hint="Icons grow as the pointer approaches">
        <Toggle checked={settings.dockMagnify} onChange={(v) => set('dockMagnify', v)} label="Dock magnification" />
      </Row>
      <Row label="Auto-hide" hint="Dock slides away until you reach the edge">
        <Toggle checked={settings.dockAutoHide} onChange={(v) => set('dockAutoHide', v)} label="Dock auto-hide" />
      </Row>
    </>
  );
}

function WindowsPane() {
  const { settings, set } = useSettings();
  return (
    <>
      <Row label="Corner radius" hint={`${settings.windowRadius}px`}>
        <Slider value={settings.windowRadius} onChange={(v) => set('windowRadius', v)} min={0} max={22} label="Window corner radius" />
      </Row>
      <Row label="Opacity" hint="Lower = more of the wallpaper shows through">
        <Slider value={settings.windowOpacity} onChange={(v) => set('windowOpacity', v)} min={0.55} max={1} step={0.01} label="Window opacity" />
      </Row>
      <Row label="Shadow">
        <Segmented
          value={settings.windowShadow}
          onChange={(v) => set('windowShadow', v)}
          options={[{ value: 'soft', label: 'Soft' }, { value: 'normal', label: 'Normal' }, { value: 'strong', label: 'Strong' }]}
        />
      </Row>
    </>
  );
}

function ShortcutsPane() {
  return (
    <div>
      {SHORTCUTS.map((s) => (
        <div key={s.desc} className="flex items-center justify-between py-2.5" style={{ borderBottom: '1px solid var(--surface-border)' }}>
          <span className="text-sm" style={{ color: 'var(--text-2)' }}>{s.desc}</span>
          <div className="flex gap-1">
            {s.keys.map((k) => (
              <kbd key={k} className="px-2 py-1 rounded-md text-[11px] font-mono" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid var(--surface-border)', color: 'var(--text-3)' }}>
                {k}
              </kbd>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function AboutPane() {
  const { reset } = useSettings();
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm"
          style={{ background: 'linear-gradient(135deg, var(--os-accent), var(--os-accent-2))' }}
        >
          AK
        </div>
        <div>
          <div className="text-sm font-semibold" style={{ color: 'var(--text-1)' }}>AK OS</div>
          <div className="text-xs" style={{ color: 'var(--text-4)' }}>Version 1.0 · Akash Kasture's Developer Operating System</div>
        </div>
      </div>
      <div className="text-xs leading-relaxed" style={{ color: 'var(--text-3)' }}>
        Built with React, Vite, Tailwind CSS and framer-motion. Every window, the dock, the terminal
        and this settings app run entirely in your browser — no backend, no tracking beyond page analytics.
      </div>
      <div className="text-xs leading-relaxed" style={{ color: 'var(--text-3)' }}>
        The solar system wallpaper is rendered with Three.js / React Three Fiber. Planet, sun and moon
        textures are courtesy of{' '}
        <a href="https://www.solarsystemscope.com/textures/" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: 'var(--os-accent)' }}>
          Solar System Scope
        </a>, licensed under CC BY 4.0.
      </div>
      <div className="flex flex-wrap gap-2 pt-2">
        <button
          onClick={() => {
            window.dispatchEvent(new CustomEvent('ak-os:replay-boot'));
            trackEvent('replay_boot_click', { source: 'settings' });
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
          style={{ border: '1px solid var(--surface-border)', color: 'var(--text-2)' }}
        >
          <RotateCcw size={14} /> Replay Boot Sequence
        </button>
        <button
          onClick={reset}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
          style={{ border: '1px solid var(--surface-border)', color: 'var(--text-3)' }}
        >
          Reset all settings
        </button>
      </div>
    </div>
  );
}

const PANES = {
  appearance: AppearancePane,
  wallpaper: WallpaperPane,
  space: SpacePane,
  dock: DockPane,
  windows: WindowsPane,
  shortcuts: ShortcutsPane,
  about: AboutPane,
};

export default function Settings() {
  const [section, setSection] = useState('appearance');
  const Pane = PANES[section];
  const current = SECTIONS.find((s) => s.id === section);

  return (
    <div className="@container h-full">
      <div className="flex flex-col @md:flex-row h-full">
        {/* Sidebar — collapses to horizontal tab strip in narrow windows */}
        <nav
          className="flex @md:flex-col gap-0.5 p-2 @md:p-3 @md:w-48 flex-shrink-0 overflow-x-auto @md:overflow-x-visible"
          style={{ borderBottom: '1px solid var(--surface-border)', borderRight: '1px solid var(--surface-border)' }}
        >
          {SECTIONS.map(({ id, label, icon: SIcon }) => (
            <button
              key={id}
              onClick={() => setSection(id)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] transition-all whitespace-nowrap flex-shrink-0"
              style={{
                background: section === id ? 'rgba(var(--os-accent-rgb), 0.14)' : 'transparent',
                color: section === id ? 'var(--text-1)' : 'var(--text-3)',
              }}
            >
              <SIcon size={15} style={{ color: section === id ? 'var(--os-accent)' : 'var(--text-4)' }} />
              {label}
            </button>
          ))}
        </nav>

        <div className="flex-1 min-h-0 overflow-y-auto p-5 @md:p-6 @container">
          <h2 className="text-base font-semibold mb-2" style={{ color: 'var(--text-1)' }}>{current?.label}</h2>
          <Pane />
        </div>
      </div>
    </div>
  );
}
