import { useEffect, useRef, useState } from 'react';
import { actions, getState } from './store';

/* Play the trace.

   The playhead already exists and already means something — it moves the
   emphasis through the career and names the milestone reached. But it
   was reachable only by dragging a 28px axis strip, which meant most
   visitors never discovered that the page had a time dimension at all.

   So it gets a transport. Pressing play sweeps the playhead from the
   start of the trace to the present at a steady rate, which is the one
   animation on this page that IS the content: six years and eight
   months of work, in six seconds, in order.

   Driven by rAF against a wall clock rather than by frame count, so the
   sweep takes the same six seconds on a 60Hz panel and a 120Hz one.
   Nothing is stored in the trace store except the playhead it was
   already writing — a paused replay leaves the playhead exactly where a
   drag would have left it. */

const SWEEP_MS = 6000;

export function useReplay() {
  const [playing, setPlaying] = useState(false);
  const raf = useRef(0);

  useEffect(() => {
    if (!playing) return undefined;

    /* Start from where the playhead actually is, unless it is already at
       the end — pressing play on a finished trace should replay it, not
       do nothing. */
    const from = getState().playhead >= 0.999 ? 0 : getState().playhead;
    const startedAt = performance.now();
    const span = Math.max(0.001, 1 - from);

    const tick = (now) => {
      const progress = (now - startedAt) / (SWEEP_MS * span);
      if (progress >= 1) {
        actions.setPlayhead(1);
        setPlaying(false);
        return;
      }
      actions.setPlayhead(from + progress * span);
      raf.current = requestAnimationFrame(tick);
    };

    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [playing]);

  /* Grabbing the axis takes the playhead back. A transport that fights
     the user for the control it shares is worse than no transport.

     Scoped to the axis specifically rather than to any pointerdown: a
     blanket listener would also catch the pointerdown that precedes the
     click on the pause button, stopping the replay a moment before the
     click restarted it. */
  useEffect(() => {
    if (!playing) return undefined;
    const stop = (e) => {
      if (e.target.closest?.('[role="slider"]')) setPlaying(false);
    };
    window.addEventListener('pointerdown', stop, true);
    return () => window.removeEventListener('pointerdown', stop, true);
  }, [playing]);

  return [playing, () => setPlaying((v) => !v)];
}
