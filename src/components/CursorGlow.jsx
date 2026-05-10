import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function CursorGlow() {
  const [pos, setPos] = useState({ x: -1000, y: -1000 });

  useEffect(() => {
    const onMouse = (e) => setPos({ x: e.clientX, y: e.clientY });
    const onTouch = (e) => {
      if (e.touches[0]) setPos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    };
    window.addEventListener('mousemove', onMouse);
    window.addEventListener('touchmove', onTouch, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('touchmove', onTouch);
    };
  }, []);

  return (
    <>
      {/* Cursor / touch-tracking glow */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-30 rounded-full"
        style={{
          width: 500,
          height: 500,
          background: 'radial-gradient(circle, rgba(99,102,241,0.13) 0%, rgba(124,58,237,0.05) 40%, transparent 70%)',
        }}
        animate={{ translateX: pos.x - 250, translateY: pos.y - 250 }}
        transition={{ type: 'spring', stiffness: 80, damping: 30, mass: 0.5 }}
      />

      {/* Mobile-only ambient orbs — pulse independently since cursor tracking doesn't exist on touch */}
      <motion.div
        className="fixed pointer-events-none z-20 rounded-full md:hidden"
        style={{
          width: 320,
          height: 320,
          background: 'radial-gradient(circle, rgba(99,102,241,0.18) 0%, rgba(124,58,237,0.08) 40%, transparent 70%)',
          top: '8%',
          left: '50%',
          marginLeft: -160,
        }}
        animate={{ y: [0, -30, 0], scale: [1, 1.14, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="fixed pointer-events-none z-20 rounded-full md:hidden"
        style={{
          width: 240,
          height: 240,
          background: 'radial-gradient(circle, rgba(6,182,212,0.15) 0%, transparent 70%)',
          bottom: '18%',
          right: '-30px',
        }}
        animate={{ y: [0, 24, 0], scale: [1, 1.1, 1], opacity: [0.45, 0.9, 0.45] }}
        transition={{ duration: 6, delay: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="fixed pointer-events-none z-20 rounded-full md:hidden"
        style={{
          width: 190,
          height: 190,
          background: 'radial-gradient(circle, rgba(168,85,247,0.14) 0%, transparent 70%)',
          top: '48%',
          left: '-20px',
        }}
        animate={{ y: [0, -18, 0], scale: [1, 1.09, 1], opacity: [0.4, 0.85, 0.4] }}
        transition={{ duration: 8, delay: 1.2, repeat: Infinity, ease: 'easeInOut' }}
      />
    </>
  );
}
