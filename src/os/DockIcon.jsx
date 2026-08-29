import { useRef, useState } from 'react';
import { AnimatePresence, motion, useSpring, useTransform } from 'framer-motion';
import { T } from './motion';

/* A dock icon that magnifies the way the macOS one does.

   The previous version animated the icon's width *and* height as real
   layout, inside a flex row with `items-end` — so an enlarged icon grew
   the row's content box and the whole bar got taller on hover. A dock
   that changes height as the cursor crosses it is the single clearest
   tell of a toy dock.

   The fix is the one the real dock uses: the bar's height is fixed, and
   an icon grows *upward out of it*, anchored to the baseline all the
   icons sit on. Only the wrapper's width is animated as layout, so
   neighbours still slide apart horizontally to make room, while nothing
   the icon does can affect the bar's height.

   `slot` is the fixed cross-axis extent that reserves the bar's height;
   `size` is the animated one that overflows it. */

const MAX_SCALE = 1.55;

export default function DockIcon({
  app, isOpen, isActive, mousePos, onClick,
  baseSize = 48, magnify = true, position = 'bottom', dotStrip = 9,
}) {
  const ref = useRef(null);
  const [hovered, setHovered] = useState(false);
  const Icon = app.icon;
  const [c1, c2] = app.tint || ['#6366f1', '#8b5cf6'];
  const horizontal = position === 'bottom';

  const distance = useTransform(mousePos, (val) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect || val === Infinity) return Infinity;
    const center = horizontal ? rect.left + rect.width / 2 : rect.top + rect.height / 2;
    return val - center;
  });

  /* A cosine falloff rather than a three-stop linear ramp. The linear
     version had a visible kink exactly at the cursor, which is where the
     eye is — the curve is smooth all the way out to the influence edge. */
  const influence = baseSize * 2.6;
  const sizeTarget = useTransform(distance, (d) => {
    if (!magnify || d === Infinity) return baseSize;
    const x = Math.min(Math.abs(d) / influence, 1);
    const falloff = (Math.cos(x * Math.PI) + 1) / 2;
    return baseSize + baseSize * (MAX_SCALE - 1) * falloff;
  });
  const size = useSpring(sizeTarget, { mass: 0.1, stiffness: 320, damping: 22 });

  // The tooltip has to clear the icon's *current* height, not its base.
  const tipOffset = useTransform(size, (s) => s + dotStrip + 10);

  const along = horizontal ? { width: size } : { height: size };
  const across = horizontal ? { height: baseSize + dotStrip } : { width: baseSize + dotStrip };

  return (
    <motion.div className="relative flex-shrink-0" style={{ ...along, ...across }}>
      <AnimatePresence>
        {hovered && (
          <motion.div
            className="absolute px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap z-10 pointer-events-none"
            style={
              horizontal
                ? { bottom: tipOffset, left: '50%', translateX: '-50%',
                    background: 'rgba(18,18,26,0.94)', border: '1px solid rgba(255,255,255,0.1)',
                    color: '#e2e8f0', boxShadow: '0 6px 20px rgba(0,0,0,0.5)' }
                : { left: tipOffset, top: '50%', translateY: '-50%',
                    background: 'rgba(18,18,26,0.94)', border: '1px solid rgba(255,255,255,0.1)',
                    color: '#e2e8f0', boxShadow: '0 6px 20px rgba(0,0,0,0.5)' }
            }
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.94 }}
            transition={T.fast}
          >
            {app.title}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Anchored to the baseline every icon shares, so growth goes up and
          out of the bar instead of pushing the bar taller. */}
      <motion.button
        ref={ref}
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        aria-label={app.title}
        className="absolute"
        style={
          horizontal
            ? { width: size, height: size, bottom: dotStrip, left: '50%', translateX: '-50%', transformOrigin: 'bottom center' }
            : { width: size, height: size, right: dotStrip, top: '50%', translateY: '-50%', transformOrigin: 'center right' }
        }
        whileTap={{ scale: 0.9 }}
      >
        <div
          className="w-full h-full rounded-[26%] flex items-center justify-center"
          style={{
            /* Two stops one shade apart read as a flat slab of colour at
               48px. The tint gradient stays, but a bottom-weighted shade
               is laid over it so each icon is lit from above and falls off
               into its lower edge — the tonal range current macOS icons
               have. Deliberately *not* a white wash over the top half:
               that's the 2010 gel-button look, and it was most of why the
               dock read as a toy. Dark-only shading never reads as gloss. */
            background: [
              'linear-gradient(180deg, rgba(0,0,0,0) 38%, rgba(0,0,0,0.24))',
              `linear-gradient(160deg, ${c1}, ${c2})`,
            ].join(', '),
            /* One hairline highlight and a real shadow. */
            boxShadow: [
              'inset 0 0.5px 0 rgba(255,255,255,0.30)',
              'inset 0 -0.5px 0 rgba(0,0,0,0.22)',
              '0 1px 2px rgba(0,0,0,0.30)',
              '0 6px 14px -6px rgba(0,0,0,0.55)',
            ].join(', '),
          }}
        >
          <Icon
            style={{
              width: '48%', height: '48%',
              color: app.iconColor || '#fff',
              filter: 'drop-shadow(0 1px 1.5px rgba(0,0,0,0.3))',
            }}
          />
        </div>
      </motion.button>

      {/* Running indicator, on the strip the bar reserves beneath the icons. */}
      <div
        className="absolute rounded-full"
        style={{
          width: 3.5, height: 3.5,
          background: isActive ? 'var(--os-accent)' : 'rgba(255,255,255,0.6)',
          opacity: isOpen ? 1 : 0,
          transition: 'opacity var(--dur-base) var(--ease-standard), background var(--dur-base) var(--ease-standard)',
          ...(horizontal
            ? { bottom: Math.round(dotStrip / 2) - 2, left: '50%', transform: 'translateX(-50%)' }
            : { right: Math.round(dotStrip / 2) - 2, top: '50%', transform: 'translateY(-50%)' }),
        }}
      />
    </motion.div>
  );
}
