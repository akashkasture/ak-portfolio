import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Search, Sun, Moon, Sparkles, Mail, Keyboard, RotateCcw, FolderGit2, Building2, Layers,
} from 'lucide-react';
import { APP_LIST } from '../apps/registry';
import { useWindowManager } from '../context/WindowManagerContext';
import { useTheme } from '../context/ThemeContext';
import { GithubIcon, LinkedinIcon } from '../components/SocialIcons';
import { personalInfo, projects, experience, skills } from '../data/portfolio';
import { trackEvent } from '../utils/analytics';
import { IconSignalFlow } from './icons';
import { T } from './motion';

/* Search over the portfolio, not over the dock.

   This used to index ten app titles and five links, so the one query a
   visitor is most likely to type — the name of a technology they're
   hiring for — returned "No results". Now "kafka" finds the two projects
   that use it, the role where it shipped, and the skill entry; "spring"
   finds the same by another name. The window it opens is a side effect
   of the answer, not the answer itself.

   Everything indexed comes from portfolio.js. Nothing here is a
   hand-written keyword list that could drift out of sync with the data. */

const GROUP_ORDER = ['Projects', 'Experience', 'Skills', 'Apps', 'Links', 'Commands'];

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);
  const [prevQuery, setPrevQuery] = useState('');
  const inputRef = useRef(null);
  const listRef = useRef(null);
  // Whatever had focus before the palette opened, so closing returns the
  // keyboard where it was instead of dumping it on <body>.
  const restoreRef = useRef(null);

  if (query !== prevQuery) {
    setPrevQuery(query);
    setSelected(0);
  }

  const { openApp, toggleRecruiterMode } = useWindowManager();
  const { theme, toggle: toggleTheme } = useTheme();

  const items = useMemo(() => {
    const openProject = (p) => {
      openApp('projects');
      // Let the Projects window mount before asking it to open a detail.
      requestAnimationFrame(() =>
        window.dispatchEvent(new CustomEvent('ak-os:open-project', { detail: { id: p.id } }))
      );
    };

    return [
      // Matched on tech and category as well as title, which is what makes
      // a stack query work at all.
      ...projects.map((p) => ({
        id: `project-${p.id}`,
        group: 'Projects',
        label: p.title,
        hint: p.tech.slice(0, 3).join(' · '),
        terms: [p.title, p.category, ...p.tech].join(' '),
        icon: FolderGit2,
        action: () => openProject(p),
      })),
      ...experience.map((e) => ({
        id: `exp-${e.id}`,
        group: 'Experience',
        label: `${e.role} · ${e.company}`,
        hint: e.period,
        terms: [e.role, e.company, e.period, ...(e.achievements || [])].join(' '),
        icon: Building2,
        action: () => openApp('experience'),
      })),
      ...skills.flatMap((g) =>
        g.items.map((s) => ({
          id: `skill-${g.category}-${s.name}`,
          group: 'Skills',
          label: s.name,
          hint: g.category,
          terms: `${s.name} ${g.category}`,
          icon: Layers,
          action: () => openApp('skills'),
        }))
      ),
      ...APP_LIST.map((app) => ({
        id: `app-${app.id}`,
        group: 'Apps',
        label: app.title,
        hint: 'Open',
        terms: app.title,
        icon: app.icon,
        action: () => openApp(app.id),
      })),
      {
        id: 'email', group: 'Links', label: 'Email Akash', hint: personalInfo.email,
        terms: `email contact mail ${personalInfo.email}`, icon: Mail,
        action: () => { window.location.href = `mailto:${personalInfo.email}`; },
      },
      {
        id: 'github', group: 'Links', label: 'GitHub', hint: personalInfo.github.replace('https://', ''),
        terms: 'github code source repository', icon: GithubIcon,
        action: () => window.open(personalInfo.github, '_blank', 'noopener,noreferrer'),
      },
      {
        id: 'linkedin', group: 'Links', label: 'LinkedIn', hint: personalInfo.linkedin.replace('https://', ''),
        terms: 'linkedin profile network', icon: LinkedinIcon,
        action: () => window.open(personalInfo.linkedin, '_blank', 'noopener,noreferrer'),
      },
      {
        id: 'recruiter', group: 'Commands', label: 'Recruiter Mode', hint: 'One-page summary',
        terms: 'recruiter hiring summary overview', icon: Sparkles,
        action: () => toggleRecruiterMode(),
      },
      {
        id: 'theme', group: 'Commands',
        label: theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode',
        hint: 'Theme', terms: 'theme dark light appearance',
        icon: theme === 'dark' ? Sun : Moon,
        action: () => toggleTheme(),
      },
      {
        id: 'signalflow', group: 'Commands', label: 'Signal Flow', hint: 'Fly the architecture',
        terms: 'signal flow architecture graph kafka topology system diagram 3d',
        icon: IconSignalFlow,
        action: () => window.dispatchEvent(new CustomEvent('ak-os:open-flow')),
      },
      {
        id: 'shortcuts', group: 'Commands', label: 'Keyboard shortcuts', hint: '?',
        terms: 'keyboard shortcuts keys help', icon: Keyboard,
        action: () => window.dispatchEvent(new CustomEvent('ak-os:show-shortcuts')),
      },
      {
        id: 'replay-boot', group: 'Commands', label: 'Replay boot sequence', hint: 'System',
        terms: 'boot replay restart bios startup', icon: RotateCcw,
        action: () => window.dispatchEvent(new CustomEvent('ak-os:replay-boot')),
      },
    ];
  }, [openApp, toggleRecruiterMode, theme, toggleTheme]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    // With no query, lead with the apps — a blank palette is a launcher.
    // The content only earns its place once someone is looking for it.
    if (!q) {
      const apps = items.filter((i) => i.group === 'Apps');
      const cmds = items.filter((i) => i.group === 'Commands');
      return [...apps, ...cmds];
    }
    // Rank: label prefix, then label substring, then a term match elsewhere
    // (a tech name, a company, an achievement line).
    const score = (i) => {
      const label = i.label.toLowerCase();
      if (label.startsWith(q)) return 0;
      if (label.includes(q)) return 1;
      if (i.terms.toLowerCase().includes(q)) return 2;
      return Infinity;
    };
    const ranked = items
      .map((i) => ({ i, s: score(i) }))
      .filter(({ s }) => s !== Infinity)
      .sort((a, b) => a.s - b.s || GROUP_ORDER.indexOf(a.i.group) - GROUP_ORDER.indexOf(b.i.group))
      .map(({ i }) => i)
      .slice(0, 24);

    // Ranking alone interleaves groups, which printed "Projects" twice with
    // "Skills" wedged between. Collapse each group into one run, ordered by
    // its best-scoring member so the strongest match still leads.
    const buckets = new Map();
    for (const item of ranked) {
      if (!buckets.has(item.group)) buckets.set(item.group, []);
      buckets.get(item.group).push(item);
    }
    return [...buckets.values()].flat();
  }, [items, query]);

  const close = () => {
    setOpen(false);
    setQuery('');
    setSelected(0);
    restoreRef.current?.focus?.();
    restoreRef.current = null;
  };

  const select = (item) => {
    trackEvent('command_palette_use', { query, resultId: item.id });
    close();
    item.action();
  };

  useEffect(() => {
    const onKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && ['k', 'p'].includes(e.key.toLowerCase())) {
        e.preventDefault();
        setOpen((v) => {
          if (!v) restoreRef.current = document.activeElement;
          return !v;
        });
      }
    };
    const onOpenEvent = () => {
      restoreRef.current = document.activeElement;
      setOpen(true);
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('ak-os:open-palette', onOpenEvent);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('ak-os:open-palette', onOpenEvent);
    };
  }, []);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // Keep the highlighted row in view when arrowing past the fold.
  useEffect(() => {
    listRef.current
      ?.querySelector('[data-selected="true"]')
      ?.scrollIntoView({ block: 'nearest' });
  }, [selected, results]);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelected((s) => (results.length ? (s + 1) % results.length : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelected((s) => (results.length ? (s - 1 + results.length) % results.length : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[selected]) select(results[selected]);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      close();
    } else if (e.key === 'Tab') {
      // The input is the only focusable thing in here, so holding focus on
      // it is the whole focus trap — no sentinel nodes needed.
      e.preventDefault();
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
          transition={T.fast}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={close} />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Search AK OS"
            className="relative w-full max-w-lg rounded-2xl overflow-hidden glass-strong"
            style={{ border: '1px solid var(--nav-border)' }}
            initial={{ opacity: 0, y: -12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.97 }}
            transition={T.enter}
          >
            <div
              className="flex items-center gap-3 px-4 py-3"
              style={{ borderBottom: '1px solid var(--surface-border)' }}
            >
              <Search size={16} style={{ color: 'var(--text-3)' }} aria-hidden="true" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search projects, stack, experience…"
                className="flex-1 bg-transparent outline-none text-sm font-mono"
                style={{ color: 'var(--text-1)' }}
                spellCheck={false}
                autoComplete="off"
                role="combobox"
                aria-expanded="true"
                aria-controls="ak-palette-results"
                aria-autocomplete="list"
                aria-activedescendant={results[selected] ? `ak-opt-${results[selected].id}` : undefined}
              />
              <kbd
                className="text-[10px] px-1.5 py-0.5 rounded font-mono"
                style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text-4)' }}
              >
                ESC
              </kbd>
            </div>

            <div
              ref={listRef}
              id="ak-palette-results"
              role="listbox"
              aria-label="Results"
              className="max-h-80 overflow-y-auto py-1.5"
            >
              {results.length === 0 && (
                <div className="px-4 py-6 text-center text-sm" style={{ color: 'var(--text-4)' }}>
                  Nothing matches “{query}”
                </div>
              )}
              {results.map((item, i) => {
                const Icon = item.icon;
                const isSelected = i === selected;
                // A group heading only where the group actually changes,
                // so scanning tells you what kind of thing you're looking at.
                const showGroup = i === 0 || results[i - 1].group !== item.group;
                return (
                  <div key={item.id}>
                    {showGroup && (
                      <div
                        role="presentation"
                        className="px-4 pt-2.5 pb-1 text-[10px] font-mono uppercase tracking-[0.14em]"
                        style={{ color: 'var(--text-4)' }}
                      >
                        {item.group}
                      </div>
                    )}
                    <div
                      id={`ak-opt-${item.id}`}
                      role="option"
                      aria-selected={isSelected}
                      data-selected={isSelected}
                      onClick={() => select(item)}
                      onMouseMove={() => setSelected(i)}
                      className="w-full flex items-center gap-3 px-4 py-2 text-left cursor-pointer transition-colors"
                      style={{ background: isSelected ? 'rgba(var(--os-accent-rgb), 0.12)' : 'transparent' }}
                    >
                      <Icon
                        size={15}
                        style={{ color: isSelected ? 'var(--os-accent)' : 'var(--text-3)' }}
                        aria-hidden="true"
                      />
                      <span className="text-sm flex-1 truncate" style={{ color: 'var(--text-1)' }}>
                        {item.label}
                      </span>
                      <span
                        className="text-[11px] font-mono truncate max-w-[45%] text-right"
                        style={{ color: 'var(--text-4)' }}
                      >
                        {item.hint}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
