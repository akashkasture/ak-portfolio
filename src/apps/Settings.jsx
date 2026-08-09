import { Check, Moon, RotateCcw, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { trackEvent } from '../utils/analytics';

const ACCENT_SWATCHES = [
  { id: 'default', label: 'Default', colors: ['#6366f1', '#06b6d4'] },
  { id: 'midnight', label: 'Midnight', colors: ['#4f46e5', '#7c3aed'] },
  { id: 'terminal', label: 'Terminal', colors: ['#22c55e', '#16a34a'] },
  { id: 'arctic', label: 'Arctic', colors: ['#0ea5e9', '#38bdf8'] },
  { id: 'cyber', label: 'Cyber', colors: ['#ec4899', '#a855f7'] },
];

const SHORTCUTS = [
  { keys: ['⌘', 'K'], desc: 'Open command palette' },
  { keys: ['Esc'], desc: 'Close command palette' },
  { keys: ['Drag title bar'], desc: 'Move a window' },
  { keys: ['Double-click title bar'], desc: 'Maximize / restore a window' },
  { keys: ['Drag bottom-right corner'], desc: 'Resize a window' },
];

export default function Settings() {
  const { theme, toggle, accent, setAccent } = useTheme();

  return (
    <div className="@container p-6 sm:p-8 max-w-xl">
      <h2 className="text-lg font-bold mb-6" style={{ color: 'var(--text-1)' }}>Settings</h2>

      {/* Theme */}
      <section className="mb-8">
        <h3 className="text-xs font-mono uppercase tracking-widest mb-3" style={{ color: 'var(--text-4)' }}>Appearance</h3>
        <div className="flex gap-2">
          {[{ id: 'dark', label: 'Dark', icon: Moon }, { id: 'light', label: 'Light', icon: Sun }].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => { if (theme !== id) toggle(); }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
              style={{
                background: theme === id ? 'linear-gradient(135deg, var(--os-accent), var(--os-accent-2))' : 'rgba(255,255,255,0.05)',
                color: theme === id ? '#fff' : 'var(--text-2)',
                border: `1px solid ${theme === id ? 'transparent' : 'var(--surface-border)'}`,
              }}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>
      </section>

      {/* Accent theme */}
      <section className="mb-8">
        <h3 className="text-xs font-mono uppercase tracking-widest mb-3" style={{ color: 'var(--text-4)' }}>Theme</h3>
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
              <span
                className="w-4 h-4 rounded-full flex-shrink-0"
                style={{ background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})` }}
              />
              {label}
              {accent === id && <Check size={12} />}
            </button>
          ))}
        </div>
      </section>

      {/* Boot sequence */}
      <section className="mb-8">
        <h3 className="text-xs font-mono uppercase tracking-widest mb-3" style={{ color: 'var(--text-4)' }}>Boot Sequence</h3>
        <button
          onClick={() => {
            window.dispatchEvent(new CustomEvent('ak-os:replay-boot'));
            trackEvent('replay_boot_click', { source: 'settings' });
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
          style={{ border: '1px solid var(--surface-border)', color: 'var(--text-2)' }}
        >
          <RotateCcw size={14} />
          Replay Boot Sequence
        </button>
      </section>

      {/* Shortcuts */}
      <section>
        <h3 className="text-xs font-mono uppercase tracking-widest mb-3" style={{ color: 'var(--text-4)' }}>Keyboard Shortcuts</h3>
        <div className="space-y-2">
          {SHORTCUTS.map((s) => (
            <div key={s.desc} className="flex items-center justify-between py-2" style={{ borderBottom: '1px solid var(--surface-border)' }}>
              <span className="text-sm" style={{ color: 'var(--text-2)' }}>{s.desc}</span>
              <div className="flex gap-1">
                {s.keys.map((k) => (
                  <kbd
                    key={k}
                    className="px-2 py-1 rounded-md text-[11px] font-mono"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid var(--surface-border)', color: 'var(--text-3)' }}
                  >
                    {k}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
