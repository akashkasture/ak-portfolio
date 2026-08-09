import { useState } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import { APP_LIST } from '../apps/registry';
import DockIcon from './DockIcon';
import { useWindowManager } from '../context/WindowManagerContext';
import { useSettings } from '../context/SettingsContext';
import { useIsMobile } from '../hooks/useIsMobile';
import { trackEvent } from '../utils/analytics';

const CONTAINER = {
  bottom: 'fixed bottom-3 inset-x-0 mx-auto w-fit flex items-end flex-row px-3.5 py-2.5',
  left: 'fixed left-3 inset-y-0 my-auto h-fit flex items-start flex-col px-2.5 py-3.5',
  right: 'fixed right-3 inset-y-0 my-auto h-fit flex items-end flex-col px-2.5 py-3.5',
};

const HIDE_OFFSET = {
  bottom: { y: 96 },
  left: { x: -110 },
  right: { x: 110 },
};

export default function Dock() {
  const { windows, activeId, openApp, recruiterMode } = useWindowManager();
  const { settings } = useSettings();
  const isMobile = useIsMobile();
  const mousePos = useMotionValue(Infinity);
  const [revealed, setRevealed] = useState(false);

  const { dockPosition, dockSize, dockMagnify, dockAutoHide } = settings;

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

  const horizontal = dockPosition === 'bottom';
  const hidden = dockAutoHide && !revealed;

  return (
    <>
      {dockAutoHide && (
        <div
          className="fixed z-[39]"
          style={
            horizontal
              ? { bottom: 0, left: 0, right: 0, height: 10 }
              : dockPosition === 'left'
                ? { left: 0, top: 0, bottom: 0, width: 10 }
                : { right: 0, top: 0, bottom: 0, width: 10 }
          }
          onMouseEnter={() => setRevealed(true)}
        />
      )}
      <motion.div
        className={`${CONTAINER[dockPosition] || CONTAINER.bottom} z-40 gap-2.5 rounded-[22px] dock-glass`}
        animate={hidden ? { ...HIDE_OFFSET[dockPosition], opacity: 0.4 } : { x: 0, y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        onMouseMove={(e) => mousePos.set(horizontal ? e.clientX : e.clientY)}
        onMouseEnter={() => setRevealed(true)}
        onMouseLeave={() => { mousePos.set(Infinity); setRevealed(false); }}
      >
        {APP_LIST.map((app) => (
          <DockIcon
            key={app.id}
            app={app}
            isOpen={Boolean(windows[app.id])}
            isActive={activeId === app.id}
            mousePos={mousePos}
            baseSize={dockSize}
            magnify={dockMagnify}
            position={dockPosition}
            onClick={() => handleOpen(app.id)}
          />
        ))}
      </motion.div>
    </>
  );
}
