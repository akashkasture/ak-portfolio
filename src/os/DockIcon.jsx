import { useRef, useState } from 'react';
import { AnimatePresence, motion, useSpring, useTransform } from 'framer-motion';

const TOOLTIP_POS = {
  bottom: { wrap: '-top-11 left-1/2 -translate-x-1/2', enter: { y: 6 } },
  left: { wrap: 'left-full top-1/2 -translate-y-1/2 ml-3', enter: { x: -6 } },
  right: { wrap: 'right-full top-1/2 -translate-y-1/2 mr-3', enter: { x: 6 } },
};

export default function DockIcon({ app, isOpen, isActive, mousePos, onClick, baseSize = 48, magnify = true, position = 'bottom' }) {
  const ref = useRef(null);
  const [hovered, setHovered] = useState(false);
  const Icon = app.icon;
  const [c1, c2] = app.tint || ['#6366f1', '#8b5cf6'];
  const horizontal = position === 'bottom';
  const tooltip = TOOLTIP_POS[position] || TOOLTIP_POS.bottom;

  const distance = useTransform(mousePos, (val) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect || val === Infinity) return Infinity;
    const center = horizontal ? rect.left + rect.width / 2 : rect.top + rect.height / 2;
    return val - center;
  });

  // Magnification grows the icon's real layout size (not a transform), so flexbox
  // pushes neighbours apart and the enlarged icon never overlaps them — same
  // approach as the actual macOS dock.
  const range = baseSize * 3;
  const sizeTarget = useTransform(
    distance,
    [-range, 0, range],
    [baseSize, magnify ? baseSize * 1.6 : baseSize, baseSize]
  );
  const size = useSpring(sizeTarget, { mass: 0.12, stiffness: 260, damping: 18 });

  return (
    <div className={`relative flex ${horizontal ? 'flex-col' : 'flex-row'} items-center`}>
      <AnimatePresence>
        {hovered && (
          <motion.div
            className={`absolute ${tooltip.wrap} px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap z-10`}
            style={{
              background: 'rgba(15,15,24,0.92)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#e2e8f0',
              backdropFilter: 'blur(16px)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.45)',
            }}
            initial={{ opacity: 0, scale: 0.9, ...tooltip.enter }}
            animate={{ opacity: 1, scale: 1, x: tooltip.enter.x ? 0 : undefined, y: tooltip.enter.y ? 0 : undefined }}
            exit={{ opacity: 0, scale: 0.9, ...tooltip.enter }}
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
        style={{ width: size, height: size }}
        whileTap={{ scale: 0.92 }}
        className="relative flex-shrink-0"
        aria-label={app.title}
      >
        <div
          className="w-full h-full rounded-[30%] flex items-center justify-center relative overflow-hidden"
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
          <div
            className="absolute inset-x-0 top-0 h-1/2 pointer-events-none"
            style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.22), rgba(255,255,255,0.02))' }}
          />
          <Icon
            style={{ width: '46%', height: '46%', color: app.iconColor || '#fff', position: 'relative', filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.35))' }}
          />
        </div>
      </motion.button>
      <div
        className={`w-1 h-1 rounded-full transition-all duration-300 flex-shrink-0 ${horizontal ? 'mt-1.5' : 'ml-1.5'}`}
        style={{
          background: isActive ? 'var(--os-accent)' : 'rgba(255,255,255,0.55)',
          boxShadow: isActive ? '0 0 6px var(--os-accent)' : 'none',
          opacity: isOpen ? 1 : 0,
        }}
      />
    </div>
  );
}
