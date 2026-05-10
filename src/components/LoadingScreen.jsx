import { motion } from 'framer-motion';

export default function LoadingScreen() {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050816]"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative mb-8">
        <motion.div
          className="w-20 h-20 rounded-2xl border-2 border-indigo-500/30 flex items-center justify-center"
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        >
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-600 to-cyan-500 flex items-center justify-center">
            <span className="text-white font-bold text-2xl font-mono">AK</span>
          </div>
        </motion.div>
        <motion.div
          className="absolute inset-0 rounded-2xl"
          style={{
            boxShadow: '0 0 30px rgba(99,102,241,0.5)',
          }}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>

      <div className="flex gap-1 mb-4">
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            className="w-1.5 h-6 rounded-full bg-indigo-500"
            animate={{ scaleY: [0.4, 1, 0.4] }}
            transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.1 }}
          />
        ))}
      </div>

      <motion.p
        className="text-slate-400 text-sm font-mono tracking-widest"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        INITIALIZING...
      </motion.p>
    </motion.div>
  );
}
