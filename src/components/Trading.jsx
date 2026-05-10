import { useEffect, useRef, useState } from 'react';
import { motion, useInView, animate } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import {
  TrendingUp, Activity, BarChart2, Shield, Target,
} from 'lucide-react';
import SectionHeader from './SectionHeader';

const EQUITY_DATA = [
  { month: 'Jan', value: 100 },
  { month: 'Feb', value: 106 },
  { month: 'Mar', value: 103 },
  { month: 'Apr', value: 112 },
  { month: 'May', value: 109 },
  { month: 'Jun', value: 119 },
  { month: 'Jul', value: 117 },
  { month: 'Aug', value: 128 },
  { month: 'Sep', value: 125 },
  { month: 'Oct', value: 138 },
  { month: 'Nov', value: 145 },
  { month: 'Dec', value: 155 },
  { month: "Jan'", value: 152 },
  { month: "Feb'", value: 163 },
  { month: "Mar'", value: 160 },
  { month: "Apr'", value: 174 },
  { month: "May'", value: 170 },
  { month: "Jun'", value: 185 },
  { month: "Jul'", value: 182 },
  { month: "Aug'", value: 198 },
  { month: "Sep'", value: 195 },
  { month: "Oct'", value: 210 },
  { month: "Nov'", value: 207 },
  { month: "Dec'", value: 220 },
];

const METRICS = [
  { label: 'Win Rate',     value: 68,   suffix: '%',  color: '#10b981', icon: Target,    desc: 'Profitable trades ratio' },
  { label: 'Sharpe Ratio', value: 1.8,  suffix: '',   color: '#6366f1', icon: Activity,  desc: 'Risk-adjusted return' },
  { label: 'Max Drawdown', value: -12,  suffix: '%',  color: '#ef4444', icon: Shield,    desc: 'Peak-to-trough decline' },
  { label: 'Avg RR',       value: 2.4,  suffix: ':1', color: '#f59e0b', icon: BarChart2, desc: 'Risk-reward per trade' },
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

function CountUp({ to, suffix = '', decimals = 0, color, duration = 1.4 }) {
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
  return <span ref={ref} style={{ color }}>{sign}{display}{suffix}</span>;
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const val = payload[0].value;
  const pct = (((val - 100) / 100) * 100).toFixed(1);
  return (
    <div
      className="rounded-lg px-3 py-2 text-xs font-mono"
      style={{
        background: 'rgba(10,10,20,0.92)',
        border: '1px solid rgba(16,185,129,0.3)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <div className="text-slate-400 mb-0.5">{label}</div>
      <div className="font-bold" style={{ color: '#10b981' }}>
        {val.toFixed(0)} (+{pct}%)
      </div>
    </div>
  );
}

export default function Trading() {
  const [chartVisible, setChartVisible] = useState(false);
  const chartRef = useRef(null);
  const inView = useInView(chartRef, { once: true });

  useEffect(() => {
    if (inView) setTimeout(() => setChartVisible(true), 200);
  }, [inView]);

  return (
    <section id="trading" className="section-padding" style={{ overflowX: 'clip' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          label="Trading & Quant"
          title="Systematic"
          highlight="Trading"
          description="Applying engineering discipline to markets — backtested strategies, risk management, and quantitative analysis."
        />

        {/* Metric row — clean stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
          {METRICS.map((m, i) => {
            const Icon = m.icon;
            const decimals = Number.isInteger(m.value) ? 0 : 1;
            return (
              <motion.div
                key={m.label}
                className="rounded-xl p-5 flex flex-col gap-3"
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--surface-border)',
                  borderLeft: `3px solid ${m.color}`,
                }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.4 }}
                whileHover={{ y: -2 }}
              >
                <div className="flex items-center gap-2">
                  <Icon size={13} style={{ color: m.color }} />
                  <span className="text-[10px] font-mono uppercase tracking-widest" style={{ color: 'var(--text-4)' }}>
                    {m.label}
                  </span>
                </div>
                <div className="text-3xl font-bold tabular-nums leading-none">
                  <CountUp to={m.value} suffix={m.suffix} decimals={decimals} color={m.color} />
                </div>
                <div className="text-xs" style={{ color: 'var(--text-3)' }}>{m.desc}</div>
              </motion.div>
            );
          })}
        </div>

        {/* Chart + Depth grid */}
        <div className="grid lg:grid-cols-5 gap-6">

          {/* Equity Curve — Recharts */}
          <motion.div
            ref={chartRef}
            className="lg:col-span-3 rounded-xl overflow-hidden"
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--surface-border)',
            }}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-between px-5 pt-5 pb-3">
              <div>
                <p className="text-[10px] font-mono uppercase tracking-widest mb-1" style={{ color: 'var(--text-4)' }}>
                  Equity Curve
                </p>
                <p className="text-sm font-semibold" style={{ color: 'var(--text-1)' }}>
                  NIFTY 50 · Momentum Strategy
                </p>
              </div>
              <div
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-bold"
                style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', color: '#10b981' }}
              >
                <TrendingUp size={11} />
                +120%
              </div>
            </div>

            <div style={{ height: 220 }}>
              {chartVisible && (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={EQUITY_DATA} margin={{ top: 8, right: 20, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="eqGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#10b981" stopOpacity={0.22} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 10, fontFamily: 'monospace', fill: 'rgba(148,163,184,0.6)' }}
                      axisLine={false}
                      tickLine={false}
                      interval={3}
                    />
                    <YAxis
                      domain={['dataMin - 5', 'dataMax + 5']}
                      tick={{ fontSize: 10, fontFamily: 'monospace', fill: 'rgba(148,163,184,0.6)' }}
                      axisLine={false}
                      tickLine={false}
                      width={36}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(16,185,129,0.3)', strokeWidth: 1 }} />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#10b981"
                      strokeWidth={2}
                      fill="url(#eqGrad)"
                      dot={false}
                      activeDot={{ r: 4, fill: '#10b981', strokeWidth: 0 }}
                      isAnimationActive={true}
                      animationDuration={1800}
                      animationEasing="ease-out"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
            <div className="px-5 pb-4 pt-1 text-[10px] font-mono" style={{ color: 'var(--text-4)' }}>
              24-month backtest · Jan 2023 – Dec 2024
            </div>
          </motion.div>

          {/* Market Depth */}
          <motion.div
            className="lg:col-span-2 rounded-xl overflow-hidden"
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--surface-border)',
            }}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.12 }}
          >
            <div className="px-4 pt-4 pb-3">
              <p className="text-[10px] font-mono uppercase tracking-widest" style={{ color: 'var(--text-4)' }}>
                Market Depth · NIFTY 50
              </p>
            </div>

            <div className="px-4 pb-4">
              {/* Headers */}
              <div className="grid grid-cols-2 gap-2 mb-2">
                {['Bids', 'Asks'].map((h, i) => (
                  <div key={h} className="flex justify-between text-[9px] font-mono uppercase tracking-wider" style={{ color: 'var(--text-4)' }}>
                    <span>Price</span><span>Qty</span>
                  </div>
                ))}
              </div>

              {/* Depth rows */}
              {DEPTH_BIDS.map((bid, i) => {
                const ask = DEPTH_ASKS[i];
                return (
                  <div key={i} className="grid grid-cols-2 gap-2 mb-1">
                    {/* Bid */}
                    <div className="relative rounded overflow-hidden">
                      <motion.div
                        className="absolute inset-y-0 right-0"
                        style={{ background: 'rgba(16,185,129,0.12)', left: `${(1 - bid.pct) * 100}%` }}
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.06, duration: 0.45 }}
                      />
                      <div className="relative flex justify-between px-1.5 py-1">
                        <span className="text-[10px] font-mono" style={{ color: '#10b981' }}>{bid.price}</span>
                        <span className="text-[10px] font-mono" style={{ color: 'var(--text-3)' }}>{bid.qty}</span>
                      </div>
                    </div>
                    {/* Ask */}
                    <div className="relative rounded overflow-hidden">
                      <motion.div
                        className="absolute inset-y-0 left-0"
                        style={{ background: 'rgba(239,68,68,0.12)', right: `${(1 - ask.pct) * 100}%` }}
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.06, duration: 0.45 }}
                      />
                      <div className="relative flex justify-between px-1.5 py-1">
                        <span className="text-[10px] font-mono" style={{ color: '#ef4444' }}>{ask.price}</span>
                        <span className="text-[10px] font-mono" style={{ color: 'var(--text-3)' }}>{ask.qty}</span>
                      </div>
                    </div>
                  </div>
                );
              })}

              <div className="mt-3 pt-3 text-center text-[9px] font-mono" style={{ borderTop: '1px solid var(--surface-border)', color: 'var(--text-4)' }}>
                SPREAD: 4 pts · 0.018%
              </div>
            </div>
          </motion.div>
        </div>

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
