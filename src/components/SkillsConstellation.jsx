import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SectionHeader from './SectionHeader';

const NODES = [
  { id: 'java',     label: 'Java',        x: 200, y: 200, r: 28, color: '#f59e0b', cat: 'backend' },
  { id: 'spring',   label: 'Spring Boot', x: 310, y: 120, r: 24, color: '#10b981', cat: 'backend' },
  { id: 'kafka',    label: 'Kafka',       x: 105, y: 315, r: 24, color: '#6366f1', cat: 'streaming' },
  { id: 'redis',    label: 'Redis',       x: 320, y: 295, r: 21, color: '#ef4444', cat: 'data' },
  { id: 'oracle',   label: 'Oracle SQL',  x: 210, y: 420, r: 20, color: '#c084fc', cat: 'data' },
  { id: 'postgres', label: 'PostgreSQL',  x: 380, y: 410, r: 19, color: '#3b82f6', cat: 'data' },
  { id: 'docker',   label: 'Docker',      x: 510, y: 160, r: 22, color: '#06b6d4', cat: 'infra' },
  { id: 'k8s',      label: 'Kubernetes',  x: 600, y: 280, r: 22, color: '#7c3aed', cat: 'infra' },
  { id: 'aws',      label: 'AWS',         x: 490, y: 355, r: 19, color: '#f97316', cat: 'infra' },
  { id: 'react',    label: 'React',       x: 430, y: 75,  r: 18, color: '#38bdf8', cat: 'frontend' },
  { id: 'python',   label: 'Python',      x: 630, y: 145, r: 18, color: '#fbbf24', cat: 'scripting' },
  { id: 'openai',   label: 'OpenAI',      x: 680, y: 375, r: 18, color: '#a3e635', cat: 'ai' },
  { id: 'claude',   label: 'Claude AI',   x: 740, y: 250, r: 18, color: '#e879f9', cat: 'ai' },
];

const EDGES = [
  ['java','spring'],['java','kafka'],['java','redis'],
  ['spring','redis'],['spring','docker'],['spring','react'],
  ['kafka','oracle'],['kafka','redis'],
  ['redis','postgres'],['redis','aws'],
  ['docker','k8s'],['docker','python'],['docker','react'],
  ['k8s','aws'],['k8s','openai'],
  ['aws','openai'],['aws','postgres'],
  ['openai','claude'],['python','openai'],['python','claude'],
];

const CAT_LABELS = {
  backend:'Backend', streaming:'Streaming', data:'Data',
  infra:'Infrastructure', frontend:'Frontend', scripting:'Scripting', ai:'AI / LLM',
};

function getConnected(id) {
  const s = new Set();
  for (const [a,b] of EDGES) {
    if (a === id) s.add(b);
    if (b === id) s.add(a);
  }
  return s;
}

// Compute a curved midpoint for an edge so lines arc gently
function curveMid(na, nb) {
  const mx = (na.x + nb.x) / 2;
  const my = (na.y + nb.y) / 2;
  const dx = nb.x - na.x;
  const dy = nb.y - na.y;
  const perp = 0.18;
  return { cx: mx - dy * perp, cy: my + dx * perp };
}

export default function SkillsConstellation() {
  const [focus, setFocus] = useState(null);

  const connected = focus ? getConnected(focus) : null;
  const focusNode = NODES.find(n => n.id === focus);

  const nodeAlpha = (n) => {
    if (!focus) return 1;
    if (n.id === focus || connected?.has(n.id)) return 1;
    return 0.18;
  };

  const isActiveEdge = (a, b) =>
    focus && ((a === focus && connected?.has(b)) || (b === focus && connected?.has(a)));

  return (
    <div className="@container p-6 sm:p-8">
      <div>
        <SectionHeader
          label="Skills"
          title="Technology"
          highlight="Constellation"
          description="Tap any node to explore how my skills interconnect."
        />

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mb-8">
          {Object.entries(CAT_LABELS).map(([cat, label]) => {
            const node = NODES.find(n => n.cat === cat);
            return (
              <div key={cat} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ background: node?.color }} />
                <span className="text-[11px] font-mono" style={{ color: 'var(--text-4)' }}>{label}</span>
              </div>
            );
          })}
        </div>

        {/* SVG constellation — no container border */}
        <motion.div
          className="relative"
        >
          <svg
            viewBox="0 0 800 500"
            className="w-full"
            style={{ maxHeight: 480, display: 'block' }}
          >
            <defs>
              {/* Radial glow filter for active nodes */}
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
            </defs>

            {/* Subtle starfield */}
            {Array.from({ length: 35 }, (_, i) => (
              <circle key={i}
                cx={(i * 173 + 40) % 800}
                cy={(i * 113 + 60) % 500}
                r={0.7} fill="rgba(255,255,255,0.12)" />
            ))}

            {/* Edges — curved bezier lines */}
            {EDGES.map(([a, b], i) => {
              const na = NODES.find(n => n.id === a);
              const nb = NODES.find(n => n.id === b);
              if (!na || !nb) return null;
              const active = isActiveEdge(a, b);
              const { cx, cy } = curveMid(na, nb);
              const col = active ? na.color : (focus ? '#1e293b' : 'rgba(99,102,241,0.22)');
              const w = active ? 2 : 1;

              return (
                <g key={i}>
                  <path
                    d={`M ${na.x} ${na.y} Q ${cx} ${cy} ${nb.x} ${nb.y}`}
                    fill="none"
                    stroke={col}
                    strokeWidth={w}
                    strokeOpacity={active ? 0.9 : (focus ? 0.08 : 1)}
                    style={{ transition: 'stroke 0.25s, stroke-opacity 0.25s, stroke-width 0.2s' }}
                  />
                  {/* Animated packet dot on active edges */}
                  {active && (
                    <circle r={3} fill={na.color} opacity={0.95}
                      style={{ filter: `drop-shadow(0 0 4px ${na.color})` }}>
                      <animateMotion dur="1.6s" repeatCount="indefinite"
                        path={`M ${na.x} ${na.y} Q ${cx} ${cy} ${nb.x} ${nb.y}`} />
                    </circle>
                  )}
                </g>
              );
            })}

            {/* Nodes */}
            {NODES.map((node) => {
              const isF = node.id === focus;
              const alpha = nodeAlpha(node);
              // The glow used to breathe on a 55ms interval — an ~18/s
              // re-render of the whole SVG for a few pixels of radius nobody
              // could see. Static now; focus is the only thing that moves.
              const glowR = node.r + (isF ? 16 : 10);

              return (
                <g key={node.id}
                  style={{ cursor: 'pointer', opacity: alpha, transition: 'opacity 0.22s' }}
                  onClick={() => setFocus(p => p === node.id ? null : node.id)}
                >
                  {/* Outer glow */}
                  <circle cx={node.x} cy={node.y} r={glowR}
                    fill={node.color}
                    opacity={isF ? 0.20 : 0.09}
                    style={{ transition: 'opacity 0.3s, r 0.3s' }} />

                  {/* Stroke ring */}
                  <circle cx={node.x} cy={node.y} r={node.r + (isF ? 4 : 0)}
                    fill="none" stroke={node.color}
                    strokeWidth={isF ? 2 : 1.2}
                    strokeOpacity={isF ? 1 : 0.65}
                    style={{ transition: 'r 0.25s, stroke-opacity 0.22s' }} />

                  {/* Solid filled node */}
                  <circle cx={node.x} cy={node.y} r={node.r}
                    fill={node.color}
                    fillOpacity={isF ? 0.42 : 0.22}
                    filter={isF ? 'url(#glow)' : undefined}
                    style={{ transition: 'fill-opacity 0.22s' }} />

                  {/* Label */}
                  <text x={node.x} y={node.y + node.r + 13}
                    textAnchor="middle"
                    fontSize={isF ? 11.5 : 10}
                    fontFamily="monospace"
                    fontWeight={isF ? '700' : '500'}
                    fill={node.color}
                    fillOpacity={isF ? 1 : 0.82}
                    style={{ transition: 'font-size 0.2s', userSelect: 'none', pointerEvents: 'none' }}>
                    {node.label}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Focus tooltip */}
          <AnimatePresence>
            {focusNode && (
              <motion.div
                className="absolute top-3 left-3 px-3.5 py-2.5 rounded-xl pointer-events-none"
                style={{
                  background: 'var(--surface)',
                  border: `1px solid ${focusNode.color}40`,
                  backdropFilter: 'blur(8px)',
                }}
                initial={{ opacity: 0, scale: 0.88 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.88 }}
                transition={{ duration: 0.18 }}
              >
                <div className="text-xs font-mono font-bold mb-0.5" style={{ color: focusNode.color }}>
                  {focusNode.label}
                </div>
                <div className="text-[10px] font-mono" style={{ color: 'var(--text-4)' }}>
                  {CAT_LABELS[focusNode.cat]} · {getConnected(focusNode.id).size} links
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!focus && (
            <p className="absolute bottom-3 left-0 right-0 text-center text-[10px] font-mono pointer-events-none" style={{ color: 'var(--text-4)' }}>
              tap a node to explore connections
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
