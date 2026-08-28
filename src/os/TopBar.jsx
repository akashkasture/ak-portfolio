import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Sparkles } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';
import SystemStats from './SystemStats';
import NotificationCenter from './NotificationCenter';
import { GithubIcon, LinkedinIcon } from '../components/SocialIcons';
import { personalInfo } from '../data/portfolio';
import { useWindowManager } from '../context/WindowManagerContext';
import { trackEvent } from '../utils/analytics';

export default function TopBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { recruiterMode, toggleRecruiterMode } = useWindowManager();

  return (
    <div
      className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-3 sm:px-4 glass-strong"
      style={{
        height: 40,
        borderBottom: '1px solid var(--nav-border)',
        boxShadow: 'inset 0 -1px 0 rgba(255,255,255,0.03), 0 6px 24px rgba(0,0,0,0.25)',
      }}
    >
      <div className="relative flex items-center gap-3">
        <button
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="AK OS menu"
          aria-expanded={menuOpen}
          className="flex items-center gap-2 group"
        >
          <div
            className="w-6 h-6 rounded-lg flex items-center justify-center text-white font-bold text-[10px]"
            style={{ background: 'linear-gradient(135deg, var(--os-accent), var(--os-accent-2))', boxShadow: '0 0 14px rgba(var(--os-accent-rgb), 0.5)' }}
          >
            AK
          </div>
          <span className="text-[13px] font-semibold hidden sm:block" style={{ color: 'var(--text-1)' }}>AK OS</span>
        </button>

        <AnimatePresence>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <motion.div
                className="absolute top-9 left-0 z-20 w-56 rounded-xl overflow-hidden glass-strong"
                style={{ border: '1px solid var(--nav-border)' }}
                initial={{ opacity: 0, y: -8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.97 }}
                transition={{ duration: 0.15 }}
              >
                <a
                  href={`mailto:${personalInfo.email}`}
                  onClick={() => trackEvent('topbar_menu_click', { item: 'email' })}
                  className="flex items-center gap-2.5 px-3.5 py-2.5 text-sm hover:bg-white/5 transition-colors"
                  style={{ color: 'var(--text-2)' }}
                >
                  {personalInfo.email}
                </a>
                <a
                  href={personalInfo.github}
                  target="_blank" rel="noopener noreferrer"
                  onClick={() => trackEvent('topbar_menu_click', { item: 'github' })}
                  className="flex items-center gap-2.5 px-3.5 py-2.5 text-sm hover:bg-white/5 transition-colors"
                  style={{ color: 'var(--text-2)' }}
                >
                  <GithubIcon size={14} /> GitHub
                </a>
                <a
                  href={personalInfo.linkedin}
                  target="_blank" rel="noopener noreferrer"
                  onClick={() => trackEvent('topbar_menu_click', { item: 'linkedin' })}
                  className="flex items-center gap-2.5 px-3.5 py-2.5 text-sm hover:bg-white/5 transition-colors"
                  style={{ color: 'var(--text-2)' }}
                >
                  <LinkedinIcon size={14} /> LinkedIn
                </a>
                <button
                  onClick={() => { window.dispatchEvent(new CustomEvent('ak-os:replay-boot')); trackEvent('replay_boot_click'); }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm hover:bg-white/5 transition-colors text-left"
                  style={{ color: 'var(--text-2)', borderTop: '1px solid var(--surface-border)' }}
                >
                  <RotateCcw size={14} /> Replay Boot Sequence
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      <SystemStats />

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => { toggleRecruiterMode(); trackEvent('recruiter_mode_toggle', { active: !recruiterMode }); }}
          aria-label="Toggle Recruiter Mode"
          aria-pressed={recruiterMode}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all"
          style={{
            background: recruiterMode ? 'linear-gradient(135deg, var(--os-accent), var(--os-accent-2))' : 'rgba(255,255,255,0.06)',
            color: recruiterMode ? '#fff' : 'var(--text-3)',
          }}
        >
          <Sparkles size={13} />
          <span className="hidden sm:inline">Recruiter Mode</span>
        </button>
        <NotificationCenter />
        <ThemeToggle />
      </div>
    </div>
  );
}
