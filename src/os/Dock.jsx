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
        className="fixed bottom-0 inset-x-0 z-40 flex items-center gap-1 overflow-x-auto px-3 dock-glass"
        style={{ height: 60, paddingBottom: 'env(safe-area-inset-bottom)', scrollbarWidth: 'none' }}
      >
        {APP_LIST.map((app) => {
          const isOpen = Boolean(windows[app.id]);
          const isActive = activeId === app.id;
          const Icon = app.icon;
          const [c1, c2] = app.tint || ['#6366f1', '#8b5cf6'];
          return (
            <button
              key={app.id}
              onClick={() => handleOpen(app.id)}
              className="flex flex-col items-center gap-1 px-1 py-1 flex-shrink-0"
              aria-label={app.title}
            >
              <div
                className="w-8 h-8 rounded-[10px] flex items-center justify-center relative overflow-hidden"
                style={{
                  background: `linear-gradient(145deg, ${c1}, ${c2})`,
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.25), 0 2px 6px rgba(0,0,0,0.35)',
                  opacity: isActive ? 1 : 0.82,
                }}
              >
                <Icon size={15} style={{ color: app.iconColor || '#fff' }} />
              </div>
              <div className="w-1 h-1 rounded-full" style={{ background: 'var(--os-accent)', opacity: isOpen ? 1 : 0 }} />
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div
      className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 flex items-end gap-2.5 px-3.5 py-2.5 rounded-[22px] dock-glass"
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
