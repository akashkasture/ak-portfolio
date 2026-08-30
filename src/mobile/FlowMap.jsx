import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { GRAPH, NODE_BY_ID, RESOLVED_EDGES } from '../flow/graph';
import { T } from '../os/motion';
import { trackEvent } from '../utils/analytics';

/* The phone's answer to Signal Flow.

   The desktop flies a camera through this topology in WebGL. Charging a
   phone ~900kB of Three.js for that is not a trade worth making, but the
   topology is the most interesting thing on the page and it was being
   withheld from the smaller screen entirely — mobile got prose where
   desktop got the system.

   So this is the same graph, same data, drawn flat: curves in one SVG
   layer, labelled chips as real HTML on top. HTML for the chips because
   SVG has no text layout, so a longer label would need a hand-measured
   box; this way "PostgreSQL" sizes itself. Both layers scale together
   because the SVG owns the box and the chips are positioned as
   percentages of the same design space.

   The packets are the one animation here that earns its place: this is an
   event-driven system, and a still diagram of one is indistinguishable
   from a diagram of a synchronous one. The movement is the claim. */

const W = 340;
const H = 440;

// Perpendicular offset from the midpoint, so a bowed edge routes around
// the node it would otherwise pass under.
function edgePath(edge) {
  const [x1, y1] = edge.fromNode.flat;
  const [x2, y2] = edge.toNode.flat;
  if (!edge.bow) return `M ${x1} ${y1} L ${x2} ${y2}`;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const cx = (x1 + x2) / 2 + (-dy / len) * edge.bow;
  const cy = (y1 + y2) / 2 + (dx / len) * edge.bow;
  return `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;
}

function NodeChip({ node, selected, dimmed, onSelect }) {
  const [x, y] = node.flat;
  return (
    <button
      onClick={() => onSelect(node.id)}
      aria-pressed={selected}
      className="absolute flex items-center gap-1.5 rounded-md whitespace-nowrap"
      style={{
        left: `${(x / W) * 100}%`,
        top: `${(y / H) * 100}%`,
        transform: 'translate(-50%, -50%)',
        padding: '5px 9px',
        fontSize: 11.5,
        fontWeight: 500,
        letterSpacing: '0.01em',
        color: selected ? '#fff' : 'var(--text-2)',
        background: selected ? node.color : 'var(--bg)',
        border: `1px solid ${selected ? node.color : 'var(--surface-border)'}`,
        // Deliberately no coloured glow on the selected chip. Against a
        // black background it reads as neon, which is the register this
        // portfolio stays out of; the fill and the dimmed neighbours
        // already carry the selection.
        boxShadow: '0 1px 3px rgba(0,0,0,0.4)',
        opacity: dimmed ? 0.32 : 1,
        transition: 'opacity 160ms ease, color 160ms ease, background 160ms ease',
      }}
    >
      <span
        className="rounded-full flex-shrink-0"
        style={{
          width: 5,
          height: 5,
          background: selected ? 'rgba(255,255,255,0.9)' : node.color,
        }}
      />
      {node.label}
    </button>
  );
}

function Detail({ node, onClose }) {
  const ref = useRef(null);

  /* The diagram is taller than a phone screen, so a node tapped near its
     top opens a panel well below the fold — it looked like tapping did
     nothing but dim things. Bring the panel to the edge of the viewport,
     no further, so the diagram stays visible above it. */
  useEffect(() => {
    ref.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [node.id]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={T.fast}
      className="mt-3 rounded-lg p-4"
      style={{ background: 'var(--surface-alt)', border: '1px solid var(--surface-border)' }}
    >
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: node.color }} />
            <span className="text-[14px] font-medium" style={{ color: 'var(--text-1)' }}>
              {node.label}
            </span>
            <span
              className="text-[10px] font-mono uppercase tracking-[0.12em]"
              style={{ color: 'var(--text-4)' }}
            >
              {node.kind}
            </span>
          </div>
          <p className="text-[13px] leading-relaxed mt-2" style={{ color: 'var(--text-2)' }}>
            {node.summary}
          </p>
        </div>
        <button onClick={onClose} aria-label="Close" className="flex-shrink-0 -mt-1 -mr-1 p-1">
          <X size={14} style={{ color: 'var(--text-4)' }} />
        </button>
      </div>

      <div className="text-[12px] font-mono mt-3" style={{ color: 'var(--text-3)' }}>
        {node.tech.join(' · ')}
      </div>

      {/* Verbatim resume lines, never a generated claim about the node. */}
      {node.proof?.length > 0 && (
        <ul className="mt-3 space-y-1.5">
          {node.proof.map((line) => (
            <li key={line} className="text-[12.5px] leading-relaxed pl-3.5 relative" style={{ color: 'var(--text-2)' }}>
              <span className="absolute left-0 top-[0.62em] w-2 h-px" style={{ background: node.color }} />
              {line}
            </li>
          ))}
        </ul>
      )}

      {node.projects.length > 0 && (
        <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--surface-border)' }}>
          <div
            className="text-[10px] font-mono uppercase tracking-[0.12em] mb-1.5"
            style={{ color: 'var(--text-4)' }}
          >
            Built with it
          </div>
          {node.projects.map((p) => (
            <div key={p.id} className="text-[12.5px]" style={{ color: 'var(--text-2)' }}>
              {p.title}
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

export default function FlowMap() {
  const [selected, setSelected] = useState(null);
  const svgRef = useRef(null);
  const wrapRef = useRef(null);

  const reduced = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches,
    []
  );

  /* Packets keep ticking while the tab is scrolled past otherwise, which
     is work nobody can see. SMIL exposes a real pause, so use it. */
  useEffect(() => {
    const svg = svgRef.current;
    const wrap = wrapRef.current;
    if (!svg || !wrap || reduced) return;
    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? svg.unpauseAnimations() : svg.pauseAnimations()),
      { threshold: 0.05 }
    );
    io.observe(wrap);
    return () => io.disconnect();
  }, [reduced]);

  const node = selected ? NODE_BY_ID[selected] : null;

  // Selecting a node quiets everything it isn't connected to, so the
  // graph answers "what talks to this" without a legend.
  const related = useMemo(() => {
    if (!selected) return null;
    const set = new Set([selected]);
    for (const e of RESOLVED_EDGES) {
      if (e.from === selected) set.add(e.to);
      if (e.to === selected) set.add(e.from);
    }
    return set;
  }, [selected]);

  const select = (id) => {
    const next = id === selected ? null : id;
    setSelected(next);
    if (next) trackEvent('flow_node_select', { node: next, surface: 'mobile' });
  };

  return (
    <div>
      <div ref={wrapRef} className="relative w-full">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          className="w-full h-auto block"
          role="img"
          aria-label="Architecture: clients and a market feed enter through an API gateway, fan out to microservices and an AI layer, cross a Kafka event backbone, and land in Redis and PostgreSQL."
        >
          {RESOLVED_EDGES.map((edge) => {
            const id = `fm-${edge.from}-${edge.to}`;
            const d = edgePath(edge);
            const on = !related || (related.has(edge.from) && related.has(edge.to));
            return (
              <g key={id} opacity={on ? 1 : 0.15} style={{ transition: 'opacity 160ms ease' }}>
                <path
                  id={id}
                  d={d}
                  fill="none"
                  stroke={edge.toNode.color}
                  strokeOpacity={edge.dashed ? 0.28 : 0.4}
                  strokeWidth={edge.dashed ? 1 : 1.25}
                  strokeDasharray={edge.dashed ? '3 4' : undefined}
                />
                {!reduced &&
                  !edge.dashed &&
                  Array.from({ length: edge.weight }).map((_, i) => (
                    <circle key={i} r={2} fill={edge.toNode.color}>
                      <animateMotion
                        dur={`${2.6 + edge.weight * 0.25}s`}
                        repeatCount="indefinite"
                        begin={`${(i * (2.6 + edge.weight * 0.25)) / edge.weight}s`}
                        keyPoints="0;1"
                        keyTimes="0;1"
                        calcMode="linear"
                      >
                        <mpath href={`#${id}`} />
                      </animateMotion>
                    </circle>
                  ))}
              </g>
            );
          })}
        </svg>

        {GRAPH.map((n) => (
          <NodeChip
            key={n.id}
            node={n}
            selected={n.id === selected}
            dimmed={!!related && !related.has(n.id)}
            onSelect={select}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {node && <Detail key={node.id} node={node} onClose={() => setSelected(null)} />}
      </AnimatePresence>

      {!node && (
        <p className="text-[11.5px] mt-2 text-center" style={{ color: 'var(--text-4)' }}>
          Tap a service to see what it does
        </p>
      )}
    </div>
  );
}
