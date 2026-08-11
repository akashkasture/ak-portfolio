import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

export default function PlanetDetailOverlay({ planet, onClose }) {
  return (
    <AnimatePresence>
      {planet && (
        <motion.div
          className="fixed inset-0 z-20 flex items-end md:items-center justify-center md:justify-end p-4 md:p-10 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="w-full md:w-80 rounded-3xl overflow-hidden dock-glass pointer-events-auto"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 260, damping: 26 }}
          >
            <div className="px-5 pt-5 pb-4" style={{ borderBottom: '1px solid var(--surface-border)' }}>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: planet.color, boxShadow: `0 0 10px ${planet.color}` }} />
                <span className="text-lg font-bold tracking-wide" style={{ color: 'var(--text-1)' }}>{planet.name}</span>
              </div>
              <span className="text-xs font-mono" style={{ color: 'var(--text-4)' }}>{planet.type}</span>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-3 px-5 py-4">
              <Stat label="Distance from Sun" value={planet.distanceFromSun} />
              <Stat label="Diameter" value={planet.diameterKm} />
              <Stat label="Moons" value={planet.moons} />
              <Stat label="Orbital Period" value={planet.orbitalPeriod} />
            </div>

            <div className="px-5 pb-5">
              <button
                onClick={onClose}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-sm font-semibold transition-colors"
                style={{ background: 'var(--os-accent)', color: '#fff' }}
              >
                <ArrowLeft size={15} /> Return to Desktop
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Stat({ label, value }) {
  return (
    <div>
      <div className="text-[9px] font-mono uppercase tracking-widest" style={{ color: 'var(--text-4)' }}>{label}</div>
      <div className="text-sm font-semibold mt-0.5" style={{ color: 'var(--text-2)' }}>{value}</div>
    </div>
  );
}
