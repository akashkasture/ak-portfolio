import { AnimatePresence, motion } from 'framer-motion';

export default function PlanetInfoPanel({ planet }) {
  return (
    <div className="fixed bottom-6 left-6 z-10 pointer-events-none hidden md:block">
      <AnimatePresence mode="wait">
        {planet && (
          <motion.div
            key={planet.id}
            initial={{ opacity: 0, y: 10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.97 }}
            transition={{ duration: 0.18 }}
            className="w-56 rounded-2xl overflow-hidden dock-glass"
          >
            <div className="px-4 pt-3.5 pb-3">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: planet.color }} />
                <span className="text-sm font-bold tracking-wide" style={{ color: 'var(--text-1)' }}>{planet.name.toUpperCase()}</span>
              </div>
              <span className="text-[10px] font-mono" style={{ color: 'var(--text-4)' }}>{planet.type}</span>
            </div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-2 px-4 pb-3.5 pt-2" style={{ borderTop: '1px solid var(--surface-border)' }}>
              <Stat label="Distance" value={planet.distanceFromSun} />
              <Stat label="Diameter" value={planet.diameterKm} />
              <Stat label="Moons" value={planet.moons} />
              <Stat label="Orbit" value={planet.orbitalPeriod} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div>
      <div className="text-[9px] font-mono uppercase tracking-widest" style={{ color: 'var(--text-4)' }}>{label}</div>
      <div className="text-[12px] font-semibold mt-0.5" style={{ color: 'var(--text-2)' }}>{value}</div>
    </div>
  );
}
