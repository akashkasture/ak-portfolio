import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Code, GitBranch, Server, TrendingUp, Lock, CheckCircle,
} from 'lucide-react';
import { timeline } from '../data/portfolio';
import SectionHeader from './SectionHeader';
import { useTheme } from '../context/ThemeContext';

const ICON_MAP = { Code, GitBranch, Server, TrendingUp };

const CURRENT_YEAR = 2026;

function getStatus(item) {
  if (item.locked) return 'future';
  const y = parseInt(item.year.match(/\d{4}/)?.[0] || '0');
  if (y >= CURRENT_YEAR) return 'current';
  return 'past';
}

export default function CareerJourney() {
  const [activeIdx, setActiveIdx] = useState(0);
  const itemRefs = useRef([]);

  useEffect(() => {
    const onScroll = () => {
      const mid = window.innerHeight * 0.5;
      let best = 0;
      let bestDist = Infinity;
      itemRefs.current.forEach((el, i) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        const d = Math.abs((r.top + r.bottom) / 2 - mid);
        if (d < bestDist) { bestDist = d; best = i; }
      });
      setActiveIdx(best);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const active = timeline[activeIdx];

  return (
    <section id="journey" className="section-padding relative overflow-hidden">
      {/* Background radial */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[800px] rounded-full"
          style={{ background: 'radial-gradient(ellipse, rgba(99,102,241,0.05) 0%, transparent 65%)' }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeader
          label="Career Journey"
          title="The Road"
          highlight="Traveled"
          description="Every milestone — from first commit to production at scale."
        />

        {/* Roadmap */}
        <div className="relative">
          {/* Animated center spine — desktop */}
          <div className="absolute left-1/2 top-0 bottom-0 hidden md:block" style={{ transform: 'translateX(-50%)', width: 2 }}>
            <div
              className="h-full w-full rounded-full"
              style={{ background: 'linear-gradient(to bottom, transparent 0%, rgba(99,102,241,0.2) 5%, rgba(99,102,241,0.35) 50%, rgba(168,85,247,0.25) 95%, transparent 100%)' }}
            />
            <motion.div
              className="absolute left-1/2 -translate-x-1/2 w-1.5 h-8 rounded-full"
              style={{ background: 'linear-gradient(180deg, transparent, #6366f1, transparent)' }}
              animate={{ top: ['0%', '100%'] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
            />
          </div>

          {/* Mobile left spine */}
          <div
            className="absolute md:hidden rounded-full"
            style={{ left: 19, top: 0, bottom: 0, width: 2, background: 'linear-gradient(to bottom, transparent 0%, rgba(99,102,241,0.18) 5%, rgba(99,102,241,0.32) 50%, rgba(168,85,247,0.22) 95%, transparent 100%)' }}
          >
            <motion.div
              className="absolute left-1/2 -translate-x-1/2 rounded-full"
              style={{ width: 6, height: 32, background: 'linear-gradient(180deg, transparent, #6366f1, transparent)' }}
              animate={{ top: ['0%', '100%'] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
            />
          </div>

          <div className="space-y-0">
            {timeline.map((item, i) => {
              const isLeft = i % 2 === 0;
              const isActive = i === activeIdx;
              const status = getStatus(item);
              const Icon = ICON_MAP[item.icon] || Code;

              return (
                <motion.div
                  key={i}
                  ref={el => { itemRefs.current[i] = el; }}
                  className="relative flex items-center"
                  initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
                  whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.55, delay: 0.05 }}
                >
                  {/* === DESKTOP === */}

                  {/* Left half */}
                  <div className="hidden md:flex w-1/2 justify-end pr-14 py-6">
                    {isLeft ? (
                      <RoadmapCard
                        item={item}
                        isActive={isActive}
                        status={status}
                        align="right"
                        onClick={() => setActiveIdx(i)}
                      />
                    ) : (
                      isActive && (
                        <motion.div
                          className="self-center h-px w-16 ml-auto"
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          style={{ transformOrigin: 'right', background: `linear-gradient(to left, ${item.color}50, transparent)` }}
                        />
                      )
                    )}
                  </div>

                  {/* Center checkpoint node */}
                  <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 z-20">
                    <CheckpointNode
                      item={item}
                      isActive={isActive}
                      status={status}
                      Icon={Icon}
                      onClick={() => setActiveIdx(i)}
                    />
                  </div>

                  {/* Right half */}
                  <div className="hidden md:flex w-1/2 justify-start pl-14 py-6">
                    {!isLeft ? (
                      <RoadmapCard
                        item={item}
                        isActive={isActive}
                        status={status}
                        align="left"
                        onClick={() => setActiveIdx(i)}
                      />
                    ) : (
                      isActive && (
                        <motion.div
                          className="self-center h-px w-16"
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          style={{ transformOrigin: 'left', background: `linear-gradient(to right, ${item.color}50, transparent)` }}
                        />
                      )
                    )}
                  </div>

                  {/* === MOBILE === */}
                  <div className="flex md:hidden w-full gap-4 items-start py-3 pl-0">
                    <div className="flex flex-col items-center flex-shrink-0" style={{ width: 40 }}>
                      <CheckpointNode item={item} isActive={isActive} status={status} Icon={Icon} small onClick={() => setActiveIdx(i)} />
                      {i < timeline.length - 1 && (
                        <div
                          className="relative mt-1 rounded-full"
                          style={{ width: 2, height: 36, background: `linear-gradient(to bottom, ${item.color}55, rgba(99,102,241,0.1))` }}
                        >
                          <motion.div
                            className="absolute left-1/2 -translate-x-1/2 rounded-full"
                            style={{ width: 4, height: 4, background: item.color, boxShadow: `0 0 6px ${item.color}`, top: 0 }}
                            animate={{ top: ['0%', '100%'], opacity: [0.4, 1, 0.4] }}
                            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.18 }}
                          />
                        </div>
                      )}
                    </div>
                    <RoadmapCard
                      item={item}
                      isActive={isActive}
                      status={status}
                      align="left"
                      onClick={() => setActiveIdx(i)}
                      mobile
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Bottom active detail chip */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIdx}
            className="mt-14 max-w-2xl mx-auto rounded-2xl p-5 relative overflow-hidden"
            style={{
              background: 'var(--surface)',
              backdropFilter: 'blur(24px)',
              border: `1px solid ${active?.color}30`,
              boxShadow: `0 0 50px ${active?.color}12`,
              transition: 'background 0.4s ease',
            }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
          >
            <div
              className="absolute top-0 left-0 right-0 h-px"
              style={{ background: `linear-gradient(90deg, transparent, ${active?.color}70, transparent)` }}
            />
            <div className="flex items-center gap-3 mb-3">
              {(() => {
                const Icon = ICON_MAP[active?.icon] || Code;
                return (
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${active?.color}20`, border: `1px solid ${active?.color}40` }}
                  >
                    <Icon size={18} style={{ color: active?.color }} />
                  </div>
                );
              })()}
              <div className="flex-1 min-w-0">
                <span
                  className="text-[10px] font-mono uppercase tracking-widest"
                  style={{ color: active?.color }}
                >
                  {active?.year}
                </span>
                <div className="text-white font-bold text-sm">{active?.title}</div>
              </div>
              {/* Progress dots */}
              <div className="flex gap-1.5 flex-shrink-0">
                {timeline.map((_, j) => (
                  <button
                    key={j}
                    onClick={() => setActiveIdx(j)}
                    className="rounded-full transition-all duration-300"
                    style={{
                      width: j === activeIdx ? 18 : 6,
                      height: 6,
                      background: j === activeIdx ? active?.color : 'rgba(255,255,255,0.12)',
                    }}
                  />
                ))}
              </div>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">{active?.description}</p>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

/* ─── Checkpoint Node ──────────────────────────────────────────── */
function CheckpointNode({ item, isActive, status, Icon, small, onClick }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const iconSz = small ? 14 : 18;
  const isFuture = status === 'future';

  const nodeBg = isFuture
    ? 'var(--surface)'
    : isActive
    ? `${item.color}20`
    : 'var(--surface)';

  const nodeBorder = isFuture
    ? 'var(--surface-border)'
    : isActive
    ? item.color
    : 'var(--surface-border)';

  return (
    <button onClick={onClick} className="relative flex items-center justify-center" style={{ width: small ? 40 : 52, height: small ? 40 : 52 }}>
      {isActive && !isFuture && (
        <>
          <div className="absolute inset-0 rounded-xl ring-pulse" style={{ border: `2px solid ${item.color}70`, borderRadius: 12 }} />
          <div className="absolute inset-0 rounded-xl ring-pulse-delay" style={{ border: `1px solid ${item.color}50`, borderRadius: 14 }} />
        </>
      )}

      <motion.div
        className="relative w-full h-full rounded-xl flex items-center justify-center"
        style={{
          background: nodeBg,
          border: `2px solid ${nodeBorder}`,
          boxShadow: isActive && !isFuture ? `0 0 24px ${item.color}60, 0 0 50px ${item.color}25` : '0 2px 12px rgba(0,0,0,0.1)',
          transition: 'all 0.35s ease',
        }}
        whileHover={{ scale: 1.08 }}
        animate={isActive && !isFuture ? { scale: [1, 1.05, 1] } : { scale: 1 }}
        transition={{ duration: 1.8, repeat: isActive && !isFuture ? Infinity : 0 }}
      >
        {isFuture ? (
          <Lock size={iconSz - 2} style={{ color: 'var(--text-4)' }} />
        ) : (
          <Icon
            size={iconSz}
            style={{
              color: isActive ? item.color : isDark ? '#6366f160' : `${item.color}80`,
              transition: 'color 0.3s',
            }}
          />
        )}
      </motion.div>

      {!small && status === 'past' && !isActive && (
        <div
          className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full flex items-center justify-center"
          style={{ background: '#10b981', border: '2px solid var(--bg)' }}
        >
          <CheckCircle size={10} className="text-white" strokeWidth={3} />
        </div>
      )}
      {!small && isFuture && (
        <div
          className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full flex items-center justify-center"
          style={{ background: 'var(--surface)', border: '2px solid var(--surface-border)' }}
        >
          <Lock size={8} style={{ color: 'var(--text-4)' }} />
        </div>
      )}
    </button>
  );
}

/* ─── Roadmap Card ─────────────────────────────────────────────── */
function RoadmapCard({ item, isActive, status, align, onClick, mobile }) {
  const isFuture = status === 'future';

  return (
    <motion.button
      onClick={onClick}
      className={`relative text-left w-full max-w-[300px] ${mobile ? 'max-w-full' : ''} rounded-xl px-5 py-4 overflow-hidden`}
      style={{
        background: isActive ? `${item.color}0e` : 'var(--surface)',
        border: `1px solid ${isActive ? item.color + '40' : 'var(--surface-border)'}`,
        boxShadow: isActive ? `0 0 30px ${item.color}20, 0 4px 20px rgba(0,0,0,0.08)` : '0 2px 8px rgba(0,0,0,0.04)',
        opacity: isFuture ? 0.5 : 1,
        transition: 'all 0.3s ease',
        filter: isFuture ? 'blur(2px)' : 'none',
      }}
      whileHover={{ scale: mobile ? 1 : 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Shimmer on active */}
      {isActive && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ background: `linear-gradient(105deg, transparent, ${item.color}0a, transparent)` }}
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear', repeatDelay: 1.5 }}
        />
      )}

      {/* Future overlay — desktop only */}
      {isFuture && !mobile && (
        <div
          className="absolute inset-0 z-10 rounded-xl flex flex-col items-center justify-center gap-2"
          style={{ backdropFilter: 'blur(3px)', background: 'rgba(var(--bg), 0.3)' }}
        >
          <Lock size={16} style={{ color: 'var(--text-4)' }} />
          <span className="text-[10px] font-mono uppercase tracking-wider" style={{ color: 'var(--text-4)' }}>Upcoming</span>
        </div>
      )}

      <div
        className={`text-[10px] font-mono font-semibold uppercase tracking-widest mb-1 ${align === 'right' && !mobile ? 'text-right' : 'text-left'}`}
        style={{ color: isActive ? item.color : 'var(--text-3)' }}
      >
        {item.year}
      </div>
      <div
        className={`font-bold text-sm leading-tight ${align === 'right' && !mobile ? 'text-right' : 'text-left'}`}
        style={{ color: isActive ? 'var(--text-1)' : 'var(--text-2)' }}
      >
        {item.title}
      </div>

      {/* Description — show on both desktop and mobile when active */}
      {isActive && (
        <motion.div
          className={`text-[11px] leading-relaxed mt-2 ${align === 'right' && !mobile ? 'text-right' : 'text-left'}`}
          style={{ color: 'var(--text-3)' }}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.22 }}
        >
          {item.description}
        </motion.div>
      )}
    </motion.button>
  );
}
