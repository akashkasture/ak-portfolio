import { Suspense, useEffect, useState } from 'react';
import { motion, useDragControls, useMotionValue } from 'framer-motion';
import { Minus, X } from 'lucide-react';
import { useWindowManager } from '../context/WindowManagerContext';
import { useWindowResize } from '../hooks/useWindowResize';
import { useIsMobile } from '../hooks/useIsMobile';

function WindowLoadingSkeleton() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-6 h-6 rounded-full border-2 border-white/15 border-t-indigo-400 animate-spin" />
    </div>
  );
}

export default function Window({ app, win, isActive }) {
  const { focusApp, closeApp, minimizeApp, toggleMaximize, updateWindowRect } = useWindowManager();
  const isMobile = useIsMobile();
  const Icon = app.icon;
  const Content = app.component;

  const mx = useMotionValue(win.x);
  const my = useMotionValue(win.y);
  const dragControls = useDragControls();
  const [liveSize, setLiveSize] = useState(null);
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

  if (isMobile) {
    return (
      <motion.div
        className="absolute inset-0 flex flex-col"
        style={{ zIndex: win.zIndex, background: 'var(--bg)', ...minimizedStyle }}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: win.minimized ? 0 : 1, y: 0 }}
        exit={{ opacity: 0, y: 24 }}
        transition={{ duration: 0.2 }}
        aria-hidden={win.minimized}
        onPointerDown={() => focusApp(app.id)}
      >
        <div className="glass-strong flex items-center gap-3 px-4 py-3 flex-shrink-0" style={{ borderBottom: '1px solid var(--surface-border)' }}>
          <button
            onClick={() => minimizeApp(app.id)}
            aria-label="Back to desktop"
            className="p-1.5 -ml-1.5 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <Minus size={18} className="rotate-90" />
          </button>
          <Icon size={16} style={{ color: 'var(--text-2)' }} />
          <span className="text-sm font-semibold font-mono" style={{ color: 'var(--text-1)' }}>{app.title}</span>
          <button
            onClick={() => closeApp(app.id)}
            aria-label="Close"
            className="ml-auto p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        <div className="flex-1 min-h-0 overflow-auto">
          <Suspense fallback={<WindowLoadingSkeleton />}>
            <Content />
          </Suspense>
        </div>
      </motion.div>
    );
  }

  const maximized = win.maximized;

  return (
    <motion.div
      drag={!maximized && !win.minimized}
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      dragElastic={0}
      onDragEnd={() => updateWindowRect(app.id, { x: mx.get(), y: my.get(), width: win.width, height: win.height })}
      onPointerDownCapture={() => { if (!isActive && !win.minimized) focusApp(app.id); }}
      className="absolute rounded-xl overflow-hidden flex flex-col glass-strong"
      style={{
        top: 0,
        left: 0,
        x: maximized ? 0 : mx,
        y: maximized ? 0 : my,
        width: maximized ? '100%' : width,
        height: maximized ? '100%' : height,
        zIndex: win.zIndex,
        boxShadow: isActive
          ? '0 24px 70px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.06)'
          : '0 12px 40px rgba(0,0,0,0.4)',
        ...minimizedStyle,
      }}
      aria-hidden={win.minimized}
      initial={{ opacity: 0, scale: 0.92, y: (win.y ?? 0) + 20 }}
      animate={{ opacity: win.minimized ? 0 : 1, scale: win.minimized ? 0.85 : 1 }}
      exit={{ opacity: 0, scale: 0.92 }}
      transition={{ duration: 0.2 }}
    >
      <div
        className="flex items-center gap-2 px-3 py-2.5 flex-shrink-0 select-none"
        style={{ borderBottom: '1px solid var(--surface-border)', cursor: maximized ? 'default' : 'grab', touchAction: 'none' }}
        onPointerDown={(e) => { if (!maximized) dragControls.start(e); }}
        onDoubleClick={() => toggleMaximize(app.id)}
      >
        <div className="flex items-center gap-1.5">
          <button
            onClick={(e) => { e.stopPropagation(); closeApp(app.id); }}
            aria-label="Close"
            className="w-3 h-3 rounded-full bg-[#ff5f57] hover:brightness-110 transition-all"
          />
          <button
            onClick={(e) => { e.stopPropagation(); minimizeApp(app.id); }}
            aria-label="Minimize"
            className="w-3 h-3 rounded-full bg-[#febc2e] hover:brightness-110 transition-all"
          />
          <button
            onClick={(e) => { e.stopPropagation(); toggleMaximize(app.id); }}
            aria-label="Maximize"
            className="w-3 h-3 rounded-full bg-[#28c840] hover:brightness-110 transition-all"
          />
        </div>
        <div className="flex items-center gap-1.5 mx-auto pr-12">
          <Icon size={12} style={{ color: 'var(--text-3)' }} />
          <span className="text-xs font-mono" style={{ color: 'var(--text-3)' }}>{app.title}</span>
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
  );
}
