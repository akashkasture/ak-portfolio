import { motion } from 'framer-motion';
import {
  MapPin, Compass, Clock, CheckCircle2, Activity, TrendingUp,
  BarChart2, Terminal, ArrowUp, ArrowDown,
  Award, Coffee, GitBranch, Code2,
} from 'lucide-react';
import { personalInfo, techBadges } from '../data/portfolio';
import SectionHeader from './SectionHeader';

const HOBBY_ICON_MAP = { TrendingUp, BarChart2, Activity, Terminal };

const stats = [
  { value: '2+',    label: 'Years Experience',   icon: Clock,        color: '#6366f1' },
  { value: '10+',   label: 'Projects Delivered',  icon: CheckCircle2, color: '#06b6d4' },
  { value: '99.95%',label: 'Uptime Achieved',     icon: Activity,     color: '#10b981' },
  { value: '$50M+', label: 'Txn Volume/Month',    icon: Award,        color: '#f59e0b' },
];

const TICKERS = [
  { symbol: 'NIFTY 50', value: '22,450.50', change: '+1.2%', up: true },
  { symbol: 'BANKNIFTY', value: '48,120.75', change: '+0.8%', up: true },
  { symbol: 'SENSEX', value: '74,119.60', change: '+1.1%', up: true },
  { symbol: 'RELIANCE', value: '2,890.30', change: '-0.4%', up: false },
  { symbol: 'HDFC BANK', value: '1,542.15', change: '+0.6%', up: true },
  { symbol: 'TCS', value: '3,654.80', change: '+0.9%', up: true },
  { symbol: 'INFY', value: '1,432.50', change: '-0.2%', up: false },
  { symbol: 'WIPRO', value: '465.20', change: '+0.3%', up: true },
];

function StockTicker() {
  const doubled = [...TICKERS, ...TICKERS];
  return (
    <div className="relative overflow-hidden rounded-xl border border-white/8 py-2.5" style={{ background: 'var(--surface)' }}>
      <div className="absolute left-0 top-0 bottom-0 w-12 z-10 pointer-events-none" style={{ background: 'linear-gradient(to right, var(--surface), transparent)' }} />
      <div className="absolute right-0 top-0 bottom-0 w-12 z-10 pointer-events-none" style={{ background: 'linear-gradient(to left, var(--surface), transparent)' }} />
      <div className="flex gap-0 animate-ticker">
        {doubled.map((t, i) => (
          <div key={i} className="flex items-center gap-2 px-5 shrink-0">
            <span className="text-xs font-mono font-semibold text-slate-300">{t.symbol}</span>
            <span className="text-xs font-mono text-white">{t.value}</span>
            <span
              className={`flex items-center gap-0.5 text-[10px] font-mono font-semibold ${
                t.up ? 'text-emerald-400' : 'text-red-400'
              }`}
            >
              {t.up ? <ArrowUp size={9} /> : <ArrowDown size={9} />}
              {t.change}
            </span>
            <span className="text-slate-700 ml-2">·</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function About() {
  return (
    <div className="relative @container p-6 sm:p-8">
      <div>
        <SectionHeader
          label="About Me"
          title="Crafting Systems"
          highlight="at Scale"
          description="Passionate about building distributed systems that handle real-world complexity with elegance and performance."
        />

        <div className="grid @lg:grid-cols-2 gap-8 items-center mb-16">
          {/* Profile card */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="relative w-full max-w-sm sm:max-w-md mx-auto aspect-square">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-indigo-600/25 to-cyan-600/15 blur-3xl" />
              <div className="relative h-full rounded-3xl glass border border-white/10 overflow-hidden flex items-center justify-center">
                <div className="text-center p-8 w-full">
                  {/* Avatar */}
                  <div
                    className="w-20 h-20 sm:w-28 sm:h-28 mx-auto mb-4 sm:mb-6 rounded-full flex items-center justify-center text-white text-3xl sm:text-4xl font-bold glow-pulse"
                    style={{
                      background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
                      boxShadow: '0 0 40px rgba(99,102,241,0.5), 0 0 80px rgba(99,102,241,0.2)',
                    }}
                  >
                    AK
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">{personalInfo.name}</h3>
                  <p className="text-indigo-400 font-medium text-sm sm:text-base mb-3 sm:mb-4">{personalInfo.title}</p>
                  <div className="flex items-center justify-center gap-1.5 text-slate-400 text-xs sm:text-sm">
                    <MapPin size={13} />
                    {personalInfo.location}
                  </div>

                  <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-white/10 grid grid-cols-2 gap-3 sm:gap-4">
                    <div className="text-center">
                      <div className="text-xl sm:text-2xl font-bold text-white">2+</div>
                      <div className="text-xs text-slate-500">Years</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl sm:text-2xl font-bold text-white">10+</div>
                      <div className="text-xs text-slate-500">Projects</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating badges */}
              <motion.div
                className="absolute -top-4 -right-4 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl glass border border-white/10 flex flex-col items-center justify-center shadow-lg"
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Coffee size={20} className="text-amber-400 mb-1" />
                <span className="text-[10px] text-slate-500">Coffee++</span>
              </motion.div>
              <motion.div
                className="absolute -bottom-4 -left-4 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl glass border border-white/10 flex flex-col items-center justify-center shadow-lg"
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 5, delay: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <GitBranch size={20} className="text-indigo-400 mb-1" />
                <span className="text-[10px] text-slate-500">Shipping</span>
              </motion.div>
            </div>
          </motion.div>

          {/* Bio text + hobbies */}
          <motion.div
            className="w-full min-w-0"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-5" style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
              I'm a{' '}
              <span className="text-white font-semibold">Software Engineer</span> at{' '}
              <span className="text-indigo-400 font-semibold">Newgen Software Technology</span> with a
              deep focus on{' '}
              <span className="text-indigo-400">distributed systems, microservices architecture</span>,
              and high-throughput backend engineering.
            </p>
            <p className="text-slate-400 leading-relaxed mb-5" style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
              My expertise spans the full backend stack — from designing{' '}
              <span className="text-cyan-400">event-driven pipelines</span> with Kafka &amp; IBM MQ to
              optimizing Oracle SQL and architecting resilient, cloud-native systems on AWS.
            </p>
            <p className="text-slate-400 leading-relaxed mb-7" style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
              I believe great engineering is about solving real problems elegantly. I love working on
              systems that need to be{' '}
              <span className="text-white font-medium">fast, reliable, and infinitely scalable</span>.
            </p>

            {/* Currently Learning */}
            <div className="mb-6">
              <h4 className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Compass size={13} />
                Currently Exploring
              </h4>
              <div className="flex flex-wrap gap-2">
                {personalInfo.currentlyLearning.map((item) => (
                  <span
                    key={item}
                    className="px-3 py-1 rounded-full text-xs border border-cyan-500/20 bg-cyan-500/8 text-cyan-400"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Fun Facts */}
            <div className="mb-6">
              <h4 className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-3">
                Fun Facts
              </h4>
              <div className="space-y-2">
                {personalInfo.funFacts.map((fact, i) => (
                  <motion.div
                    key={i}
                    className="flex items-start gap-2 text-slate-400 text-sm"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <span className="text-indigo-500 mt-0.5 shrink-0">→</span>
                    {fact}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Hobbies — with animated trading section */}
            <div>
              <h4 className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                <TrendingUp size={13} />
                Hobbies &amp; Interests
              </h4>
              <div className="grid grid-cols-2 gap-2 mb-3">
                {personalInfo.hobbies.map((hobby, i) => {
                  const HobbyIcon = HOBBY_ICON_MAP[hobby.icon] || Activity;
                  return (
                    <motion.div
                      key={i}
                      className="flex items-center gap-2.5 p-3 rounded-xl border border-white/8 bg-white/2 hover:bg-white/4 transition-all group cursor-default"
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08 }}
                      whileHover={{ scale: 1.03, borderColor: `${hobby.color}40` }}
                      style={{ '--hover-color': hobby.color }}
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                        style={{
                          background: `${hobby.color}15`,
                          border: `1px solid ${hobby.color}35`,
                        }}
                      >
                        <HobbyIcon size={15} style={{ color: hobby.color }} />
                      </div>
                      <div>
                        <div className="text-white text-xs font-semibold leading-tight">{hobby.label}</div>
                        <div className="text-slate-600 text-[10px] mt-0.5">{hobby.desc}</div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Live-style stock ticker */}
              <StockTicker />
            </div>
          </motion.div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 @md:grid-cols-4 gap-4 mb-20">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                className="glass rounded-2xl p-6 text-center card-hover border border-white/5 relative overflow-hidden group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `radial-gradient(circle at 50% 50%, ${stat.color}08 0%, transparent 70%)`,
                  }}
                />
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3"
                  style={{ background: `${stat.color}15`, border: `1px solid ${stat.color}30` }}
                >
                  <Icon size={18} style={{ color: stat.color }} />
                </div>
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-slate-500 text-sm">{stat.label}</div>
              </motion.div>
            );
          })}
        </div>

        {/* Tech Radar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-center text-xs font-mono text-slate-500 uppercase tracking-widest mb-6">
            Technology Radar
          </h3>
          <div className="flex flex-wrap justify-center gap-2">
            {techBadges.map((badge, i) => (
              <motion.span
                key={badge}
                className="px-3 py-1.5 rounded-lg text-sm border border-white/8 bg-white/3 text-slate-300 hover:border-indigo-500/40 hover:bg-indigo-500/10 hover:text-white transition-all duration-200 cursor-default"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.03 }}
                whileHover={{ scale: 1.07 }}
              >
                {badge}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
