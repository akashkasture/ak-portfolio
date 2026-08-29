import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import { APP_LIST } from '../apps/registry';
import { IconSignalFlow } from './icons';
import DockIcon from './DockIcon';
import { useWindowManager } from '../context/WindowManagerContext';
import { useSettings } from '../context/SettingsContext';
import { trackEvent } from '../utils/analytics';

/* Geometry derived from the icon size rather than fixed pixel classes, so
   the Settings size slider moves padding, gap, radius and the bar's height
   together instead of leaving a 32px dock with 48px-worth of padding. */
const geom = (s) => ({
  padX: Math.round(s * 0.17),
  padY: Math.round(s * 0.13),
  gap: Math.round(s * 0.11),
  radius: Math.round(s * 0.42),
  dotStrip: Math.max(7, Math.round(s * 0.18)),
});

const MAX_GROWTH = 0.55; // must match MAX_SCALE - 1 in DockIcon

const HIDE_OFFSET = {
  bottom: { y: 110 },
  left: { x: -120 },
  right: { x: 120 },
};

const FLOW_APP = {
  id: 'signalflow',
  title: 'Signal Flow',
  icon: IconSignalFlow,
  tint: ['#0e7490', '#155e75'],
};

export default function Dock({ flowOpen = false }) {
  const { windows, activeId, openApp, recruiterMode } = useWindowManager();
  const { settings } = useSettings();
  const mousePos = useMotionValue(Infinity);
  const [revealed, setRevealed] = useState(false);
  const barRef = useRef(null);

  const { dockPosition, dockSize, dockMagnify, dockAutoHide } = settings;
  const horizontal = dockPosition === 'bottom';
  const g = useMemo(() => geom(dockSize), [dockSize]);

  /* Pointer tracking lives on the window, not on the bar.

     Icons now grow up and out of the bar, so a magnified icon sits
     outside its own container's box. A mousemove handler on the bar would
     stop firing the moment the cursor rode an icon above the bar's top
     edge — the icon would collapse, which would put the cursor back
     inside, which would magnify it again: a flicker loop. Measuring
     against a band that includes the growth region avoids the whole
     problem, and (as in the real dock) approaching from outside starts
     the magnification before the cursor arrives. */
  useEffect(() => {
    if (recruiterMode) return;
    const growth = dockSize * MAX_GROWTH + 16;

    const onMove = (e) => {
      const bar = barRef.current;
      if (!bar) return;
      const r = bar.getBoundingClientRect();
      const band = horizontal
        ? { l: r.left - dockSize, r: r.right + dockSize, t: r.top - growth, b: r.bottom + 8 }
        : { l: r.left - growth, r: r.right + growth, t: r.top - dockSize, b: r.bottom + dockSize };
      const inside = e.clientX >= band.l && e.clientX <= band.r && e.clientY >= band.t && e.clientY <= band.b;
      if (inside) {
        mousePos.set(horizontal ? e.clientX : e.clientY);
        setRevealed(true);
      } else {
        mousePos.set(Infinity);
        setRevealed(false);
      }
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [horizontal, dockSize, mousePos, recruiterMode]);

  const handleOpen = (appId) => {
    openApp(appId);
    trackEvent('dock_app_open', { app: appId });
  };

  if (recruiterMode) return null;

  const hidden = dockAutoHide && !revealed;
  const thickness = dockSize + g.dotStrip + g.padY * 2;

  const place = {
    bottom: 'fixed bottom-3 inset-x-0 mx-auto w-fit flex-row',
    left: 'fixed left-3 inset-y-0 my-auto h-fit flex-col',
    right: 'fixed right-3 inset-y-0 my-auto h-fit flex-col',
  }[dockPosition] || 'fixed bottom-3 inset-x-0 mx-auto w-fit flex-row';

  const iconProps = {
    mousePos,
    baseSize: dockSize,
    magnify: dockMagnify,
    position: dockPosition,
    dotStrip: g.dotStrip,
  };

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
        ref={barRef}
        aria-label="Applications"
        className={`${place} z-40 flex items-end dock-glass`}
        style={{
          /* Fixed on the cross axis. Nothing an icon does can change it —
             that constancy is what separates this from a toy dock. */
          [horizontal ? 'height' : 'width']: thickness,
          padding: horizontal ? `${g.padY}px ${g.padX}px` : `${g.padX}px ${g.padY}px`,
          gap: g.gap,
          borderRadius: g.radius,
        }}
        animate={hidden ? { ...HIDE_OFFSET[dockPosition], opacity: 0.35 } : { x: 0, y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 320, damping: 32 }}
      >
        {APP_LIST.map((app) => (
          <DockIcon
            key={app.id}
            app={app}
            isOpen={Boolean(windows[app.id])}
            isActive={activeId === app.id}
            onClick={() => handleOpen(app.id)}
            {...iconProps}
          />
        ))}

        {/* Signal Flow isn't a window, so it isn't in the registry — it
            takes over the screen. The separator says so before you click,
            and sits on the icon baseline rather than the bar's centre so
            it lines up with the row it divides. */}
        <div
          aria-hidden="true"
          className="flex-shrink-0 self-end"
          style={
            horizontal
              ? { width: 1, height: Math.round(dockSize * 0.62), background: 'rgba(255,255,255,0.14)',
                  marginBottom: g.dotStrip + Math.round(dockSize * 0.19), marginLeft: g.gap, marginRight: g.gap }
              : { height: 1, width: Math.round(dockSize * 0.62), background: 'rgba(255,255,255,0.14)',
                  marginRight: g.dotStrip + Math.round(dockSize * 0.19), marginTop: g.gap, marginBottom: g.gap }
          }
        />

        <DockIcon
          app={FLOW_APP}
          isOpen={flowOpen}
          isActive={flowOpen}
          onClick={() => {
            window.dispatchEvent(new CustomEvent('ak-os:open-flow'));
            trackEvent('dock_app_open', { app: 'signalflow' });
          }}
          {...iconProps}
        />
      </motion.nav>
    </>
  );
}
