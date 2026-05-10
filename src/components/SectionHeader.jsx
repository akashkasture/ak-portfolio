import { motion } from 'framer-motion';

export default function SectionHeader({ label, title, highlight, description }) {
  return (
    <motion.div
      className="text-center mb-16 md:mb-20 pt-4"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono tracking-widest uppercase mb-5"
        style={{
          background: 'rgba(16,185,129,0.08)',
          border: '1px solid rgba(16,185,129,0.25)',
          color: '#34d399',
        }}
      >
        <span
          className="w-1.5 h-1.5 rounded-full animate-pulse"
          style={{ background: '#10b981', boxShadow: '0 0 6px #10b981' }}
        />
        {label}
      </div>
      <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
        {title}{' '}
        {highlight && (
          <span
            style={{
              background: 'linear-gradient(135deg, #7c3aed, #06b6d4, #a855f7)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {highlight}
          </span>
        )}
      </h2>
      {description && (
        <p className="mt-4 text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
          {description}
        </p>
      )}
    </motion.div>
  );
}
