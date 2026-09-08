import { Suspense, lazy, useEffect, useMemo, useRef, useState } from 'react';
import { detectQualityTier, hasWebGLSupport } from '../../space/detectQuality';
import { useTrace, actions } from '../state/store';
import Waterfall from '../dom/Waterfall';
import { trackEvent } from '../../utils/analytics';

const TraceScene = lazy(() => import('../scene/TraceScene'));

/* The 3D layer, and the rules it lives under.

   It is an upgrade over the waterfall, never a replacement for it. The
   flat trace has already rendered and is already readable by the time
   anything here loads; turning this on adds the third axis, and turning
   it off — or never being able to turn it on — costs no information.

   Two things follow from that, and both are load-bearing:

   1. R3F is ~864 kB. It is behind `lazy` and behind an explicit click,
      so a visitor who only wants to read the trace never pays for it.
   2. When the scene is on, the DOM tree stays mounted and reachable —
      visually hidden, but focusable and in the accessibility tree. A
      canvas is not keyboard navigable and never will be, so the real
      tree has to remain the thing a keyboard or screen reader drives.
      This is what "no information may live only inside WebGL" means in
      practice, rather than as an aspiration. */

const PROJECTIONS = [
  { value: 0, label: 'Waterfall', hint: 'time' },
  { value: 1, label: 'Service map', hint: 'topology' },
];

export default function SpatialTrace() {
  const state = useTrace();
  const [on, setOn] = useState(false);
  const dragRef = useRef(null);

  const supported = useMemo(() => hasWebGLSupport(), []);
  const quality = useMemo(() => detectQualityTier(), []);
  const reduced = useMemo(
    () =>
      typeof window !== 'undefined' &&
      (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false),
    []
  );

  /* Dragging left/right walks the camera along the 90° arc. It is
     deliberately not bound to scroll: scroll already moves the playhead,
     and one gesture driving two axes is how scroll-jacked pages come to
     feel broken. */
  useEffect(() => {
    if (!on) return;
    const el = dragRef.current;
    if (!el) return;
    let startX = 0;
    let startProjection = 0;
    let dragging = false;

    const down = (e) => {
      dragging = true;
      startX = e.clientX;
      startProjection = state.projection;
    };
    const move = (e) => {
      if (!dragging) return;
      const width = el.getBoundingClientRect().width || 1;
      actions.setProjection(startProjection + (e.clientX - startX) / width);
    };
    const up = () => { dragging = false; };

    el.addEventListener('pointerdown', down);
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    return () => {
      el.removeEventListener('pointerdown', down);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
  }, [on, state.projection]);

  const toggle = () => {
    const next = !on;
    setOn(next);
    trackEvent('trace_spatial', { on: next, quality });
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        {supported ? (
          <button
            onClick={toggle}
            aria-pressed={on}
            className="px-2.5 py-1 rounded text-[11.5px] font-mono"
            style={{
              color: on ? '#fff' : 'var(--text-2)',
              background: on ? 'var(--os-accent)' : 'transparent',
              border: `1px solid ${on ? 'var(--os-accent)' : 'var(--surface-border)'}`,
            }}
          >
            {on ? 'spatial · on' : 'spatial'}
          </button>
        ) : (
          // Never "your browser doesn't support WebGL". The trace is
          // complete without it; there is simply nothing to offer.
          <span className="text-[11.5px] font-mono" style={{ color: 'var(--text-4)' }}>
            flat view
          </span>
        )}

        {on &&
          PROJECTIONS.map((p) => {
            const active = Math.round(state.projection) === p.value;
            return (
              <button
                key={p.label}
                onClick={() => actions.setProjection(p.value)}
                aria-pressed={active}
                className="px-2.5 py-1 rounded text-[11.5px] font-mono"
                style={{
                  color: active ? 'var(--text-1)' : 'var(--text-3)',
                  border: `1px solid ${active ? 'var(--surface-border)' : 'transparent'}`,
                  background: active ? 'var(--surface-alt)' : 'transparent',
                }}
              >
                {p.label}
                <span style={{ color: 'var(--text-4)' }}> · {p.hint}</span>
              </button>
            );
          })}
      </div>

      {on ? (
        <>
          <div
            ref={dragRef}
            className="relative w-full rounded-lg overflow-hidden cursor-grab active:cursor-grabbing touch-none"
            /* Wide on purpose. The waterfall is 46 units of time by ten
               of depth, so the camera distance is solved from the width
               every time — which means extra canvas height buys dead
               space above and below the field rather than a bigger
               field. A little taller than it was, because the service
               map at the other end of the arc is the opposite shape. */
            style={{ height: 'clamp(380px, 50vh, 560px)', border: '1px solid var(--surface-border)' }}
          >
            <Suspense
              fallback={
                <div className="absolute inset-0 grid place-items-center">
                  <span className="text-[11.5px] font-mono" style={{ color: 'var(--text-4)' }}>
                    loading scene…
                  </span>
                </div>
              }
            >
              <TraceScene quality={quality} reduced={reduced} />
            </Suspense>
          </div>
          <p className="text-[11.5px] mt-2" style={{ color: 'var(--text-4)' }}>
            Drag to rotate between time and topology. The camera is locked to that
            arc, so there is nowhere to get lost.
          </p>

          {/* Still the real tree: hidden from sight, present for keyboard
              and screen readers, because the canvas is neither. */}
          <div
            aria-label="Trace, text view"
            style={{
              position: 'absolute',
              width: 1,
              height: 1,
              overflow: 'hidden',
              clip: 'rect(0 0 0 0)',
              clipPath: 'inset(50%)',
              whiteSpace: 'nowrap',
            }}
          >
            <Waterfall />
          </div>
        </>
      ) : (
        <Waterfall />
      )}
    </div>
  );
}
