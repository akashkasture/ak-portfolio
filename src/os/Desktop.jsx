import { lazy, Suspense, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Wallpaper from './Wallpaper';
import DesktopWidgets from './DesktopWidgets';
import TopBar from './TopBar';
import Dock from './Dock';
import Window from './Window';
import CommandPalette from './CommandPalette';
import ShortcutsOverlay from './ShortcutsOverlay';

// three.js only ships to visitors who actually open Signal Flow.
const FlowMode = lazy(() => import('../flow/FlowMode'));
import RecruiterMode from '../apps/RecruiterMode';
import { APPS } from '../apps/registry';
import { useWindowManager } from '../context/WindowManagerContext';
import { useSettings } from '../context/SettingsContext';
import { useIntroSequence } from '../hooks/useIntroSequence';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { EASE } from './motion';

export default function Desktop() {
  const wm = useWindowManager();
  const { windows, activeId, recruiterMode } = wm;
  const { settings } = useSettings();
  useKeyboardShortcuts(wm);
  const [flowOpen, setFlowOpen] = useState(false);

  useEffect(() => {
    const open = () => setFlowOpen(true);
    window.addEventListener('ak-os:open-flow', open);
    return () => window.removeEventListener('ak-os:open-flow', open);
  }, []);
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
        transition={{ duration: 0.6, ease: EASE.out }}
        style={{ pointerEvents: introDone ? 'auto' : 'none' }}
      >
        <TopBar />

        <main
          className="absolute left-0 right-0 pointer-events-none"
          style={{ top: 40, bottom: 0 }}
          aria-label="Workspace"
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
        </main>

        <Dock flowOpen={flowOpen} />
        <CommandPalette />
        <ShortcutsOverlay />
      </motion.div>

      <AnimatePresence>
        {flowOpen && (
          <Suspense fallback={null}>
            <FlowMode key="flow" onExit={() => setFlowOpen(false)} />
          </Suspense>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!introDone && (
          <motion.button
            onClick={skipIntro}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.4, duration: 0.4, ease: EASE.out }}
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
