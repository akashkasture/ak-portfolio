import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function CursorGlow() {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const move = (e) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-30 rounded-full"
      style={{
        width: 500,
        height: 500,
        background: 'radial-gradient(circle, rgba(99,102,241,0.13) 0%, rgba(124,58,237,0.05) 40%, transparent 70%)',
        translateX: pos.x - 250,
        translateY: pos.y - 250,
      }}
      animate={{ translateX: pos.x - 250, translateY: pos.y - 250 }}
      transition={{ type: 'spring', stiffness: 80, damping: 30, mass: 0.5 }}
    />
  );
}
