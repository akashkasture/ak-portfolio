import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useDragControls, useMotionValue } from 'framer-motion';
import { useWindowManager } from '../context/WindowManagerContext';
import { useSettings } from '../context/SettingsContext';
import { useWindowResize } from '../hooks/useWindowResize';
import { T, DUR } from './motion';

const SHADOWS = {
  soft: {
    active: ['inset 0 1px 0 rgba(255,255,255,0.07)', '0 0 0 1px rgba(255,255,255,0.07)', '0 12px 40px rgba(0,0,0,0.4)'],
    idle: ['inset 0 1px 0 rgba(255,255,255,0.04)', '0 0 0 1px rgba(255,255,255,0.04)', '0 8px 24px rgba(0,0,0,0.3)'],
  },
  normal: {
    active: ['inset 0 1px 0 rgba(255,255,255,0.09)', '0 0 0 1px rgba(255,255,255,0.09)', '0 2px 10px rgba(0,0,0,0.35)', '0 28px 90px rgba(0,0,0,0.65)', '0 0 70px rgba(var(--os-accent-rgb), 0.10)'],
    idle: ['inset 0 1px 0 rgba(255,255,255,0.05)', '0 0 0 1px rgba(255,255,255,0.05)', '0 14px 44px rgba(0,0,0,0.42)'],
  },
  strong: {
    active: ['inset 0 1px 0 rgba(255,255,255,0.11)', '0 0 0 1px rgba(255,255,255,0.11)', '0 4px 16px rgba(0,0,0,0.45)', '0 40px 120px rgba(0,0,0,0.8)', '0 0 100px rgba(var(--os-accent-rgb), 0.16)'],
    idle: ['inset 0 1px 0 rgba(255,255,255,0.06)', '0 0 0 1px rgba(255,255,255,0.06)', '0 20px 60px rgba(0,0,0,0.55)'],
  },
};

const TOPBAR_H = 40;
const SNAP_EDGE = 14;
const SNAP_TOP = 46;

function WindowLoadingSkeleton() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-6 h-6 rounded-full border-2 border-white/15 border-t-indigo-400 animate-spin" />
    </div>
  );
}

function snapPreviewStyle(zone) {
  const inset = 6;
  const base = { top: inset, height: `calc(100% - ${inset * 2}px)` };
  if (zone === 'left') return { ...base, left: inset, width: `calc(50% - ${inset * 1.5}px)` };
  if (zone === 'right') return { ...base, right: inset, width: `calc(50% - ${inset * 1.5}px)` };
  return { ...base, left: inset, right: inset };
}

// Where the minimize "genie" should fly to, in desktop-container coordinates:
// the center of this app's dock icon, or bottom-center as a fallback.
function genieOffset(app, win) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const cur = win.maximized
    ? { x: 0, y: 0, width: vw, height: vh - TOPBAR_H }
    : { x: win.x, y: win.y, width: win.width, height: win.height };
  const iconEl = document.querySelector(`.dock-glass [aria-label="${app.title}"]`);
  let target;
  if (iconEl) {
    const r = iconEl.getBoundingClientRect();
    target = { x: r.left + r.width / 2, y: r.top + r.height / 2 - TOPBAR_H };
  } else {
    target = { x: vw / 2, y: vh - 60 - TOPBAR_H };
  }
  return {
    x: target.x - (cur.x + cur.width / 2),
    y: target.y - (cur.y + cur.height / 2),
  };
}

export default function Window({ app, win, isActive }) {
  const { focusApp, closeApp, minimizeApp, toggleMaximize, updateWindowRect } = useWindowManager();
  const { settings } = useSettings();
  const Icon = app.icon;
  const Content = app.component;

  const shellRef = useRef(null);

  const mx = useMotionValue(win.x);
  const my = useMotionValue(win.y);
  const dragControls = useDragControls();
  const [liveSize, setLiveSize] = useState(null);
  const [snapZone, setSnapZone] = useState(null);
  const [committedSize, setCommittedSize] = useState({ width: win.width, height: win.height });

  if (win.width !== committedSize.width || win.height !== committedSize.height) {
    setCommittedSize({ width: win.width, height: win.height });
    setLiveSize(null);
  }

  useEffect(() => {
    if (!win.maximized) {
      mx.set(win.x);
      my.set(win.y);
    }
  }, [win.x, win.y, win.maximized, mx, my]);

  useEffect(() => {
    if (!isActive || win.minimized) return;
    const el = shellRef.current;
    if (el && !el.contains(document.activeElement)) el.focus({ preventScroll: true });
  }, [isActive, win.minimized]);

  const { onPointerDown: onResizePointerDown } = useWindowResize({
    width: win.width,
    height: win.height,
    minSize: app.minSize,
    onResize: setLiveSize,
    onResizeEnd: (size) => {
      setLiveSize(size);
      updateWindowRect(app.id, { x: mx.get(), y: my.get(), ...size });
    },
  });

  const width = liveSize?.width ?? win.width;
  const height = liveSize?.height ?? win.height;

  // Minimized windows stay mounted (so app state like Terminal scrollback survives) but are
  // hidden and non-interactive — only closeApp should actually unmount a window's content.
  const minimizedStyle = { pointerEvents: win.minimized ? 'none' : 'auto' };

  const genie = useMemo(
    () => (win.minimized ? genieOffset(app, win) : { x: 0, y: 0 }),
    [app, win]
  );

  const handleDrag = (e, info) => {
    const px = info.point.x;
    const py = info.point.y;
    const vw = window.innerWidth;
    let zone = null;
    if (px <= SNAP_EDGE) zone = 'left';
    else if (px >= vw - SNAP_EDGE) zone = 'right';
    else if (py <= SNAP_TOP) zone = 'top';
    setSnapZone(zone);
  };

  const handleDragEnd = () => {
    if (snapZone === 'left' || snapZone === 'right') {
      const vw = window.innerWidth;
      const vh = window.innerHeight - TOPBAR_H;
      const rect = { x: snapZone === 'left' ? 0 : vw / 2, y: 0, width: vw / 2, height: vh };
      mx.set(rect.x);
      my.set(rect.y);
      updateWindowRect(app.id, rect);
    } else if (snapZone === 'top') {
      if (!win.maximized) toggleMaximize(app.id);
    } else {
      updateWindowRect(app.id, { x: mx.get(), y: my.get(), width: win.width, height: win.height });
    }
    setSnapZone(null);
  };

  const maximized = win.maximized;

  return (
    <>
      <AnimatePresence>
        {snapZone && (
          <motion.div
            key="snap-preview"
            className="absolute rounded-2xl pointer-events-none"
            style={{
              zIndex: win.zIndex - 1,
              background: 'rgba(var(--os-accent-rgb), 0.08)',
              border: '1px solid rgba(var(--os-accent-rgb), 0.35)',
              boxShadow: 'inset 0 0 60px rgba(var(--os-accent-rgb), 0.08)',
              backdropFilter: 'blur(2px)',
              ...snapPreviewStyle(snapZone),
            }}
            initial={{ opacity: 0, scale: 0.985 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={T.fast}
          />
        )}
      </AnimatePresence>

      <motion.div
        drag={!maximized && !win.minimized}
        dragControls={dragControls}
        dragListener={false}
        dragMomentum={false}
        dragElastic={0}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        onPointerDownCapture={() => { if (!isActive && !win.minimized) focusApp(app.id); }}
        className="absolute"
        style={{
          top: 0,
          left: 0,
          x: maximized ? 0 : mx,
          y: maximized ? 0 : my,
          width: maximized ? '100%' : width,
          height: maximized ? '100%' : height,
          zIndex: win.zIndex,
          ...minimizedStyle,
        }}
        aria-hidden={win.minimized}
        role="dialog"
        aria-modal="false"
        aria-label={app.title}
        tabIndex={-1}
        ref={shellRef}
        initial={false}
        exit={{ opacity: 0, scale: 0.94, transition: T.base }}
      >
      <motion.div
        className="w-full h-full overflow-hidden flex flex-col os-window relative"
        style={{
          borderRadius: maximized ? 0 : 'var(--os-window-radius, 14px)',
          boxShadow: (SHADOWS[settings.windowShadow] || SHADOWS.normal)[isActive ? 'active' : 'idle'].join(', '),
          filter: isActive ? 'none' : 'brightness(0.94)',
          transition: 'box-shadow var(--dur-base) var(--ease-standard), filter var(--dur-base) var(--ease-standard), border-radius var(--dur-base) var(--ease-standard)',
        }}
        initial={{ opacity: 0, scale: 0.9, y: 26 }}
        animate={
          win.minimized
            ? {
                x: genie.x,
                y: genie.y,
                scale: 0.05,
                opacity: [1, 0.9, 0],
                transition: {
                  duration: DUR.slow,
                  ease: [0.55, 0.06, 0.68, 0.19],
                  opacity: { duration: DUR.slow, times: [0, 0.75, 1], ease: 'easeIn' },
                },
              }
            : {
                x: 0,
                y: 0,
                scale: 1,
                opacity: 1,
                transition: { type: 'spring', stiffness: 340, damping: 30, mass: 0.9 },
              }
        }
      >
      <div
        className="os-titlebar flex items-center gap-2 px-3.5 py-2.5 flex-shrink-0 select-none"
        style={{ cursor: maximized ? 'default' : 'grab', touchAction: 'none' }}
        onPointerDown={(e) => { if (!maximized) dragControls.start(e); }}
        onDoubleClick={() => toggleMaximize(app.id)}
      >
        <div className="group/tl flex items-center gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); closeApp(app.id); }}
            aria-label={`Close ${app.title}`}
            className="w-3 h-3 rounded-full flex items-center justify-center transition-all"
            style={{ background: isActive ? '#ff5f57' : 'rgba(255,255,255,0.18)', boxShadow: isActive ? 'inset 0 0 0 0.5px rgba(0,0,0,0.2)' : 'none' }}
          >
            <svg width="6" height="6" viewBox="0 0 6 6" className="opacity-0 group-hover/tl:opacity-100 transition-opacity">
              <path d="M1 1L5 5M5 1L1 5" stroke="rgba(0,0,0,0.55)" strokeWidth="1.1" strokeLinecap="round" />
            </svg>
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); minimizeApp(app.id); }}
            aria-label={`Minimize ${app.title}`}
            className="w-3 h-3 rounded-full flex items-center justify-center transition-all"
            style={{ background: isActive ? '#febc2e' : 'rgba(255,255,255,0.18)', boxShadow: isActive ? 'inset 0 0 0 0.5px rgba(0,0,0,0.2)' : 'none' }}
          >
            <svg width="6" height="6" viewBox="0 0 6 6" className="opacity-0 group-hover/tl:opacity-100 transition-opacity">
              <path d="M1 3H5" stroke="rgba(0,0,0,0.55)" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); toggleMaximize(app.id); }}
            aria-label={`Maximize ${app.title}`}
            className="w-3 h-3 rounded-full flex items-center justify-center transition-all"
            style={{ background: isActive ? '#28c840' : 'rgba(255,255,255,0.18)', boxShadow: isActive ? 'inset 0 0 0 0.5px rgba(0,0,0,0.2)' : 'none' }}
          >
            <svg width="6" height="6" viewBox="0 0 6 6" className="opacity-0 group-hover/tl:opacity-100 transition-opacity">
              <path d="M1.2 3.6V1.2H3.6M4.8 2.4V4.8H2.4" stroke="rgba(0,0,0,0.55)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
        <div className="flex items-center gap-1.5 mx-auto pr-14" style={{ opacity: isActive ? 1 : 0.55, transition: 'opacity 0.25s' }}>
          <Icon size={12} style={{ color: 'var(--text-3)' }} />
          <span className="text-xs font-medium tracking-wide" style={{ color: 'var(--text-2)' }}>{app.title}</span>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-auto">
        <Suspense fallback={<WindowLoadingSkeleton />}>
          <Content />
        </Suspense>
      </div>

      {!maximized && (
        <div
          onPointerDown={onResizePointerDown}
          className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize"
          style={{ touchAction: 'none' }}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" className="absolute bottom-0.5 right-0.5 opacity-40">
            <path d="M9 1L1 9M9 5L5 9M9 9L9 9" stroke="currentColor" strokeWidth="1" style={{ color: 'var(--text-3)' }} />
          </svg>
        </div>
      )}
      </motion.div>
      </motion.div>
    </>
  );
}
