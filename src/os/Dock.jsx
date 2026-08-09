import { useMotionValue } from 'framer-motion';
import { APP_LIST } from '../apps/registry';
import DockIcon from './DockIcon';
import { useWindowManager } from '../context/WindowManagerContext';
import { useIsMobile } from '../hooks/useIsMobile';
import { trackEvent } from '../utils/analytics';

export default function Dock() {
  const { windows, activeId, openApp, recruiterMode } = useWindowManager();
  const isMobile = useIsMobile();
  const mouseX = useMotionValue(Infinity);

  const handleOpen = (appId) => {
    openApp(appId);
    trackEvent('dock_app_open', { app: appId });
  };

  if (recruiterMode) return null;

  if (isMobile) {
    return (
      <div
        className="fixed bottom-0 inset-x-0 z-40 flex items-center justify-around px-2 glass-strong"
        style={{ height: 56, paddingBottom: 'env(safe-area-inset-bottom)', borderTop: '1px solid var(--nav-border)' }}
      >
        {APP_LIST.map((app) => {
          const isOpen = Boolean(windows[app.id]);
          const isActive = activeId === app.id;
          const Icon = app.icon;
          return (
            <button
              key={app.id}
              onClick={() => handleOpen(app.id)}
              className="flex flex-col items-center gap-0.5 px-2 py-1"
              aria-label={app.title}
            >
              <Icon size={19} style={{ color: isActive ? '#818cf8' : 'var(--text-3)' }} />
              <div className="w-1 h-1 rounded-full" style={{ background: '#6366f1', opacity: isOpen ? 1 : 0 }} />
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div
      className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 flex items-end gap-2 px-3 py-2 rounded-2xl glass-strong"
      style={{ border: '1px solid var(--nav-border)' }}
      onMouseMove={(e) => mouseX.set(e.clientX)}
      onMouseLeave={() => mouseX.set(Infinity)}
    >
      {APP_LIST.map((app) => (
        <DockIcon
          key={app.id}
          app={app}
          isOpen={Boolean(windows[app.id])}
          isActive={activeId === app.id}
          mouseX={mouseX}
          onClick={() => handleOpen(app.id)}
        />
      ))}
    </div>
  );
}
