import { useMemo, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const CELL = 36;
const COLS = 40;
const ROWS = 30;
const GLOW_COUNT = 24;

function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export default function GridBackground() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const gridRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      if (gridRef.current) {
        gridRef.current.style.transform = `translateY(${window.scrollY * 0.15}px)`;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const cells = useMemo(() => {
    const rng = seededRandom(42);
    const palette = ['#7c3aed', '#06b6d4', '#a855f7', '#10b981', '#3b82f6', '#f59e0b'];
    return Array.from({ length: GLOW_COUNT }, (_, i) => ({
      id: i,
      col: Math.floor(rng() * COLS),
      row: Math.floor(rng() * ROWS),
      color: palette[Math.floor(rng() * palette.length)],
      duration: rng() * 5 + 4,
      delay: rng() * 8,
      size: Math.floor(rng() * 2 + 1),
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Parallax grid */}
      <div ref={gridRef} className="absolute" style={{ inset: '-20%', willChange: 'transform' }}>
        {/* Primary dot grid — dim, uses CSS var */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle, var(--grid-dot) 1.2px, transparent 1.2px)',
            backgroundSize: `${CELL}px ${CELL}px`,
          }}
        />
        {/* Secondary offset grid — very subtle */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle, var(--grid-dot2) 1px, transparent 1px)',
            backgroundSize: `${CELL * 2}px ${CELL * 2}px`,
            backgroundPosition: `${CELL}px ${CELL}px`,
          }}
        />

        {/* Animated glowing cells — dim in dark, subtle in light */}
        {cells.map((c) => (
          <motion.div
            key={c.id}
            className="absolute rounded-sm"
            style={{
              left: c.col * CELL,
              top: c.row * CELL,
              width: CELL * c.size - 3,
              height: CELL * c.size - 3,
              background: `${c.color}16`,
              border: `1px solid ${c.color}38`,
              boxShadow: `0 0 20px ${c.color}28`,
            }}
            animate={{ opacity: [0, 0.9, 0], scale: [0.8, 1.04, 0.8] }}
            transition={{ duration: c.duration, delay: c.delay, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </div>

      {/* Atmospheric glows — hidden in light mode to prevent purple bleed */}
      {isDark && (
        <>
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[550px]"
            style={{ background: 'radial-gradient(ellipse 60% 100% at 50% 0%, rgba(124,58,237,0.12) 0%, transparent 100%)' }}
          />
          <div
            className="absolute bottom-0 right-0 w-[600px] h-[500px]"
            style={{ background: 'radial-gradient(ellipse 80% 80% at 100% 100%, rgba(6,182,212,0.08) 0%, transparent 70%)' }}
          />
          <div
            className="absolute top-1/3 left-0 w-[400px] h-[600px]"
            style={{ background: 'radial-gradient(ellipse 100% 60% at 0% 50%, rgba(168,85,247,0.07) 0%, transparent 70%)' }}
          />
        </>
      )}
      {/* Light mode subtle blue-grey tint */}
      {!isDark && (
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px]"
          style={{ background: 'radial-gradient(ellipse 70% 80% at 50% 0%, rgba(99,102,241,0.04) 0%, transparent 100%)' }}
        />
      )}

      {/* Mobile-only stronger atmospheric glows — ensure glow is always visible on small screens */}
      <div className="absolute inset-0 pointer-events-none md:hidden">
        <motion.div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 65%)' }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-64 h-64 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.14) 0%, transparent 65%)' }}
          animate={{ scale: [1, 1.12, 1], opacity: [0.5, 0.95, 0.5] }}
          transition={{ duration: 7, delay: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-1/2 left-0 w-52 h-52 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.14) 0%, transparent 65%)' }}
          animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.85, 0.4] }}
          transition={{ duration: 8, delay: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
    </div>
  );
}
