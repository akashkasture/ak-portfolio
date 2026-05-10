import { motion } from 'framer-motion';
import { Zap, Lock, TrendingUp, Brain } from 'lucide-react';

const PACKETS = [
  {
    label: 'Kafka Event',
    icon: Zap,
    color: '#6366f1',
    top: '12%',
    right: '0%',
    delay: 0,
    floatY: [-8, 8],
  },
  {
    label: 'Redis Lock',
    icon: Lock,
    color: '#10b981',
    top: '36%',
    right: '2%',
    delay: 0.7,
    floatY: [6, -10],
  },
  {
    label: 'Trade Signal',
    icon: TrendingUp,
    color: '#f59e0b',
    top: '60%',
    right: '1%',
    delay: 1.3,
    floatY: [-6, 8],
  },
  {
    label: 'AI Response',
    icon: Brain,
    color: '#a855f7',
    top: '82%',
    right: '3%',
    delay: 1.9,
    floatY: [8, -6],
  },
];

export default function DataPackets() {
  return (
    <div className="absolute inset-0 pointer-events-none hidden lg:block">
      {PACKETS.map((pkt) => {
        const Icon = pkt.icon;
        return (
          <motion.div
            key={pkt.label}
            className="absolute flex items-center gap-2 px-3 py-2 rounded-xl"
            style={{
              top: pkt.top,
              right: pkt.right,
              background: `${pkt.color}12`,
              border: `1px solid ${pkt.color}40`,
              backdropFilter: 'blur(8px)',
              boxShadow: `0 0 24px ${pkt.color}20`,
            }}
            initial={{ opacity: 0, x: 30 }}
            animate={{
              opacity: [0, 1, 1],
              x: [30, 0, 0],
              y: pkt.floatY,
            }}
            transition={{
              opacity: { delay: pkt.delay + 0.5, duration: 0.5 },
              x: { delay: pkt.delay + 0.5, duration: 0.5 },
              y: { delay: pkt.delay + 1, duration: 4 + pkt.delay, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' },
            }}
          >
            {/* Pulsing status dot */}
            <motion.div
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ background: pkt.color }}
              animate={{ opacity: [1, 0.3, 1], scale: [1, 1.4, 1] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            />
            <Icon size={11} style={{ color: pkt.color }} />
            <span className="text-[10px] font-mono font-semibold" style={{ color: pkt.color }}>
              {pkt.label}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}
