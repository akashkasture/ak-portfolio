import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import FlowScene from './FlowScene';
import NodeDetail from './NodeDetail';
import { GRAPH } from './graph';
import { detectQualityTier, hasWebGLSupport } from '../space/detectQuality';
import { useWindowManager } from '../context/WindowManagerContext';
import { T } from '../os/motion';
import { trackEvent } from '../utils/analytics';

/* Signal Flow: the architecture as somewhere you can go.

   Full-screen rather than a wallpaper, because the whole point is to fly
   into it — behind a stack of windows the hotspots would be covered by
   the very content they're meant to introduce. It is lazy-loaded, so a
   visitor who never opens it never downloads three.js.

   The node chips along the bottom are not a nav bar for show: they are
   the keyboard and screen-reader path into a scene that is otherwise
   only reachable by clicking a shape in a canvas. */

export default function FlowMode({ onExit }) {
  const [selected, setSelected] = useState(null);
  const [hovered, setHovered] = useState(null);
  const { openApp } = useWindowManager();

  const quality = useMemo(() => detectQualityTier(), []);
  const webgl = useMemo(() => hasWebGLSupport(), []);
  const reduced = useMemo(
    () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false,
    []
  );

  const select = useCallback((node) => {
    setSelected(node);
    if (node) trackEvent('flow_node_select', { node: node.id });
  }, []);

  // Esc steps back one level — out of a node first, then out of the mode.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      e.preventDefault();
      if (selected) setSelected(null);
      else onExit();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selected, onExit]);

  const openProject = (p) => {
    onExit();
    openApp('projects');
    requestAnimationFrame(() =>
      window.dispatchEvent(new CustomEvent('ak-os:open-project', { detail: { id: p.id } }))
    );
    trackEvent('flow_open_project', { project: p.title });
  };

  return (
    <motion.div
      className="fixed inset-0 z-[80]"
      style={{ background: '#05070d' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={T.slow}
      role="region"
      aria-label="Signal Flow — system architecture"
    >
      {webgl ? (
        <FlowScene
          selected={selected}
          onSelect={select}
          onHover={setHovered}
          quality={quality}
          reduced={reduced}
        />
      ) : (
        /* No WebGL: the same information, as a list. Better than an
           apologetic empty state. */
        <div className="absolute inset-0 overflow-y-auto p-8">
          <p className="text-[13px] mb-6" style={{ color: 'var(--text-3)' }}>
            This view needs WebGL, which this browser has turned off. The same
            architecture, as text:
          </p>
          {GRAPH.map((n) => (
            <div key={n.id} className="mb-5 max-w-prose">
              <div className="text-[15px] font-medium" style={{ color: 'var(--text-1)' }}>{n.label}</div>
              <div className="text-[13px] mt-1" style={{ color: 'var(--text-2)' }}>{n.summary}</div>
            </div>
          ))}
        </div>
      )}

      {/* Header */}
      <div className="absolute top-0 inset-x-0 flex items-start justify-between p-5 pointer-events-none">
        <div className="pointer-events-auto">
          <h1 className="font-display text-[20px] leading-tight" style={{ color: 'var(--text-1)' }}>
            Signal Flow
          </h1>
          <p className="text-[12px] mt-0.5 max-w-xs" style={{ color: 'var(--text-3)' }}>
            The system I build, as a place. Click a node to fly to it.
          </p>
        </div>
        <button
          onClick={onExit}
          aria-label="Exit Signal Flow"
          className="pointer-events-auto flex items-center gap-2 px-3 py-1.5 rounded-lg text-[12px]"
          style={{ background: 'rgba(255,255,255,0.07)', color: 'var(--text-2)' }}
        >
          <X size={14} /> Esc
        </button>
      </div>

      {/* Hover readout — a peek before you commit to flying somewhere. */}
      <div
        className="absolute bottom-24 left-5 text-[12px] font-mono pointer-events-none transition-opacity"
        style={{ color: 'var(--text-3)', opacity: hovered && !selected ? 1 : 0 }}
      >
        {hovered ? `${hovered.label} — ${hovered.projects.length} project${hovered.projects.length === 1 ? '' : 's'}` : ''}
      </div>

      {/* The keyboard path into the scene. */}
      {/* Shifts clear of the detail panel so the last chips don't slide
          underneath it. */}
      <nav
        aria-label="Nodes"
        className="absolute bottom-0 inset-x-0 flex flex-wrap items-center justify-center gap-1.5 p-4 transition-[padding]"
        style={{ paddingRight: selected ? 'calc(380px + 1rem)' : undefined }}
      >
        {GRAPH.map((n) => (
          <button
            key={n.id}
            onClick={() => select(selected?.id === n.id ? null : n)}
            onFocus={() => setHovered(n)}
            onBlur={() => setHovered(null)}
            aria-pressed={selected?.id === n.id}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[12px] transition-colors"
            style={{
              background: selected?.id === n.id ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.05)',
              color: selected?.id === n.id ? 'var(--text-1)' : 'var(--text-3)',
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: n.color }} />
            {n.label}
          </button>
        ))}
      </nav>

      <NodeDetail node={selected} onClose={() => setSelected(null)} onOpenProject={openProject} />
    </motion.div>
  );
}
