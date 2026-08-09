import { useRef, useState } from 'react';
import { AnimatePresence, motion, useSpring, useTransform } from 'framer-motion';

export default function DockIcon({ app, isOpen, isActive, mouseX, onClick }) {
  const ref = useRef(null);
  const [hovered, setHovered] = useState(false);
  const Icon = app.icon;
  const [c1, c2] = app.tint || ['#6366f1', '#8b5cf6'];

  const distance = useTransform(mouseX, (val) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect || val === Infinity) return Infinity;
    return val - (rect.left + rect.width / 2);
  });

  const scaleRaw = useTransform(distance, [-160, 0, 160], [1, 1.45, 1]);
  const scale = useSpring(scaleRaw, { mass: 0.12, stiffness: 260, damping: 18 });
  const yRaw = useTransform(distance, [-160, 0, 160], [0, -14, 0]);
  const y = useSpring(yRaw, { mass: 0.12, stiffness: 260, damping: 18 });

  return (
    <div className="relative flex flex-col items-center">
      <AnimatePresence>
        {hovered && (
          <motion.div
            className="absolute -top-11 px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap z-10"
            style={{
              background: 'rgba(15,15,24,0.92)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#e2e8f0',
              backdropFilter: 'blur(16px)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.45)',
            }}
            initial={{ opacity: 0, y: 6, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.9 }}
            transition={{ duration: 0.14 }}
          >
            {app.title}
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button
        ref={ref}
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ scale, y, transformOrigin: 'bottom center' }}
        whileTap={{ scale: 0.92 }}
        className="w-12 h-12 relative"
        aria-label={app.title}
      >
        <div
          className="w-full h-full rounded-[14px] flex items-center justify-center relative overflow-hidden"
          style={{
            background: `linear-gradient(145deg, ${c1}, ${c2})`,
            boxShadow: [
              'inset 0 1px 0 rgba(255,255,255,0.28)',
              'inset 0 -1px 0 rgba(0,0,0,0.25)',
              `0 6px 16px -4px ${c1}55`,
              '0 3px 8px rgba(0,0,0,0.4)',
            ].join(', '),
          }}
        >
          {/* Glass sheen across the top half, like real OS app icons */}
          <div
            className="absolute inset-x-0 top-0 h-1/2 pointer-events-none"
            style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.22), rgba(255,255,255,0.02))' }}
          />
          <Icon size={22} style={{ color: app.iconColor || '#fff', position: 'relative', filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.35))' }} />
        </div>
      </motion.button>
      <div
        className="w-1 h-1 rounded-full mt-1.5 transition-all duration-300"
        style={{
          background: isActive ? 'var(--os-accent)' : 'rgba(255,255,255,0.55)',
          boxShadow: isActive ? '0 0 6px var(--os-accent)' : 'none',
          opacity: isOpen ? 1 : 0,
        }}
      />
    </div>
  );
}
