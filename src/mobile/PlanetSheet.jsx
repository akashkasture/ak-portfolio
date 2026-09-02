import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { DIAMETER_SCALE, DISTANCE_SCALE } from '../space/scale';

/* What a phone can do that the desktop wallpaper cannot.

   On a desktop the solar system is scenery behind windows, so tapping a
   planet gets a small card of figures. On a phone the scene is the
   screen, which makes room for the part the model itself gets wrong:
   the bodies in view are far too large for their orbits and the orbits
   far too small, because a truthful arrangement doesn't fit on any
   screen ever made.

   So the sheet draws the real proportions next to the fake ones. Every
   planet stays on both charts with the selected one picked out, because
   a single bar communicates nothing — "Mercury is 3% of Jupiter" only
   lands when Jupiter is next to it. */

function ScaleChart({ title, rows, activeId, note }) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3 mb-2">
        <span
          className="text-[10px] font-mono uppercase tracking-[0.14em]"
          style={{ color: 'var(--text-4)' }}
        >
          {title}
        </span>
        <span className="text-[10.5px]" style={{ color: 'var(--text-4)' }}>{note}</span>
      </div>
      <div className="space-y-[3px]">
        {rows.map((row) => {
          const active = row.id === activeId;
          return (
            <div key={row.id} className="flex items-center gap-2">
              <span
                className="w-[52px] flex-shrink-0 text-[10.5px] truncate"
                style={{ color: active ? 'var(--text-1)' : 'var(--text-4)' }}
              >
                {row.name}
              </span>
              <span className="relative flex-1 h-[9px] min-w-0">
                <span
                  className="absolute inset-y-0 left-0 rounded-[2px]"
                  style={{
                    /* Never rounded up to a visible minimum: a bar that
                       has to be faked to be seen is the whole reason
                       this chart exists. */
                    width: `${row.fraction * 100}%`,
                    background: row.color,
                    opacity: active ? 1 : 0.34,
                  }}
                />
              </span>
              <span
                className="w-[68px] flex-shrink-0 text-right text-[10px] font-mono tabular-nums"
                style={{ color: active ? 'var(--text-2)' : 'var(--text-4)' }}
              >
                {row.label.replace(' km', '')}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div>
      <div
        className="text-[9px] font-mono uppercase tracking-[0.14em]"
        style={{ color: 'var(--text-4)' }}
      >
        {label}
      </div>
      <div className="text-[13.5px] font-semibold mt-0.5" style={{ color: 'var(--text-1)' }}>
        {value}
      </div>
    </div>
  );
}

export default function PlanetSheet({ planet, onClose }) {
  return (
    <AnimatePresence>
      {planet && (
        <motion.div
          className="absolute inset-x-0 bottom-0 z-30 pointer-events-auto"
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', stiffness: 320, damping: 34 }}
          role="dialog"
          aria-label={`${planet.name} — figures`}
        >
          <div
            className="rounded-t-2xl overflow-hidden"
            style={{
              /* Opaque. The scene is bright and moving; laying type over
                 it directly is the one place glass genuinely fails. */
              background: 'linear-gradient(var(--surface), var(--surface)), var(--bg)',
              borderTop: '1px solid var(--surface-border)',
              boxShadow: '0 -24px 60px rgba(0,0,0,0.55)',
            }}
          >
            <div
              className="flex items-center gap-2.5 px-5 pt-4 pb-3.5"
              style={{ borderBottom: '1px solid var(--surface-border)' }}
            >
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ background: planet.color }}
              />
              <div className="min-w-0">
                <div className="text-[15px] font-semibold leading-tight" style={{ color: 'var(--text-1)' }}>
                  {planet.name}
                </div>
                <div className="text-[10.5px] font-mono" style={{ color: 'var(--text-4)' }}>
                  {planet.type}
                </div>
              </div>
              <button
                onClick={onClose}
                aria-label="Close"
                className="ml-auto p-2 -mr-2 rounded-md"
                style={{ color: 'var(--text-3)' }}
              >
                <X size={17} />
              </button>
            </div>

            <div
              className="overflow-y-auto overscroll-contain"
              style={{ maxHeight: '52vh' }}
            >
              <div className="grid grid-cols-2 gap-x-4 gap-y-3.5 px-5 py-4">
                <Stat label="Diameter" value={planet.diameterKm} />
                <Stat label="Distance from Sun" value={planet.distanceFromSun} />
                <Stat label="Moons" value={planet.moons} />
                <Stat label="Orbital period" value={planet.orbitalPeriod} />
              </div>

              <div
                className="px-5 py-4 space-y-5"
                style={{ borderTop: '1px solid var(--surface-border)' }}
              >
                <ScaleChart
                  title="Diameter, to scale"
                  rows={DIAMETER_SCALE}
                  activeId={planet.id}
                  note="Jupiter = full width"
                />
                <ScaleChart
                  title="Distance from the Sun, to scale"
                  rows={DISTANCE_SCALE}
                  activeId={planet.id}
                  note="Neptune = full width"
                />
                <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-4)' }}>
                  The scene above is compressed so eight orbits fit on a phone. These
                  two charts are not: the bars are the real figures, drawn linearly.
                  Figures from the NASA planetary fact sheet.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
