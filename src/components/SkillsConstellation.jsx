import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SectionHeader from './SectionHeader';

// Node definitions — positions are percentages of the SVG viewBox (800 x 520)
const NODES = [
  // Core backend cluster (centre-left)
  { id: 'java',       label: 'Java',        x: 200, y: 200, r: 32, color: '#f59e0b', cat: 'backend' },
  { id: 'spring',     label: 'Spring Boot', x: 310, y: 130, r: 26, color: '#10b981', cat: 'backend' },
  { id: 'kafka',      label: 'Kafka',       x: 120, y: 320, r: 26, color: '#6366f1', cat: 'streaming' },
  { id: 'redis',      label: 'Redis',       x: 320, y: 300, r: 22, color: '#ef4444', cat: 'data' },
  // Database cluster (bottom-centre)
  { id: 'oracle',     label: 'Oracle SQL',  x: 230, y: 430, r: 22, color: '#c084fc', cat: 'data' },
  { id: 'postgres',   label: 'PostgreSQL',  x: 380, y: 420, r: 20, color: '#3b82f6', cat: 'data' },
  // Infra cluster (right)
  { id: 'docker',     label: 'Docker',      x: 530, y: 170, r: 24, color: '#06b6d4', cat: 'infra' },
  { id: 'k8s',        label: 'Kubernetes',  x: 620, y: 290, r: 24, color: '#7c3aed', cat: 'infra' },
  { id: 'aws',        label: 'AWS',         x: 500, y: 360, r: 20, color: '#f97316', cat: 'infra' },
  // Frontend / scripting
  { id: 'react',      label: 'React',       x: 450, y: 80,  r: 20, color: '#38bdf8', cat: 'frontend' },
  { id: 'python',     label: 'Python',      x: 650, y: 140, r: 20, color: '#fbbf24', cat: 'scripting' },
  // AI cluster (far right)
  { id: 'openai',     label: 'OpenAI',      x: 700, y: 390, r: 20, color: '#a3e635', cat: 'ai' },
  { id: 'claude',     label: 'Claude AI',   x: 760, y: 260, r: 20, color: '#e879f9', cat: 'ai' },
];

const EDGES = [
  // Java ↔ Spring Boot ↔ Kafka ↔ Redis
  ['java', 'spring'], ['java', 'kafka'], ['java', 'redis'],
  ['spring', 'redis'], ['spring', 'docker'],
  ['kafka', 'oracle'], ['kafka', 'redis'],
  ['redis', 'postgres'], ['redis', 'aws'],
  // Infra
  ['docker', 'k8s'], ['docker', 'react'], ['docker', 'python'],
  ['k8s', 'aws'], ['k8s', 'openai'],
  ['aws', 'openai'], ['aws', 'postgres'],
  // AI
  ['openai', 'claude'], ['python', 'openai'], ['python', 'claude'],
  ['react', 'spring'],
];

const CAT_LABELS = {
  backend: 'Backend',
  streaming: 'Streaming',
  data: 'Data',
  infra: 'Infrastructure',
  frontend: 'Frontend',
  scripting: 'Scripting',
  ai: 'AI / LLM',
};

function getConnected(nodeId) {
  const connected = new Set();
  for (const [a, b] of EDGES) {
    if (a === nodeId) connected.add(b);
    if (b === nodeId) connected.add(a);
  }
  return connected;
}

export default function SkillsConstellation() {
  const [hovered, setHovered] = useState(null);
  const [active, setActive] = useState(null);
  const svgRef = useRef(null);
  const [tick, setTick] = useState(0);

  // Slow pulse animation
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 60);
    return () => clearInterval(id);
  }, []);

  const focus = active || hovered;
  const connected = focus ? getConnected(focus) : null;

  const focusNode = NODES.find((n) => n.id === focus);

  function nodeAlpha(node) {
    if (!focus) return 1;
    if (node.id === focus) return 1;
    if (connected?.has(node.id)) return 0.85;
    return 0.2;
  }

  function edgeAlpha(a, b) {
    if (!focus) return 0.25;
    if ((a === focus && connected?.has(b)) || (b === focus && connected?.has(a))) return 0.85;
    return 0.06;
  }

  function edgeColor(a, b) {
    const na = NODES.find((n) => n.id === a);
    const nb = NODES.find((n) => n.id === b);
    if (!focus) return '#6366f1';
    if ((a === focus && connected?.has(b)) || (b === focus && connected?.has(a))) {
      return na.color;
    }
    return '#334155';
  }

  return (
    <section id="skills" className="section-padding" style={{ overflowX: 'clip' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          label="Skills"
          title="Technology"
          highlight="Constellation"
          description="Hover or tap any node to explore how my skills interconnect across backend, infra, data, and AI."
        />

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {Object.entries(CAT_LABELS).map(([cat, label]) => {
            const node = NODES.find((n) => n.cat === cat);
            return (
              <div key={cat} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: node?.color ?? '#6366f1' }} />
                <span className="text-[11px] font-mono" style={{ color: 'var(--text-4)' }}>{label}</span>
              </div>
            );
          })}
        </div>

        {/* Constellation SVG */}
        <motion.div
          className="relative rounded-2xl overflow-hidden"
          style={{
            background: 'linear-gradient(145deg, rgba(99,102,241,0.06) 0%, var(--surface) 50%)',
            border: '1px solid rgba(99,102,241,0.15)',
          }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <svg
            ref={svgRef}
            viewBox="0 0 800 520"
            className="w-full"
            style={{ maxHeight: 480 }}
          >
            {/* Background subtle star-dots */}
            {Array.from({ length: 40 }, (_, i) => {
              const bx = ((i * 137) % 800);
              const by = ((i * 97 + 40) % 520);
              return (
                <circle key={i} cx={bx} cy={by} r={0.8}
                  fill="rgba(255,255,255,0.15)" />
              );
            })}

            {/* Edges */}
            {EDGES.map(([a, b], i) => {
              const na = NODES.find((n) => n.id === a);
              const nb = NODES.find((n) => n.id === b);
              if (!na || !nb) return null;
              const alpha = edgeAlpha(a, b);
              const col = edgeColor(a, b);
              const isActive = focus && ((a === focus && connected?.has(b)) || (b === focus && connected?.has(a)));

              return (
                <g key={i}>
                  <line
                    x1={na.x} y1={na.y} x2={nb.x} y2={nb.y}
                    stroke={col}
                    strokeWidth={isActive ? 1.8 : 0.9}
                    strokeOpacity={alpha}
                    style={{ transition: 'stroke-opacity 0.25s, stroke-width 0.25s' }}
                  />
                  {/* Animated packet dot on active edges */}
                  {isActive && (
                    <circle r={3} fill={col} opacity={0.9}
                      style={{ filter: `drop-shadow(0 0 5px ${col})` }}>
                      <animateMotion
                        dur="1.8s"
                        repeatCount="indefinite"
                        path={`M ${na.x} ${na.y} L ${nb.x} ${nb.y}`}
                      />
                    </circle>
                  )}
                </g>
              );
            })}

            {/* Nodes */}
            {NODES.map((node) => {
              const alpha = nodeAlpha(node);
              const isF = node.id === focus;
              const pulse = Math.sin((tick * 0.05) + node.x * 0.01) * 0.5 + 0.5;
              const glowR = node.r + (isF ? 18 : 10 + pulse * 5);

              return (
                <g
                  key={node.id}
                  style={{ cursor: 'pointer', opacity: alpha, transition: 'opacity 0.25s' }}
                  onClick={() => setActive((prev) => (prev === node.id ? null : node.id))}
                  onMouseEnter={() => setHovered(node.id)}
                  onMouseLeave={() => setHovered(null)}
                >
                  {/* Outer glow ring */}
                  <circle
                    cx={node.x} cy={node.y} r={glowR}
                    fill={node.color}
                    opacity={isF ? 0.18 : 0.08 + pulse * 0.06}
                    style={{ transition: 'r 0.3s, opacity 0.3s' }}
                  />

                  {/* Ring */}
                  <circle
                    cx={node.x} cy={node.y} r={node.r + (isF ? 5 : 0)}
                    fill="none"
                    stroke={node.color}
                    strokeWidth={isF ? 2 : 1}
                    strokeOpacity={isF ? 0.9 : 0.5}
                    style={{ transition: 'r 0.25s, stroke-opacity 0.25s' }}
                  />

                  {/* Node circle */}
                  <circle
                    cx={node.x} cy={node.y} r={node.r}
                    fill={node.color}
                    fillOpacity={isF ? 0.35 : 0.18}
                    stroke={node.color}
                    strokeWidth={1.5}
                    strokeOpacity={0.7}
                    style={{ filter: isF ? `drop-shadow(0 0 12px ${node.color})` : undefined, transition: 'fill-opacity 0.25s' }}
                  />

                  {/* Label */}
                  <text
                    x={node.x} y={node.y + node.r + 14}
                    textAnchor="middle"
                    fontSize={isF ? 11 : 10}
                    fontFamily="monospace"
                    fontWeight={isF ? '700' : '500'}
                    fill={node.color}
                    fillOpacity={isF ? 1 : 0.8}
                    style={{ transition: 'font-size 0.2s, fill-opacity 0.25s', userSelect: 'none' }}
                  >
                    {node.label}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Focus info tooltip */}
          <AnimatePresence>
            {focusNode && (
              <motion.div
                className="absolute top-4 left-4 px-4 py-3 rounded-xl pointer-events-none"
                style={{
                  background: `${focusNode.color}18`,
                  border: `1px solid ${focusNode.color}40`,
                  backdropFilter: 'blur(8px)',
                }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <div className="text-xs font-mono font-bold mb-0.5" style={{ color: focusNode.color }}>
                  {focusNode.label}
                </div>
                <div className="text-[10px] font-mono" style={{ color: 'var(--text-4)' }}>
                  {CAT_LABELS[focusNode.cat]}
                  &nbsp;·&nbsp;
                  {getConnected(focusNode.id).size} connections
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Hint */}
          {!focusNode && (
            <div className="absolute bottom-4 left-0 right-0 text-center">
              <span className="text-[10px] font-mono" style={{ color: 'var(--text-4)' }}>
                hover or tap a node to explore connections
              </span>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
