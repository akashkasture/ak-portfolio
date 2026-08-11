import { AnimatePresence, motion } from 'framer-motion';
import Wallpaper from './Wallpaper';
import DesktopWidgets from './DesktopWidgets';
import CursorGlow from '../components/CursorGlow';
import TopBar from './TopBar';
import Dock from './Dock';
import Window from './Window';
import CommandPalette from './CommandPalette';
import RecruiterMode from '../apps/RecruiterMode';
import { APPS } from '../apps/registry';
import { useWindowManager } from '../context/WindowManagerContext';
import { useIsMobile } from '../hooks/useIsMobile';
import { useSettings } from '../context/SettingsContext';
import { useIntroSequence } from '../hooks/useIntroSequence';

export default function Desktop() {
  const { windows, activeId, recruiterMode } = useWindowManager();
  const { settings } = useSettings();
  const isMobile = useIsMobile();
  const { t: introT, done: introDone, skip: skipIntro } = useIntroSequence({
    enabled: settings.wallpaper === 'solarsystem',
  });

  return (
    <div className="relative min-h-screen overflow-hidden" style={{ color: 'var(--text-1)' }}>
      <Wallpaper introT={introT} />

      {/* OS chrome fades in once the space wallpaper's boot reveal finishes
          (or immediately for non-space wallpapers / returning-session
          visitors, since introDone defaults to true whenever the sequence
          is disabled or already skipped this session). */}
      <motion.div
        initial={false}
        animate={{ opacity: introDone ? 1 : 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{ pointerEvents: introDone ? 'auto' : 'none' }}
      >
        <CursorGlow />
        <TopBar />

        <div
          className="absolute left-0 right-0 pointer-events-none"
          style={{ top: 40, bottom: isMobile ? 60 : 0 }}
        >
          <DesktopWidgets />
          <AnimatePresence>
            {recruiterMode && <RecruiterMode key="recruiter" />}
          </AnimatePresence>

          <AnimatePresence>
            {!recruiterMode && Object.values(windows).map((win) => {
              const app = APPS[win.appId];
              if (!app) return null;
              return (
                <Window key={app.id} app={app} win={win} isActive={activeId === app.id} />
              );
            })}
          </AnimatePresence>
        </div>

        <Dock />
        <CommandPalette />
      </motion.div>

      <AnimatePresence>
        {!introDone && (
          <motion.button
            onClick={skipIntro}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="fixed bottom-6 right-6 z-50 px-4 py-2 rounded-full text-xs font-mono uppercase tracking-widest dock-glass transition-colors"
            style={{ color: 'var(--text-3)' }}
          >
            Skip intro →
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
