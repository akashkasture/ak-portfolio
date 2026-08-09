import { AnimatePresence } from 'framer-motion';
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

export default function Desktop() {
  const { windows, activeId, recruiterMode } = useWindowManager();
  const isMobile = useIsMobile();

  return (
    <div className="relative min-h-screen overflow-hidden" style={{ color: 'var(--text-1)' }}>
      <Wallpaper />
      <CursorGlow />
      <TopBar />

      <div
        className="absolute left-0 right-0"
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
    </div>
  );
}
