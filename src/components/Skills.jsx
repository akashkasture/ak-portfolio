import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { skills } from '../data/portfolio';
import SectionHeader from './SectionHeader';
import {
  JavaIcon, PostgresIcon, KafkaIcon, DockerIcon, MeshIcon, CandlestickIcon,
} from './TechIcons';

// Maps skills[].icon string → real tech logo component
const ICON_MAP = {
  Server:    JavaIcon,
  Database:  PostgresIcon,
  Radio:     KafkaIcon,
  Layers:    DockerIcon,
  Network:   MeshIcon,
  TrendingUp: CandlestickIcon,
};

function SkillBar({ name, level, color, delay }) {
  return (
    <motion.div
      className="group mb-4"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
    >
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-slate-300 text-sm font-medium group-hover:text-white transition-colors">
          {name}
        </span>
        <span
          className="text-xs font-mono font-bold tabular-nums"
          style={{ color, textShadow: `0 0 10px ${color}80` }}
        >
          {level}%
        </span>
      </div>
      <div className="relative h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ background: `linear-gradient(90deg, ${color}50, ${color}dd)` }}
          initial={{ width: 0 }}
          whileInView={{ width: `${level}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, delay: delay + 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            className="absolute right-0 top-1/2 w-3 h-3 rounded-full"
            style={{
              background: color,
              boxShadow: `0 0 10px ${color}, 0 0 20px ${color}80`,
              transform: 'translate(50%, -50%)',
            }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function Skills() {
  const [active, setActive] = useState(0);
  const current = skills[active];
  const Icon = ICON_MAP[current.icon] || Server;
  const avgLevel = Math.round(
    current.items.reduce((a, b) => a + b.level, 0) / current.items.length
  );

  return (
    <section id="skills" className="section-padding relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          label="Engineering Arsenal"
          title="Technical"
          highlight="Skills"
          description="A premium toolkit built through production engineering in fintech, distributed systems, and live trading."
        />

        {/* Category tab bar */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-none">
          {skills.map((skill, i) => {
            const SkillIcon = ICON_MAP[skill.icon] || Server;
            const isActive = active === i;
            return (
              <motion.button
                key={skill.category}
                onClick={() => setActive(i)}
                className="flex-shrink-0 flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold relative overflow-hidden"
                style={{
                  background: isActive ? `${skill.color}14` : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${isActive ? skill.color + '40' : 'rgba(255,255,255,0.07)'}`,
                  color: isActive ? '#fff' : '#64748b',
                  boxShadow: isActive ? `0 0 20px ${skill.color}18` : 'none',
                  transition: 'all 0.25s ease',
                }}
                whileHover={{ scale: isActive ? 1 : 1.03 }}
                whileTap={{ scale: 0.97 }}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                {isActive && (
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    style={{ background: `linear-gradient(90deg, transparent, ${skill.color}10, transparent)` }}
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
                  />
                )}
                <div
                  className="relative w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{
                    background: `${skill.color}18`,
                    boxShadow: isActive ? `0 0 8px ${skill.color}60` : 'none',
                  }}
                >
                  <SkillIcon size={12} color={skill.color} />
                </div>
                <span className="relative whitespace-nowrap">{skill.category}</span>
                {isActive && (
                  <div
                    className="relative w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: skill.color, boxShadow: `0 0 6px ${skill.color}` }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Detail panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            className="rounded-2xl relative overflow-hidden"
            style={{
              background: 'var(--surface)',
              backdropFilter: 'blur(32px)',
              border: `1px solid ${current.color}25`,
              boxShadow: `0 0 60px ${current.color}10, 0 40px 80px rgba(0,0,0,0.3)`,
              transition: 'background 0.4s ease',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Gradient top border */}
            <div
              className="absolute top-0 left-0 right-0 h-px"
              style={{
                background: `linear-gradient(90deg, transparent, ${current.color}70, ${current.color}90, ${current.color}70, transparent)`,
              }}
            />
            {/* Corner glow */}
            <div
              className="absolute top-0 right-0 w-64 h-64 pointer-events-none"
              style={{ background: `radial-gradient(circle at 100% 0%, ${current.color}12 0%, transparent 65%)` }}
            />
            <div
              className="absolute bottom-0 left-0 w-48 h-48 pointer-events-none"
              style={{ background: `radial-gradient(circle at 0% 100%, ${current.color}07 0%, transparent 65%)` }}
            />

            {/* Hover shimmer sweep */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{ background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.03) 50%, transparent 60%)' }}
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear', repeatDelay: 2 }}
            />

            <div className="relative z-10 p-7 lg:p-9">
              {/* Header */}
              <div className="flex items-start justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background: `${current.color}15`,
                      border: `1px solid ${current.color}35`,
                      boxShadow: `0 0 30px ${current.color}25`,
                    }}
                  >
                    <Icon size={30} color={current.color} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">{current.category}</h3>
                    <p className="text-slate-500 text-sm mt-0.5">{current.items.length} technologies tracked</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div
                    className="text-3xl font-bold tabular-nums"
                    style={{ color: current.color, textShadow: `0 0 25px ${current.color}80` }}
                  >
                    {avgLevel}%
                  </div>
                  <div className="text-slate-600 text-xs mt-0.5">avg proficiency</div>
                </div>
              </div>

              {/* Skill bars — 2-column on large screens */}
              <div className="grid md:grid-cols-2 gap-x-12">
                {current.items.map((item, i) => (
                  <SkillBar
                    key={item.name}
                    name={item.name}
                    level={item.level}
                    color={current.color}
                    delay={i * 0.06}
                  />
                ))}
              </div>

              {/* Footer stats */}
              <div
                className="mt-8 pt-6 grid grid-cols-3 gap-4"
                style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
              >
                {[
                  { label: 'In Production', value: 'Live' },
                  { label: 'Technologies', value: current.items.length },
                  { label: 'Years Used', value: '2+' },
                ].map((s) => (
                  <div key={s.label} className="text-center group cursor-default">
                    <motion.div
                      className="text-xl font-bold"
                      style={{ color: current.color, textShadow: `0 0 15px ${current.color}60` }}
                      whileHover={{ scale: 1.1 }}
                    >
                      {s.value}
                    </motion.div>
                    <div className="text-slate-600 text-xs mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
