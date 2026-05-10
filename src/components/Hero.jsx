import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Download, ChevronDown, ArrowUp, ArrowDown } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './SocialIcons';
import { personalInfo } from '../data/portfolio';
import { useTheme } from '../context/ThemeContext';
import ParticleNetwork from './ParticleNetwork';
import HoloGlobe from './HoloGlobe';
import DataPackets from './DataPackets';
import MagneticButton from './MagneticButton';

const TITLES = [
  'Backend Engineer',
  'Fintech Specialist',
  'System Architect',
  'Kafka Specialist',
  'Distributed Systems',
];

const TICKERS = [
  { symbol: 'NIFTY 50', value: '22,450.50', change: '+1.2%', up: true },
  { symbol: 'BANK NIFTY', value: '48,120.75', change: '+0.8%', up: true },
  { symbol: 'SENSEX', value: '74,119.60', change: '+1.1%', up: true },
  { symbol: 'NASDAQ', value: '17,855.20', change: '-0.3%', up: false },
  { symbol: 'S&P 500', value: '5,247.60', change: '+0.5%', up: true },
  { symbol: 'MIDCAP 150', value: '11,432.80', change: '+0.7%', up: true },
  { symbol: 'IT INDEX', value: '36,780.40', change: '-0.4%', up: false },
  { symbol: 'FINNIFTY', value: '21,945.30', change: '+0.9%', up: true },
];

const CODE_SNIPPETS = [
  { lines: ['@KafkaListener', 'topic = "txn.events"', 'void process(TxnEvent e)'], color: '#6366f1', top: '12%', right: '3%' },
  { lines: ['SELECT /*+ INDEX */', 'FROM trade_ledger', 'WHERE status = :1'], color: '#06b6d4', bottom: '20%', right: '5%' },
  { lines: ['new KafkaTemplate()', '.send("orders", key,', '  payload);'], color: '#8b5cf6', top: '35%', left: '1%' },
];

const CANDLES = [
  [65, 85, 90, 60, true], [82, 70, 88, 65, false], [68, 90, 95, 65, true],
  [88, 78, 92, 74, false], [76, 94, 98, 72, true], [91, 82, 96, 78, false],
  [80, 98, 102, 76, true], [95, 86, 100, 82, false], [84, 102, 108, 80, true],
  [99, 91, 104, 87, false], [89, 108, 112, 85, true], [105, 95, 110, 91, false],
  [93, 112, 116, 89, true], [109, 100, 114, 96, false], [98, 116, 120, 94, true],
  [113, 105, 118, 101, false], [103, 118, 122, 99, true], [115, 108, 120, 104, false],
];

function CandlestickBg({ startIdx = 0, step = 1, showLine = false, opacity = 0.22 }) {
  const ISO = 7;
  const subset = CANDLES.map((c, i) => ({ c, i })).filter(({ i }) => i % step === startIdx % step);
  return (
    <svg
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 720 260"
      preserveAspectRatio="xMidYMid slice"
      style={{ opacity }}
    >
      {subset.map(({ c: [open, close, high, low, up], i }) => {
        const x = 14 + i * 40;
        const fw = 13;
        const bodyTop = 260 - Math.max(open, close) * 1.7;
        const bodyH = Math.max(Math.abs(close - open) * 1.7, 4);
        const wickTop = 260 - high * 1.7;
        const wickBot = 260 - low * 1.7;
        const frontC = up ? '#10b981' : '#ef4444';
        const topC   = up ? '#34d399' : '#f87171';
        const sideC  = up ? '#059669' : '#dc2626';
        const topPoly = [`${x},${bodyTop}`, `${x+fw},${bodyTop}`, `${x+fw+ISO},${bodyTop-ISO}`, `${x+ISO},${bodyTop-ISO}`].join(' ');
        const sidePoly = [`${x+fw},${bodyTop}`, `${x+fw+ISO},${bodyTop-ISO}`, `${x+fw+ISO},${bodyTop+bodyH-ISO}`, `${x+fw},${bodyTop+bodyH}`].join(' ');
        return (
          <g key={i}>
            <line x1={x+fw/2} y1={wickTop} x2={x+fw/2} y2={bodyTop} stroke={frontC} strokeWidth="1.5" opacity="0.6" />
            <line x1={x+fw/2} y1={bodyTop+bodyH} x2={x+fw/2} y2={wickBot} stroke={frontC} strokeWidth="1.5" opacity="0.6" />
            <rect x={x} y={bodyTop} width={fw} height={bodyH} fill={frontC} rx="1.5" />
            <polygon points={topPoly} fill={topC} opacity="0.85" />
            <polygon points={sidePoly} fill={sideC} opacity="0.75" />
          </g>
        );
      })}
      {showLine && (
        <polyline
          points={CANDLES.map(([o, c,,, ], i) => `${14 + i * 40 + 6},${260 - ((o + c) / 2) * 1.7}`).join(' ')}
          fill="none" stroke="#7c3aed" strokeWidth="2" strokeDasharray="5 3" opacity="0.7"
        />
      )}
    </svg>
  );
}

function TickerTape() {
  const doubled = [...TICKERS, ...TICKERS];
  return (
    <div className="relative w-full overflow-hidden" style={{ background: 'var(--nav-bg)', borderBottom: '1px solid var(--nav-border)' }}>
      {/* Gradient fade masks — theme-aware */}
      <div className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to right, var(--bg) 10%, transparent 100%)' }} />
      <div className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to left, var(--bg) 10%, transparent 100%)' }} />
      <div className="flex animate-ticker">
        {doubled.map((t, i) => (
          <div
            key={i}
            className="flex items-center gap-2 px-5 py-2.5 shrink-0"
            style={{ borderRight: '1px solid var(--surface-border)' }}
          >
            <span className="text-xs font-mono font-semibold tracking-wider" style={{ color: 'var(--text-3)' }}>{t.symbol}</span>
            <span className="text-xs font-mono font-bold" style={{ color: 'var(--text-1)' }}>{t.value}</span>
            <span className={`flex items-center gap-0.5 text-[10px] font-mono font-bold ${t.up ? 'text-emerald-500' : 'text-red-400'}`}>
              {t.up ? <ArrowUp size={9} /> : <ArrowDown size={9} />}
              {t.change}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TypewriterText({ texts }) {
  const [index, setIndex] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = texts[index];
    let timeout;
    if (!deleting && displayed.length < current.length) {
      timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 75);
    } else if (!deleting && displayed.length === current.length) {
      timeout = setTimeout(() => setDeleting(true), 2200);
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 38);
    } else if (deleting && displayed.length === 0) {
      setDeleting(false);
      setIndex((p) => (p + 1) % texts.length);
    }
    return () => clearTimeout(timeout);
  }, [displayed, deleting, index, texts]);

  return (
    <span>
      <span
        style={{
          background: 'linear-gradient(135deg, #7c3aed, #06b6d4, #a855f7)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        {displayed}
      </span>
      <span className="terminal-cursor" />
    </span>
  );
}

const statCards = [
  { label: 'Experience', value: '2+', sub: 'Years', color: '#7c3aed' },
  { label: 'Projects', value: '10+', sub: 'Built', color: '#10b981' },
  { label: 'Uptime', value: '99.95%', sub: 'Achieved', color: '#06b6d4' },
  { label: 'Txn Volume', value: '$50M+', sub: 'Per Month', color: '#f59e0b' },
];

export default function Hero() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const heroRef = useRef(null);
  const [isNarrow, setIsNarrow] = useState(window.innerWidth < 768);

  useEffect(() => {
    const check = () => setIsNarrow(window.innerWidth < 768);
    window.addEventListener('resize', check, { passive: true });
    return () => window.removeEventListener('resize', check);
  }, []);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  // Three depth layers for 3D parallax — Y + X drift for chart-scrolling effect
  const candleY1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const candleY2 = useTransform(scrollYProgress, [0, 1], [0, -55]);
  const candleY3 = useTransform(scrollYProgress, [0, 1], [0, -140]);
  const candleX1 = useTransform(scrollYProgress, [0, 1], [0, -90]);   // back drifts left
  const candleX2 = useTransform(scrollYProgress, [0, 1], [0, 45]);    // mid drifts right
  const candleX3 = useTransform(scrollYProgress, [0, 1], [0, -140]);  // front drifts most left
  const glowY    = useTransform(scrollYProgress, [0, 1], [0, -60]);

  return (
    <section ref={heroRef} id="hero" className="relative min-h-screen flex flex-col" style={{ overflowX: 'clip' }}>
      {/* Particle network — full background layer */}
      <div className="absolute inset-0 pointer-events-none" style={{ opacity: isDark ? 0.6 : 0.25 }}>
        <ParticleNetwork opacity={1} />
      </div>

      {/* Ticker at very top */}
      <div className="pt-16">
        <TickerTape />
      </div>

      {/* Holographic globe — middle-left, behind content */}
      <div
        className="absolute left-0 z-[3] pointer-events-none"
        style={{
          top: '50%',
          transform: 'translateY(-50%)',
          opacity: isDark ? 0.82 : 0.45,
        }}
      >
        {/* Ambient glow halo — bleeds behind the globe */}
        <div
          className="absolute pointer-events-none"
          style={{
            inset: '-40%',
            background: 'radial-gradient(circle, rgba(99,102,241,0.28) 0%, rgba(6,182,212,0.12) 45%, transparent 70%)',
            filter: 'blur(28px)',
          }}
        />
        {/* Mobile: 180px, sm+: 240px, lg+: 300px */}
        <div className="sm:hidden">
          <HoloGlobe size={180} />
        </div>
        <div className="hidden sm:block lg:hidden">
          <HoloGlobe size={240} />
        </div>
        <div className="hidden lg:block">
          <HoloGlobe size={300} />
        </div>
      </div>

      {/* Floating data packet labels */}
      <DataPackets />

      {/* Candlestick chart background — scroll-parallax layers */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Layer 1: back candles — slowest, drifts left */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-64"
          style={{ y: candleY2, x: isNarrow ? 0 : candleX1, opacity: 0.5 }}
        >
          <CandlestickBg startIdx={0} step={3} opacity={isNarrow ? 0.48 : 0.22} />
        </motion.div>
        {/* Layer 2: mid candles — medium, drifts right */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-64"
          style={{ y: candleY1, x: isNarrow ? 0 : candleX2, opacity: 0.75 }}
        >
          <CandlestickBg startIdx={1} step={3} opacity={isNarrow ? 0.48 : 0.22} />
        </motion.div>
        {/* Layer 3: front candles — fastest, drifts most left */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-64"
          style={{ y: candleY3, x: isNarrow ? 0 : candleX3, opacity: 1 }}
        >
          <CandlestickBg startIdx={2} step={3} showLine opacity={isNarrow ? 0.5 : 0.22} />
        </motion.div>

        {/* Mobile-only pulsing glow orbs in the candlestick zone */}
        {isDark && (
          <div className="absolute inset-0 md:hidden pointer-events-none">
            <motion.div
              className="absolute top-1/3 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.22) 0%, transparent 65%)' }}
              animate={{ scale: [1, 1.22, 1], opacity: [0.45, 1, 0.45] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="absolute bottom-1/3 right-1/4 w-52 h-52 rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.18) 0%, transparent 65%)' }}
              animate={{ scale: [1, 1.16, 1], opacity: [0.35, 0.85, 0.35] }}
              transition={{ duration: 5, delay: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="absolute top-1/4 left-1/4 w-40 h-40 rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.18) 0%, transparent 65%)' }}
              animate={{ scale: [1, 1.12, 1], opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 6, delay: 3, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
        )}

        {/* Radial glows — hidden in light mode */}
        {isDark && (
          <motion.div className="absolute inset-0" style={{ y: glowY }}>
            <div
              className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.16) 0%, transparent 65%)' }}
            />
            <div
              className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.09) 0%, transparent 65%)' }}
            />
            <div
              className="absolute top-1/3 left-1/4 w-72 h-72 rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 65%)' }}
            />
          </motion.div>
        )}
      </div>

      {/* Floating code snippets */}
      {CODE_SNIPPETS.map((snip, i) => (
        <motion.div
          key={i}
          className="absolute hidden sm:block z-20 pointer-events-none"
          style={{ top: snip.top, bottom: snip.bottom, left: snip.left, right: snip.right }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 + i * 0.3, duration: 0.7 }}
        >
          <motion.div
            className="rounded-xl border px-3.5 py-3 font-mono text-[10px] leading-relaxed"
            style={{
              background: isDark ? 'rgba(13,18,36,0.75)' : 'rgba(255,255,255,0.88)',
              backdropFilter: 'blur(12px)',
              borderColor: `${snip.color}35`,
              boxShadow: `0 4px 24px ${snip.color}15`,
            }}
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5 + i * 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            {snip.lines.map((line, j) => (
              <div key={j} style={{ color: j === 0 ? snip.color : isDark ? '#94a3b8' : '#475569' }}>{line}</div>
            ))}
          </motion.div>
        </motion.div>
      ))}

      {/* Main content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-16">
        <div className="text-center max-w-5xl mx-auto">
          {/* Available badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono tracking-widest uppercase mb-8"
            style={{ border: '1px solid rgba(124,58,237,0.3)', background: isDark ? 'rgba(124,58,237,0.1)' : 'rgba(124,58,237,0.07)', color: isDark ? '#c4b5fd' : '#6d28d9' }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
            Available for opportunities
          </motion.div>

          {/* Name */}
          <motion.h1
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-tight tracking-tight mb-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            Hi, I'm{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #7c3aed 0%, #06b6d4 50%, #a855f7 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 0 30px rgba(99,102,241,0.4))',
              }}
            >
              Akash
            </span>
          </motion.h1>

          {/* Tagline */}
          <motion.p
            className="text-slate-400 text-sm font-mono tracking-widest uppercase mb-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            Software Engineer&nbsp;|&nbsp;Trader&nbsp;|&nbsp;FinTech Enthusiast
          </motion.p>

          {/* Typewriter role */}
          <motion.div
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6 min-h-[1.4em]"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <TypewriterText texts={TITLES} />
          </motion.div>

          {/* Description */}
          <motion.p
            className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            {personalInfo.description}
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <MagneticButton>
              <a
                href="#projects"
                className="group flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-white transition-all duration-300"
                style={{
                  background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
                  boxShadow: '0 0 30px rgba(124,58,237,0.5)',
                }}
              >
                View Projects
                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </a>
            </MagneticButton>
            <MagneticButton>
              <a
                href="#contact"
                className="group flex items-center gap-2 px-7 py-3.5 rounded-xl border border-white/10 text-white font-semibold bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
              >
                Contact Me
              </a>
            </MagneticButton>
            <MagneticButton strength={0.2}>
              <a
                href={personalInfo.resumeUrl}
                className="flex items-center gap-2 px-7 py-3.5 rounded-xl text-slate-400 font-semibold hover:text-white transition-all duration-300"
              >
                <Download size={15} />
                Resume
              </a>
            </MagneticButton>
          </motion.div>

          {/* Social links */}
          <motion.div
            className="flex items-center justify-center gap-4 mb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.55 }}
          >
            <a
              href={personalInfo.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl border border-white/10 text-slate-400 hover:text-white hover:border-indigo-500/50 hover:bg-indigo-500/10 transition-all duration-200"
            >
              <GithubIcon size={18} />
            </a>
            <a
              href={personalInfo.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl border border-white/10 text-slate-400 hover:text-white hover:border-indigo-500/50 hover:bg-indigo-500/10 transition-all duration-200"
            >
              <LinkedinIcon size={18} />
            </a>
            <div className="w-12 h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent" />
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Open to work
            </div>
          </motion.div>

          {/* Stat cards */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.65 }}
          >
            {statCards.map((card, i) => (
              <motion.div
                key={card.label}
                className="relative rounded-xl border p-4 text-center overflow-hidden group"
                style={{
                  background: 'var(--surface)',
                  backdropFilter: 'blur(20px)',
                  borderColor: `${card.color}30`,
                  boxShadow: `0 0 18px ${card.color}12`,
                }}
                whileHover={{
                  borderColor: `${card.color}50`,
                  boxShadow: `0 0 30px ${card.color}20`,
                  y: -3,
                }}
                transition={{ duration: 0.2 }}
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `radial-gradient(circle at 50% 100%, ${card.color}10 0%, transparent 70%)` }}
                />
                <div
                  className="text-2xl font-bold mb-0.5"
                  style={{ color: card.color, filter: `drop-shadow(0 0 8px ${card.color}60)` }}
                >
                  {card.value}
                </div>
                <div className="text-slate-300 text-xs font-medium">{card.label}</div>
                <div className="text-slate-600 text-[10px] mt-0.5">{card.sub}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.a
        href="#about"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 p-3 rounded-full border border-white/10 text-slate-500 hover:text-white hover:border-white/20 transition-colors z-20"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
      >
        <ChevronDown size={18} />
      </motion.a>
    </section>
  );
}
