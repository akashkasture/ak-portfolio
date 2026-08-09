import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, Sun, Moon, Sparkles, Mail } from 'lucide-react';
import { APP_LIST } from '../apps/registry';
import { useWindowManager } from '../context/WindowManagerContext';
import { useTheme } from '../context/ThemeContext';
import { GithubIcon, LinkedinIcon } from '../components/SocialIcons';
import { personalInfo } from '../data/portfolio';
import { trackEvent } from '../utils/analytics';

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);
  const [prevQuery, setPrevQuery] = useState('');
  const inputRef = useRef(null);

  if (query !== prevQuery) {
    setPrevQuery(query);
    setSelected(0);
  }

  const { openApp, toggleRecruiterMode } = useWindowManager();
  const { theme, toggle: toggleTheme } = useTheme();

  const items = useMemo(() => {
    const apps = APP_LIST.map((app) => ({
      id: `app-${app.id}`,
      label: app.title,
      hint: 'Open app',
      icon: app.icon,
      action: () => openApp(app.id),
    }));
    const extras = [
      {
        id: 'recruiter',
        label: 'Recruiter Mode',
        hint: 'Toggle',
        icon: Sparkles,
        action: () => toggleRecruiterMode(),
      },
      {
        id: 'theme',
        label: theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode',
        hint: 'Theme',
        icon: theme === 'dark' ? Sun : Moon,
        action: () => toggleTheme(),
      },
      {
        id: 'email',
        label: 'Email Akash',
        hint: personalInfo.email,
        icon: Mail,
        action: () => window.open(`mailto:${personalInfo.email}`, '_blank'),
      },
      {
        id: 'github',
        label: 'Open GitHub',
        hint: personalInfo.github.replace('https://', ''),
        icon: GithubIcon,
        action: () => window.open(personalInfo.github, '_blank'),
      },
      {
        id: 'linkedin',
        label: 'Open LinkedIn',
        hint: personalInfo.linkedin.replace('https://', ''),
        icon: LinkedinIcon,
        action: () => window.open(personalInfo.linkedin, '_blank'),
      },
    ];
    return [...apps, ...extras];
  }, [openApp, toggleRecruiterMode, theme, toggleTheme]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    const starts = items.filter((i) => i.label.toLowerCase().startsWith(q));
    const contains = items.filter((i) => !i.label.toLowerCase().startsWith(q) && i.label.toLowerCase().includes(q));
    return [...starts, ...contains];
  }, [items, query]);

  const close = () => {
    setOpen(false);
    setQuery('');
    setSelected(0);
  };

  const select = (item) => {
    item.action();
    trackEvent('command_palette_use', { query, resultId: item.id });
    close();
  };

  useEffect(() => {
    const onKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && ['k', 'p'].includes(e.key.toLowerCase())) {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === 'Escape' && open) {
        close();
      }
    };
    const onOpenEvent = () => setOpen(true);
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('ak-os:open-palette', onOpenEvent);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('ak-os:open-palette', onOpenEvent);
    };
  }, [open]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 30);
  }, [open]);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelected((s) => Math.min(s + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelected((s) => Math.max(s - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[selected]) select(results[selected]);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-start justify-center pt-[15vh] px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={close} />
          <motion.div
            className="relative w-full max-w-lg rounded-2xl overflow-hidden glass-strong"
            style={{ border: '1px solid var(--nav-border)' }}
            initial={{ opacity: 0, y: -12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.97 }}
            transition={{ duration: 0.18 }}
          >
            <div className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: '1px solid var(--surface-border)' }}>
              <Search size={16} style={{ color: 'var(--text-3)' }} />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search AK OS..."
                className="flex-1 bg-transparent outline-none text-sm font-mono"
                style={{ color: 'var(--text-1)' }}
                spellCheck={false}
                autoComplete="off"
              />
              <kbd className="text-[10px] px-1.5 py-0.5 rounded font-mono" style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text-4)' }}>ESC</kbd>
            </div>
            <div className="max-h-80 overflow-y-auto py-1.5">
              {results.length === 0 && (
                <div className="px-4 py-6 text-center text-sm" style={{ color: 'var(--text-4)' }}>No results</div>
              )}
              {results.map((item, i) => {
                const Icon = item.icon;
                const isSelected = i === selected;
                return (
                  <button
                    key={item.id}
                    onClick={() => select(item)}
                    onMouseEnter={() => setSelected(i)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors"
                    style={{ background: isSelected ? 'rgba(var(--os-accent-rgb), 0.12)' : 'transparent' }}
                  >
                    <Icon size={15} style={{ color: isSelected ? 'var(--os-accent)' : 'var(--text-3)' }} />
                    <span className="text-sm flex-1" style={{ color: 'var(--text-1)' }}>{item.label}</span>
                    <span className="text-[11px] font-mono" style={{ color: 'var(--text-4)' }}>{item.hint}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
