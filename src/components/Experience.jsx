import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Briefcase, Calendar, TrendingUp, Zap, DollarSign, Activity,
  CheckCircle2, MessageSquare, BarChart3, Cpu, ArrowUpRight,
} from 'lucide-react';
import { experience } from '../data/portfolio';
import SectionHeader from './SectionHeader';

const METRICS = [
  {
    value: '15K+',
    unit: 'msgs / day',
    label: 'Kafka Throughput',
    color: '#7c3aed',
    icon: MessageSquare,
    desc: 'Peak daily messages across 5K+ endpoints',
  },
  {
    value: '$50M+',
    unit: '/ month',
    label: 'Transaction Volume',
    color: '#10b981',
    icon: DollarSign,
    desc: 'Automated payment workflows, zero errors',
  },
  {
    value: '99.95%',
    unit: 'SLA',
    label: 'System Uptime',
    color: '#06b6d4',
    icon: Activity,
    desc: 'Production uptime across all services',
  },
  {
    value: '40%',
    unit: 'efficiency ↑',
    label: 'Process Improvement',
    color: '#f59e0b',
    icon: TrendingUp,
    desc: 'Gained via SQL & workflow optimisation',
  },
];

const ROLE_COLORS = ['#7c3aed', '#f59e0b'];

function MetricCard({ metric, delay }) {
  const Icon = metric.icon;
  const ref = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  const onMove = (e) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    setTilt({
      x: ((e.clientY - r.top) / r.height - 0.5) * -14,
      y: ((e.clientX - r.left) / r.width - 0.5) * 14,
    });
  };

  return (
    <motion.div
      ref={ref}
      className="relative rounded-2xl overflow-hidden cursor-default"
      style={{
        background: `linear-gradient(140deg, ${metric.color}1a 0%, ${metric.color}07 55%, transparent 100%)`,
        border: `1px solid ${metric.color}45`,
        boxShadow: hovered
          ? `0 0 80px ${metric.color}30, 0 30px 60px rgba(0,0,0,0.5), inset 0 1px 0 ${metric.color}25`
          : `0 0 50px ${metric.color}14, 0 16px 40px rgba(0,0,0,0.35), inset 0 1px 0 ${metric.color}18`,
        transform: hovered
          ? `perspective(700px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(1.05,1.05,1.05)`
          : 'perspective(700px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)',
        transition: hovered ? 'transform 0.12s ease, box-shadow 0.3s ease' : 'transform 0.6s ease, box-shadow 0.3s ease',
      }}
      onMouseMove={onMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setTilt({ x: 0, y: 0 }); }}
      initial={{ opacity: 0, y: 40, scale: 0.92 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Bold gradient top bar */}
      <div
        className="absolute top-0 left-0 right-0"
        style={{ height: 2, background: `linear-gradient(90deg, transparent, ${metric.color}dd, ${metric.color}, ${metric.color}dd, transparent)` }}
      />

      {/* Ambient corner glow ball */}
      <div
        className="absolute -top-10 -right-10 w-40 h-40 rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${metric.color}45 0%, transparent 68%)` }}
      />
      <div
        className="absolute -bottom-8 -left-8 w-28 h-28 rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${metric.color}20 0%, transparent 65%)` }}
      />

      {/* Large ghost icon */}
      <div className="absolute -bottom-2 -right-2 pointer-events-none" style={{ opacity: 0.06 }}>
        <Icon size={96} style={{ color: metric.color }} />
      </div>

      {/* Animated shimmer sweep */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ background: `linear-gradient(110deg, transparent 25%, ${metric.color}22 50%, transparent 75%)` }}
        animate={{ x: ['-130%', '230%'] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: 'linear', repeatDelay: 1.8 }}
      />

      <div className="relative z-10 p-5 sm:p-6">
        {/* Icon with live dot */}
        <div className="relative inline-block mb-5">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${metric.color}38, ${metric.color}12)`,
              border: `1px solid ${metric.color}60`,
              boxShadow: `0 0 28px ${metric.color}55, inset 0 1px 0 ${metric.color}35`,
            }}
          >
            <Icon size={20} style={{ color: metric.color }} />
          </div>
          {/* Pulsing live dot */}
          <motion.div
            className="absolute -top-1 -right-1 w-3 h-3 rounded-full"
            style={{ background: metric.color, border: '2px solid var(--bg)', boxShadow: `0 0 8px ${metric.color}` }}
            animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        {/* Giant value */}
        <div
          className="text-4xl sm:text-5xl font-black tabular-nums leading-none mb-1"
          style={{
            color: metric.color,
            textShadow: `0 0 40px ${metric.color}95, 0 0 80px ${metric.color}45`,
            letterSpacing: '-0.03em',
          }}
        >
          {metric.value}
        </div>

        {/* Unit */}
        <div
          className="text-[11px] font-mono font-bold uppercase tracking-widest mb-2.5"
          style={{ color: `${metric.color}bb` }}
        >
          {metric.unit}
        </div>

        {/* Label */}
        <div className="text-xs font-semibold mb-1" style={{ color: 'var(--text-2)' }}>
          {metric.label}
        </div>

        {/* Description */}
        <div className="text-[11px] leading-relaxed" style={{ color: 'var(--text-4)' }}>
          {metric.desc}
        </div>

        {/* Bottom accent line */}
        <div
          className="absolute bottom-0 left-6 right-6 h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${metric.color}55, transparent)` }}
        />
      </div>
    </motion.div>
  );
}

function useTilt() {
  const ref = useRef(null);
  const [style, setStyle] = useState({});

  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width  - 0.5) * 12;
    const y = ((e.clientY - r.top)  / r.height - 0.5) * -12;
    setStyle({ transform: `perspective(900px) rotateY(${x}deg) rotateX(${y}deg) scale3d(1.015,1.015,1.015)` });
  };
  const onLeave = () => setStyle({ transform: 'perspective(900px) rotateY(0deg) rotateX(0deg) scale3d(1,1,1)' });

  return { ref, style, onMove, onLeave };
}

function AchievementChip({ text, color, delay }) {
  return (
    <motion.div
      className="flex items-start gap-2.5 p-3.5 rounded-xl relative overflow-hidden group"
      style={{
        background: `${color}08`,
        border: `1px solid ${color}22`,
      }}
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ borderColor: `${color}50`, background: `${color}14` }}
    >
      <CheckCircle2 size={14} className="flex-shrink-0 mt-0.5" style={{ color }} />
      <span className="text-sm leading-relaxed" style={{ color: 'var(--text-2)' }}>{text}</span>
    </motion.div>
  );
}

export default function Experience() {
  return (
    <section id="experience" className="section-padding" style={{ overflowX: 'clip' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          label="Experience"
          title="Professional"
          highlight="Impact"
          description="Shipping production systems that handle real money, real users, and real scale."
        />

        {/* Impact Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {METRICS.map((m, i) => (
            <MetricCard key={m.label} metric={m} delay={i * 0.08} />
          ))}
        </div>

        {/* Experience cards */}
        <div className="space-y-8">
          {experience.map((exp, i) => {
            const color = ROLE_COLORS[i] || '#7c3aed';
            const tilt = useTilt();
            return (
              <motion.div
                key={exp.id}
                ref={tilt.ref}
                style={{ ...tilt.style, transition: 'transform 0.25s ease' }}
                onMouseMove={tilt.onMove}
                onMouseLeave={tilt.onLeave}
                className="relative rounded-2xl overflow-hidden"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.55, delay: i * 0.1 }}
              >
                <div
                  className="relative"
                  style={{
                    background: `linear-gradient(145deg, ${color}10 0%, var(--surface) 35%)`,
                    backdropFilter: 'blur(24px)',
                    border: `1px solid ${color}30`,
                    boxShadow: `0 0 70px ${color}12, 0 30px 60px rgba(0,0,0,0.4)`,
                    borderRadius: 16,
                  }}
                >
                  <div className="absolute top-0 left-0 right-0 h-px"
                    style={{ background: `linear-gradient(90deg, transparent, ${color}90, transparent)` }} />
                  <div className="absolute top-0 right-0 w-64 h-64 pointer-events-none"
                    style={{ background: `radial-gradient(circle at 100% 0%, ${color}15 0%, transparent 65%)` }} />

                  <motion.div
                    className="absolute inset-0 pointer-events-none rounded-2xl"
                    style={{ background: `linear-gradient(105deg, transparent 40%, ${color}07 50%, transparent 60%)` }}
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 5, repeat: Infinity, ease: 'linear', repeatDelay: 3 }}
                  />

                  <div className="relative z-10 p-6 lg:p-9">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                      <div className="flex items-start gap-4">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{
                            background: `linear-gradient(135deg, ${color}30, ${color}10)`,
                            border: `1px solid ${color}45`,
                            boxShadow: `0 0 24px ${color}35`,
                          }}
                        >
                          <Briefcase size={20} style={{ color }} />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold" style={{ color: 'var(--text-1)', textShadow: `0 0 20px ${color}40` }}>
                            {exp.role}
                          </h3>
                          <div className="font-semibold text-sm mt-0.5" style={{ color }}>
                            {exp.company}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 flex-shrink-0 flex-wrap">
                        <span
                          className="px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider"
                          style={{ background: `${color}18`, color, border: `1px solid ${color}35` }}
                        >
                          {exp.type === 'full-time' ? 'Full-time' : 'Internship'}
                        </span>
                        <div
                          className="flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-xl"
                          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-3)' }}
                        >
                          <Calendar size={11} />
                          {exp.period}
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm leading-relaxed mb-6 sm:pl-16" style={{ color: 'var(--text-3)' }}>
                      {exp.description}
                    </p>

                    {/* Achievements */}
                    <div className="grid sm:grid-cols-2 gap-2.5 mb-6">
                      {exp.achievements.map((ach, j) => (
                        <AchievementChip key={j} text={ach} color={color} delay={j * 0.06} />
                      ))}
                    </div>

                    {/* Tech stack */}
                    <div className="flex flex-wrap gap-1.5">
                      {exp.tech.map((t) => (
                        <motion.span
                          key={t}
                          className="px-2.5 py-1 rounded-lg text-xs font-mono"
                          style={{
                            background: 'rgba(255,255,255,0.04)',
                            border: '1px solid rgba(255,255,255,0.09)',
                            color: 'var(--text-3)',
                          }}
                          whileHover={{ color: '#fff', borderColor: `${color}45`, background: `${color}12` }}
                          transition={{ duration: 0.15 }}
                        >
                          {t}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
