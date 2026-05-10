import { useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const SPRING = { stiffness: 260, damping: 22, mass: 0.6 };

export default function MagneticButton({ children, strength = 0.35, className = '', style = {}, ...rest }) {
  const ref = useRef(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, SPRING);
  const y = useSpring(rawY, SPRING);

  function onMove(e) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    rawX.set((e.clientX - cx) * strength);
    rawY.set((e.clientY - cy) * strength);
  }

  function onLeave() {
    rawX.set(0);
    rawY.set(0);
  }

  return (
    <motion.div
      ref={ref}
      style={{ x, y, display: 'inline-block', ...style }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
