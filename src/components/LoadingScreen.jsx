import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Circle } from 'lucide-react';

const BOOT_LINES = [
  { text: 'Initializing Kafka consumers...', color: '#6366f1', delay: 400 },
  { text: 'Acquiring Redis distributed lock...', color: '#10b981', delay: 950 },
  { text: 'Loading market data feeds...', color: '#f59e0b', delay: 1500 },
  { text: 'Warming Spring Boot context...', color: '#06b6d4', delay: 2000 },
  { text: 'Portfolio ready.', color: '#a3e635', delay: 2480 },
];

export default function LoadingScreen() {
  const [visibleLines, setVisibleLines] = useState([]);
  const [checkedLines, setCheckedLines] = useState([]);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const timers = [];

    BOOT_LINES.forEach((line, i) => {
      timers.push(
        setTimeout(() => {
          setVisibleLines((prev) => [...prev, i]);
          setProgress(Math.round(((i + 1) / BOOT_LINES.length) * 100));
          setTimeout(() => {
            setCheckedLines((prev) => [...prev, i]);
            if (i === BOOT_LINES.length - 1) setDone(true);
          }, 260);
        }, line.delay)
      );
    });

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: '#000000' }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.55, ease: 'easeInOut' }}
    >
      {/* Ambient grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Radial glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 600,
          height: 600,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)',
        }}
      />

      <div className="relative w-full max-w-lg mx-4">
        {/* Terminal window */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: '#0a0a0a',
            border: '1px solid rgba(99,102,241,0.25)',
            boxShadow: '0 0 80px rgba(99,102,241,0.15), 0 40px 80px rgba(0,0,0,0.8)',
          }}
        >
          {/* Title bar */}
          <div
            className="flex items-center gap-2 px-4 py-3"
            style={{ background: '#111111', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
            <span className="ml-3 text-xs font-mono text-slate-500">akash@portfolio — boot sequence</span>
          </div>

          {/* Terminal body */}
          <div className="p-6 min-h-[220px]">
            {/* Prompt header */}
            <div className="flex items-center gap-2 mb-5">
              <span className="text-xs font-mono" style={{ color: '#6366f1' }}>akash</span>
              <span className="text-xs font-mono text-slate-600">@</span>
              <span className="text-xs font-mono" style={{ color: '#10b981' }}>portfolio</span>
              <span className="text-xs font-mono text-slate-600 mx-1">~</span>
              <span className="text-xs font-mono text-slate-400">$ npm run start</span>
              <motion.span
                className="inline-block w-1.5 h-3.5 ml-0.5"
                style={{ background: '#6366f1' }}
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.9, repeat: Infinity }}
              />
            </div>

            {/* Boot lines */}
            <div className="space-y-2.5">
              <AnimatePresence>
                {BOOT_LINES.map((line, i) =>
                  visibleLines.includes(i) ? (
                    <motion.div
                      key={i}
                      className="flex items-center gap-3"
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                    >
                      <div className="flex-shrink-0">
                        {checkedLines.includes(i) ? (
                          <CheckCircle2 size={13} style={{ color: line.color }} />
                        ) : (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                          >
                            <Circle size={13} style={{ color: line.color, opacity: 0.5 }} />
                          </motion.div>
                        )}
                      </div>
                      <span
                        className="text-sm font-mono"
                        style={{ color: i === BOOT_LINES.length - 1 ? line.color : 'rgba(255,255,255,0.75)' }}
                      >
                        {line.text}
                      </span>
                      {checkedLines.includes(i) && i < BOOT_LINES.length - 1 && (
                        <span className="text-xs font-mono ml-auto" style={{ color: line.color }}>
                          OK
                        </span>
                      )}
                      {i === BOOT_LINES.length - 1 && checkedLines.includes(i) && (
                        <motion.span
                          className="text-xs font-mono ml-auto"
                          style={{ color: line.color }}
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 1.4, repeat: Infinity }}
                        >
                          ✓ LIVE
                        </motion.span>
                      )}
                    </motion.div>
                  ) : null
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Progress bar */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '12px 24px' }}>
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">Boot progress</span>
              <span className="text-[10px] font-mono" style={{ color: '#6366f1' }}>{progress}%</span>
            </div>
            <div className="h-0.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #6366f1, #06b6d4)' }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              />
            </div>
          </div>
        </div>

        {/* AK badge below terminal */}
        <motion.div
          className="flex items-center justify-center gap-3 mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: done ? 1 : 0.35 }}
          transition={{ duration: 0.5 }}
        >
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold font-mono"
            style={{
              background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
              boxShadow: done ? '0 0 24px rgba(99,102,241,0.7)' : '0 0 12px rgba(99,102,241,0.3)',
            }}
          >
            AK
          </div>
          <span className="text-xs font-mono text-slate-500">
            {done ? 'akash kasture · backend engineer' : 'initializing...'}
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
}
