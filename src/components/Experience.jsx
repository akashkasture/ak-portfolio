import { useRef, useState } from 'react'; // useRef/useState still used by useTilt
import { motion } from 'framer-motion';
import {
  Briefcase, Calendar, TrendingUp, DollarSign, Activity,
  CheckCircle2, MessageSquare,
} from 'lucide-react';
import { experience } from '../data/portfolio';
import SectionHeader from './SectionHeader';
import Figures from './Figures';
import { T } from '../os/motion';

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

function MetricCard({ metric }) {
  const Icon = metric.icon;
  return (
    <motion.div
      className="rounded-xl p-5 flex flex-col gap-3"
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--surface-border)',
        borderLeft: `3px solid ${metric.color}`,
      }}
      whileHover={{ y: -2 }}
    >
      <div className="flex items-center gap-2">
        <Icon size={13} style={{ color: metric.color }} />
        <span className="text-[10px] font-mono uppercase tracking-widest" style={{ color: 'var(--text-4)' }}>
          {metric.label}
        </span>
      </div>
      <div className="text-3xl font-bold tabular-nums leading-none" style={{ color: metric.color }}>
        {metric.value}
      </div>
      <div>
        <div className="text-[10px] font-mono uppercase tracking-wider mb-0.5" style={{ color: 'var(--text-4)' }}>
          {metric.unit}
        </div>
        <div className="text-xs leading-relaxed" style={{ color: 'var(--text-3)' }}>{metric.desc}</div>
      </div>
    </motion.div>
  );
}


function AchievementChip({ text, color }) {
  return (
    <motion.div
      className="flex items-start gap-2.5 p-3.5 rounded-xl relative overflow-hidden group"
      style={{
        background: `${color}08`,
        border: `1px solid ${color}22`,
      }}
      whileHover={{ borderColor: `${color}50`, background: `${color}14` }}
    >
      <CheckCircle2 size={14} className="flex-shrink-0 mt-0.5" style={{ color }} />
      <span className="text-sm leading-relaxed" style={{ color: 'var(--text-2)' }}>
        <Figures text={text} />
      </span>
    </motion.div>
  );
}

// Its own component (rather than inlined in the parent's .map()) so useTilt()
// is called once per card at a stable top level, not conditionally inside a
// loop — calling a hook inside .map() only happened to work while the array
// length stayed constant.
function ExperienceCard({ exp, color }) {
  const cardRef = useRef(null);
  const [tiltStyle, setTiltStyle] = useState({});

  const onMove = (e) => {
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width  - 0.5) * 12;
    const y = ((e.clientY - r.top)  / r.height - 0.5) * -12;
    setTiltStyle({ transform: `perspective(900px) rotateY(${x}deg) rotateX(${y}deg) scale3d(1.015,1.015,1.015)` });
  };
  const onLeave = () => setTiltStyle({ transform: 'perspective(900px) rotateY(0deg) rotateX(0deg) scale3d(1,1,1)' });

  return (
    <motion.div
      ref={cardRef}
      style={{ ...tiltStyle, transition: 'transform 0.25s ease' }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="relative rounded-2xl overflow-hidden"
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
              <AchievementChip key={j} text={ach} color={color} />
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
                transition={T.fast}
              >
                {t}
              </motion.span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Experience() {
  return (
    <div className="@container p-6 sm:p-8">
      <div>
        <SectionHeader
          label="Experience"
          title="Professional"
          highlight="Impact"
          description="Shipping production systems that handle real money, real users, and real scale."
        />

        {/* Impact Metrics */}
        <div className="grid grid-cols-2 @lg:grid-cols-4 gap-4 mb-16">
          {METRICS.map((m) => (
            <MetricCard key={m.label} metric={m} />
          ))}
        </div>

        {/* Experience cards */}
        <div className="space-y-8">
          {experience.map((exp, i) => (
            <ExperienceCard key={exp.id} exp={exp} color={ROLE_COLORS[i] || '#7c3aed'} />
          ))}
        </div>
      </div>
    </div>
  );
}
