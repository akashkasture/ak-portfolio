import { useState } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import { APP_LIST } from '../apps/registry';
import { IconSignalFlow } from './icons';
import DockIcon from './DockIcon';
import { useWindowManager } from '../context/WindowManagerContext';
import { useSettings } from '../context/SettingsContext';
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

const FLOW_APP = {
  id: 'signalflow',
  title: 'Signal Flow',
  icon: IconSignalFlow,
  tint: ['#0ea5e9', '#22d3ee'],
};

export default function Dock({ flowOpen = false }) {
  const { windows, activeId, openApp, recruiterMode } = useWindowManager();
  const { settings } = useSettings();
  const mousePos = useMotionValue(Infinity);
  const [revealed, setRevealed] = useState(false);

  const { dockPosition, dockSize, dockMagnify, dockAutoHide } = settings;

  const handleOpen = (appId) => {
    openApp(appId);
    trackEvent('dock_app_open', { app: appId });
  };

  if (recruiterMode) return null;

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
      <motion.nav
        aria-label="Applications"
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

        {/* Signal Flow isn't a window, so it isn't in the registry — it
            takes over the screen. The divider says so before you click. */}
        <div
          aria-hidden="true"
          className="self-center flex-shrink-0"
          style={
            horizontal
              ? { width: 1, height: dockSize * 0.55, background: 'var(--surface-border)', margin: '0 4px' }
              : { height: 1, width: dockSize * 0.55, background: 'var(--surface-border)', margin: '4px 0' }
          }
        />
        <DockIcon
          app={FLOW_APP}
          isOpen={flowOpen}
          isActive={flowOpen}
          mousePos={mousePos}
          baseSize={dockSize}
          magnify={dockMagnify}
          position={dockPosition}
          onClick={() => {
            window.dispatchEvent(new CustomEvent('ak-os:open-flow'));
            trackEvent('dock_app_open', { app: 'signalflow' });
          }}
        />
      </motion.nav>
    </>
  );
}
