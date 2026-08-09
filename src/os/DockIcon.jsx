import { useRef, useState } from 'react';
import { AnimatePresence, motion, useSpring, useTransform } from 'framer-motion';

export default function DockIcon({ app, isOpen, isActive, mouseX, onClick }) {
  const ref = useRef(null);
  const [hovered, setHovered] = useState(false);
  const Icon = app.icon;

  const distance = useTransform(mouseX, (val) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect || val === Infinity) return Infinity;
    return val - (rect.left + rect.width / 2);
  });

  const scaleRaw = useTransform(distance, [-140, 0, 140], [1, 1.55, 1]);
  const scale = useSpring(scaleRaw, { mass: 0.15, stiffness: 220, damping: 16 });

  return (
    <div className="relative flex flex-col items-center">
      <AnimatePresence>
        {hovered && (
          <motion.div
            className="absolute -top-9 px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap glass-strong"
            style={{ color: 'var(--text-1)' }}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.12 }}
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
        style={{ scale }}
        className="w-11 h-11 rounded-2xl flex items-center justify-center relative"
        aria-label={app.title}
      >
        <div
          className="w-full h-full rounded-2xl flex items-center justify-center"
          style={{
            background: isActive ? 'linear-gradient(135deg, rgba(var(--os-accent-rgb), 0.35), rgba(var(--os-accent-2-rgb), 0.25))' : 'rgba(255,255,255,0.06)',
            border: `1px solid ${isActive ? 'rgba(var(--os-accent-rgb), 0.4)' : 'var(--surface-border)'}`,
          }}
        >
          <Icon size={19} style={{ color: isActive ? '#fff' : 'var(--text-2)' }} />
        </div>
      </motion.button>
      <div
        className="w-1 h-1 rounded-full mt-1 transition-opacity"
        style={{ background: 'var(--os-accent)', opacity: isOpen ? 1 : 0 }}
      />
    </div>
  );
}
