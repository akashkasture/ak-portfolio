import { useEffect, useRef, useState } from 'react';
import { motion, useInView, animate } from 'framer-motion';
import {
  TrendingUp, Activity, BarChart2, Shield, Zap, Target,
  ArrowUpRight, ArrowDownRight,
} from 'lucide-react';
import SectionHeader from './SectionHeader';

// --- Equity curve data (normalised 0-1 range for SVG path) ---
const RAW_EQUITY = [
  100, 103, 101, 107, 104, 110, 108, 115, 112, 120,
  117, 125, 122, 130, 126, 134, 131, 140, 137, 145,
  142, 149, 146, 155, 151, 160, 157, 165, 162, 170,
  167, 175, 171, 180, 177, 185, 182, 190, 186, 195,
  191, 200, 197, 205, 202, 210, 206, 215, 212, 220,
];

const METRICS = [
  { label: 'Win Rate',     value: 68,    suffix: '%',  color: '#10b981', icon: Target,     desc: 'Profitable trades ratio' },
  { label: 'Sharpe Ratio', value: 1.8,   suffix: '',   color: '#6366f1', icon: Activity,   desc: 'Risk-adjusted return' },
  { label: 'Max Drawdown', value: -12,   suffix: '%',  color: '#ef4444', icon: Shield,     desc: 'Peak-to-trough decline' },
  { label: 'Avg RR',       value: 2.4,   suffix: ':1', color: '#f59e0b', icon: BarChart2,  desc: 'Risk-reward per trade' },
];

const DEPTH_BIDS = [
  { price: '22,448', qty: 840, pct: 1.00 },
  { price: '22,445', qty: 620, pct: 0.74 },
  { price: '22,441', qty: 480, pct: 0.57 },
  { price: '22,438', qty: 310, pct: 0.37 },
  { price: '22,435', qty: 210, pct: 0.25 },
];
const DEPTH_ASKS = [
  { price: '22,452', qty: 760, pct: 0.91 },
  { price: '22,455', qty: 530, pct: 0.63 },
  { price: '22,459', qty: 390, pct: 0.46 },
  { price: '22,462', qty: 240, pct: 0.29 },
  { price: '22,465', qty: 160, pct: 0.19 },
];

// Build SVG path from equity data
function buildPath(data, w, h, pad = 16) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const xs = data.map((_, i) => pad + (i / (data.length - 1)) * (w - pad * 2));
  const ys = data.map((v) => h - pad - ((v - min) / (max - min)) * (h - pad * 2));
  return { xs, ys, path: xs.map((x, i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${ys[i].toFixed(1)}`).join(' ') };
}

function CountUp({ to, suffix = '', decimals = 0, color, duration = 1.6 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const abs = Math.abs(to);
    const controls = animate(0, abs, {
      duration,
      ease: 'easeOut',
      onUpdate: (v) => setVal(to < 0 ? -v : v),
    });
    return controls.stop;
  }, [inView, to, duration]);

  const display = decimals > 0 ? Math.abs(val).toFixed(decimals) : Math.round(Math.abs(val));
  const sign = to < 0 ? '-' : '';

  return (
    <span ref={ref} style={{ color }}>
      {sign}{display}{suffix}
    </span>
  );
}

function EquityCurve() {
  const W = 560;
  const H = 160;
  const { xs, ys, path } = buildPath(RAW_EQUITY, W, H);
  const [drawn, setDrawn] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const pathRef = useRef(null);

  useEffect(() => {
    if (inView && !drawn) setDrawn(true);
  }, [inView, drawn]);

  const totalLen = pathRef.current?.getTotalLength?.() ?? 1200;

  return (
    <div ref={ref} className="relative overflow-hidden rounded-2xl" style={{
      background: 'linear-gradient(145deg, rgba(16,185,129,0.08) 0%, rgba(10,6,22,0.88) 60%)',
      border: '1px solid rgba(16,185,129,0.22)',
    }}>
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, #10b981cc, transparent)' }} />

      <div className="p-5 pb-2">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs font-mono text-slate-500 uppercase tracking-widest">Equity Curve</p>
            <p className="text-lg font-bold text-white mt-0.5">NIFTY 50 · Momentum Strategy</p>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
            style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)' }}>
            <ArrowUpRight size={13} style={{ color: '#10b981' }} />
            <span className="text-sm font-bold font-mono" style={{ color: '#10b981' }}>+120%</span>
          </div>
        </div>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        style={{ height: 160 }}
        preserveAspectRatio="none"
      >
        {/* Grid lines */}
        {[0.25, 0.5, 0.75].map((f) => (
          <line key={f} x1={0} y1={H * f} x2={W} y2={H * f}
            stroke="rgba(255,255,255,0.05)" strokeWidth={1} />
        ))}

        {/* Fill gradient under curve */}
        <defs>
          <linearGradient id="eqFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
          </linearGradient>
          <clipPath id="eqClip">
            <motion.rect
              x={0} y={0} width={W} height={H}
              animate={{ scaleX: drawn ? 1 : 0 }}
              initial={{ scaleX: 0 }}
              style={{ transformOrigin: 'left center' }}
              transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1] }}
            />
          </clipPath>
        </defs>

        {/* Area fill */}
        <path
          d={`${path} L${xs[xs.length - 1]},${H} L${xs[0]},${H} Z`}
          fill="url(#eqFill)"
          clipPath="url(#eqClip)"
        />

        {/* Main line — animated draw */}
        <motion.path
          ref={pathRef}
          d={path}
          fill="none"
          stroke="#10b981"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: drawn ? 1 : 0 }}
          transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1] }}
          style={{ filter: 'drop-shadow(0 0 6px rgba(16,185,129,0.6))' }}
        />

        {/* End dot */}
        {drawn && (
          <motion.circle
            cx={xs[xs.length - 1]}
            cy={ys[ys.length - 1]}
            r={5}
            fill="#10b981"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 2.0, duration: 0.3 }}
            style={{ filter: 'drop-shadow(0 0 8px #10b981)' }}
          />
        )}
      </svg>

      <div className="px-5 pb-4 flex justify-between">
        {['Jan', 'Mar', 'May', 'Jul', 'Sep', 'Nov'].map((m) => (
          <span key={m} className="text-[10px] font-mono text-slate-600">{m}</span>
        ))}
      </div>
    </div>
  );
}

function MarketDepth() {
  return (
    <div className="rounded-2xl overflow-hidden" style={{
      background: 'linear-gradient(145deg, rgba(99,102,241,0.08) 0%, rgba(10,6,22,0.88) 60%)',
      border: '1px solid rgba(99,102,241,0.20)',
    }}>
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, #6366f1cc, transparent)' }} />

      <div className="p-4">
        <p className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-3">
          Market Depth · NIFTY 50
        </p>

        <div className="grid grid-cols-2 gap-3">
          {/* Bids */}
          <div>
            <div className="flex justify-between text-[9px] font-mono text-slate-600 mb-1.5 uppercase tracking-wider">
              <span>Price</span><span>Qty</span>
            </div>
            {DEPTH_BIDS.map((row, i) => (
              <div key={i} className="relative mb-1 overflow-hidden rounded">
                <motion.div
                  className="absolute inset-y-0 right-0"
                  style={{ background: 'rgba(16,185,129,0.15)', left: `${(1 - row.pct) * 100}%` }}
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07, duration: 0.5 }}
                />
                <div className="relative flex justify-between px-1.5 py-0.5">
                  <span className="text-[10px] font-mono" style={{ color: '#10b981' }}>{row.price}</span>
                  <span className="text-[10px] font-mono text-slate-400">{row.qty}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Asks */}
          <div>
            <div className="flex justify-between text-[9px] font-mono text-slate-600 mb-1.5 uppercase tracking-wider">
              <span>Price</span><span>Qty</span>
            </div>
            {DEPTH_ASKS.map((row, i) => (
              <div key={i} className="relative mb-1 overflow-hidden rounded">
                <motion.div
                  className="absolute inset-y-0 left-0"
                  style={{ background: 'rgba(239,68,68,0.15)', right: `${(1 - row.pct) * 100}%` }}
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07, duration: 0.5 }}
                />
                <div className="relative flex justify-between px-1.5 py-0.5">
                  <span className="text-[10px] font-mono" style={{ color: '#ef4444' }}>{row.price}</span>
                  <span className="text-[10px] font-mono text-slate-400">{row.qty}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Spread indicator */}
        <div className="mt-3 text-center">
          <span className="text-[9px] font-mono text-slate-600 uppercase tracking-wider">Spread: </span>
          <span className="text-[9px] font-mono text-slate-400">4 pts · 0.018%</span>
        </div>
      </div>
    </div>
  );
}

export default function Trading() {
  return (
    <section id="trading" className="section-padding" style={{ overflowX: 'clip' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          label="Trading & Quant"
          title="Systematic"
          highlight="Trading"
          description="Applying engineering discipline to markets — backtested strategies, risk management, and quantitative analysis."
        />

        {/* Metric cards row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {METRICS.map((m, i) => {
            const Icon = m.icon;
            const decimals = Number.isInteger(m.value) ? 0 : 1;
            return (
              <motion.div
                key={m.label}
                className="relative rounded-2xl overflow-hidden"
                style={{
                  background: `linear-gradient(145deg, ${m.color}14 0%, rgba(10,6,22,0.88) 60%)`,
                  border: `1px solid ${m.color}28`,
                }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                whileHover={{ y: -4, boxShadow: `0 0 40px ${m.color}20` }}
              >
                {/* Top accent */}
                <div className="absolute top-0 left-0 right-0 h-px"
                  style={{ background: `linear-gradient(90deg, transparent, ${m.color}cc, transparent)` }} />

                <div className="p-5">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: `${m.color}18`, border: `1px solid ${m.color}35` }}>
                    <Icon size={18} style={{ color: m.color }} />
                  </div>

                  <div className="text-3xl font-black font-mono tabular-nums leading-none mb-1"
                    style={{ textShadow: `0 0 30px ${m.color}80` }}>
                    <CountUp to={m.value} suffix={m.suffix} decimals={decimals} color={m.color} />
                  </div>

                  <div className="text-xs font-semibold mb-0.5" style={{ color: 'var(--text-2)' }}>
                    {m.label}
                  </div>
                  <div className="text-[10px]" style={{ color: 'var(--text-4)' }}>{m.desc}</div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Main content: equity curve + depth */}
        <div className="grid lg:grid-cols-5 gap-6">
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <EquityCurve />
          </motion.div>

          <motion.div
            className="lg:col-span-2 relative"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <MarketDepth />
          </motion.div>
        </div>

        {/* Disclaimer */}
        <motion.p
          className="text-center text-[10px] font-mono mt-8"
          style={{ color: 'var(--text-4)' }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          For educational purposes only · Past performance does not indicate future results
        </motion.p>
      </div>
    </section>
  );
}
