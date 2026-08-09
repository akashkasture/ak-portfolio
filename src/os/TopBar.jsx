import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, RotateCcw, Search, Sparkles } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';
import SystemStats from './SystemStats';
import { GithubIcon, LinkedinIcon } from '../components/SocialIcons';
import { personalInfo } from '../data/portfolio';
import { useWindowManager } from '../context/WindowManagerContext';
import { useIsMobile } from '../hooks/useIsMobile';
import { trackEvent } from '../utils/analytics';

export default function TopBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { recruiterMode, toggleRecruiterMode } = useWindowManager();
  const isMobile = useIsMobile();

  const openPalette = () => window.dispatchEvent(new CustomEvent('ak-os:open-palette'));

  return (
    <div
      className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-3 sm:px-4 glass-strong"
      style={{ height: 40, borderBottom: '1px solid var(--nav-border)' }}
    >
      <div className="relative flex items-center gap-3">
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="flex items-center gap-2 group"
        >
          <div
            className="w-6 h-6 rounded-lg flex items-center justify-center text-white font-bold text-[10px]"
            style={{ background: 'linear-gradient(135deg, #6366f1, #06b6d4)', boxShadow: '0 0 14px rgba(99,102,241,0.5)' }}
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
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all"
          style={{
            background: recruiterMode ? 'linear-gradient(135deg, #6366f1, #06b6d4)' : 'rgba(255,255,255,0.06)',
            color: recruiterMode ? '#fff' : 'var(--text-3)',
          }}
        >
          <Sparkles size={13} />
          <span className="hidden sm:inline">Recruiter Mode</span>
        </button>
        {isMobile && (
          <button
            onClick={openPalette}
            aria-label="Search"
            className="p-2 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <Search size={16} />
          </button>
        )}
        <button
          aria-label="Notifications"
          className="p-2 rounded-lg text-slate-400 hover:text-white transition-colors hidden sm:block"
          title="Notifications"
        >
          <Bell size={15} />
        </button>
        <ThemeToggle />
      </div>
    </div>
  );
}
