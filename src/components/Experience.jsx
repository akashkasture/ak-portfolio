import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Calendar, TrendingUp, Zap, DollarSign, Activity, CheckCircle2 } from 'lucide-react';
import { experience } from '../data/portfolio';
import SectionHeader from './SectionHeader';

// Impact metrics shown at the top
const METRICS = [
  { value: '15K+',   unit: 'msgs / day',  label: 'Kafka throughput',      color: '#7c3aed', icon: Zap },
  { value: '$50M+',  unit: '/ month',     label: 'Transaction volume',    color: '#10b981', icon: DollarSign },
  { value: '99.95%', unit: 'SLA',         label: 'System uptime',         color: '#06b6d4', icon: Activity },
  { value: '40%',    unit: 'efficiency ↑',label: 'Process improvement',   color: '#f59e0b', icon: TrendingUp },
];

const ROLE_COLORS = ['#7c3aed', '#f59e0b'];

// 3D tilt card hook
function useTilt() {
  const ref = useRef(null);
  const [style, setStyle] = useState({});

  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width  - 0.5) * 16;
    const y = ((e.clientY - r.top)  / r.height - 0.5) * -16;
    setStyle({ transform: `perspective(900px) rotateY(${x}deg) rotateX(${y}deg) scale3d(1.02,1.02,1.02)` });
  };
  const onLeave = () => setStyle({ transform: 'perspective(900px) rotateY(0deg) rotateX(0deg) scale3d(1,1,1)' });

  return { ref, style, onMove, onLeave };
}

function MetricCard({ metric, delay }) {
  const Icon = metric.icon;
  return (
    <motion.div
      className="relative rounded-2xl p-5 overflow-hidden group cursor-default"
      style={{
        background: 'var(--surface)',
        border: `1px solid ${metric.color}25`,
        boxShadow: `0 0 40px ${metric.color}10`,
      }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -4, boxShadow: `0 0 50px ${metric.color}25` }}
    >
      {/* Glow corner */}
      <div
        className="absolute top-0 right-0 w-32 h-32 pointer-events-none"
        style={{ background: `radial-gradient(circle at 100% 0%, ${metric.color}18 0%, transparent 65%)` }}
      />
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${metric.color}60, transparent)` }}
      />

      {/* Sweep shimmer */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ background: `linear-gradient(105deg, transparent 40%, ${metric.color}08 50%, transparent 60%)` }}
        animate={{ x: ['-100%', '200%'] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'linear', repeatDelay: 2 }}
      />

      <div className="relative z-10">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
          style={{ background: `${metric.color}15`, border: `1px solid ${metric.color}30` }}
        >
          <Icon size={18} style={{ color: metric.color }} />
        </div>
        <div className="flex items-end gap-1.5 mb-0.5">
          <span
            className="text-3xl font-bold tabular-nums leading-none"
            style={{ color: metric.color, textShadow: `0 0 20px ${metric.color}70` }}
          >
            {metric.value}
          </span>
          <span className="text-slate-500 text-xs font-mono pb-1">{metric.unit}</span>
        </div>
        <div className="text-slate-500 text-xs">{metric.label}</div>
      </div>
    </motion.div>
  );
}

function AchievementChip({ text, color, delay }) {
  return (
    <motion.div
      className="flex items-start gap-2.5 p-3.5 rounded-xl relative overflow-hidden group"
      style={{
        background: `${color}08`,
        border: `1px solid ${color}20`,
      }}
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ borderColor: `${color}45`, background: `${color}12` }}
    >
      <CheckCircle2 size={14} className="flex-shrink-0 mt-0.5" style={{ color }} />
      <span className="text-slate-300 text-sm leading-relaxed">{text}</span>
    </motion.div>
  );
}

export default function Experience() {
  return (
    <section id="experience" className="section-padding">
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
                {/* Card shell */}
                <div
                  className="relative"
                  style={{
                    background: 'var(--surface)',
                    backdropFilter: 'blur(24px)',
                    border: `1px solid ${color}25`,
                    boxShadow: `0 0 60px ${color}10, 0 30px 60px rgba(0,0,0,0.5)`,
                    borderRadius: 16,
                  }}
                >
                  {/* Top gradient line */}
                  <div
                    className="absolute top-0 left-0 right-0 h-px"
                    style={{ background: `linear-gradient(90deg, transparent, ${color}80, transparent)` }}
                  />
                  {/* Corner glow */}
                  <div
                    className="absolute top-0 right-0 w-48 h-48 pointer-events-none"
                    style={{ background: `radial-gradient(circle at 100% 0%, ${color}12 0%, transparent 65%)` }}
                  />

                  {/* Sweep animation */}
                  <motion.div
                    className="absolute inset-0 pointer-events-none rounded-2xl"
                    style={{ background: `linear-gradient(105deg, transparent 40%, ${color}06 50%, transparent 60%)` }}
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 5, repeat: Infinity, ease: 'linear', repeatDelay: 3 }}
                  />

                  <div className="relative z-10 p-7 lg:p-9">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                      <div className="flex items-start gap-4">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{
                            background: `${color}15`,
                            border: `1px solid ${color}30`,
                            boxShadow: `0 0 20px ${color}20`,
                          }}
                        >
                          <Briefcase size={20} style={{ color }} />
                        </div>
                        <div>
                          <h3
                            className="text-xl font-bold"
                            style={{ color: '#fff', textShadow: `0 0 20px ${color}40` }}
                          >
                            {exp.role}
                          </h3>
                          <div className="text-slate-400 font-semibold text-sm mt-0.5">
                            {exp.company}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 flex-shrink-0">
                        <span
                          className="px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider"
                          style={{
                            background: `${color}15`,
                            color,
                            border: `1px solid ${color}30`,
                          }}
                        >
                          {exp.type === 'full-time' ? 'Full-time' : 'Internship'}
                        </span>
                        <div
                          className="flex items-center gap-1.5 text-slate-500 text-xs font-mono px-3 py-1.5 rounded-xl"
                          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                        >
                          <Calendar size={11} />
                          {exp.period}
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-slate-400 text-sm leading-relaxed mb-6 pl-16">
                      {exp.description}
                    </p>

                    {/* Achievement chips — animated grid */}
                    <div className="grid sm:grid-cols-2 gap-2.5 mb-6 pl-0">
                      {exp.achievements.map((ach, j) => (
                        <AchievementChip
                          key={j}
                          text={ach}
                          color={color}
                          delay={j * 0.06}
                        />
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
                            color: '#94a3b8',
                          }}
                          whileHover={{ color: '#fff', borderColor: `${color}40`, background: `${color}10` }}
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
