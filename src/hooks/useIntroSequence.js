import { useEffect, useRef, useState } from 'react';
import { INTRO_DURATION_MS } from '../space/introTimeline';

const SESSION_KEY = 'ak-os-space-intro-seen';

function alreadyPlayedThisSession() {
  try {
    return sessionStorage.getItem(SESSION_KEY) === '1';
  } catch {
    return false;
  }
}

function markPlayed() {
  try {
    sessionStorage.setItem(SESSION_KEY, '1');
  } catch { /* ignore */ }
}

function computeShouldPlay(enabled) {
  if (!enabled) return false;
  const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) return false;
  return !alreadyPlayedThisSession();
}

/* Plays once per browser session (sessionStorage, not localStorage — a
   returning visitor mid-session shouldn't re-sit through a 3.4s reveal on
   every refresh, but a fresh session gets the full cinematic moment). Skips
   straight to the resolved state for prefers-reduced-motion. Whether it
   plays at all is decided once at mount (lazy init, not an effect) so
   toggling the wallpaper later never retroactively triggers a reboot. */
export function useIntroSequence({ enabled = true } = {}) {
  const [shouldPlay] = useState(() => computeShouldPlay(enabled));
  const [t, setT] = useState(() => (shouldPlay ? 0 : 1));
  const [done, setDone] = useState(() => !shouldPlay);
  const rafRef = useRef(null);
  const startRef = useRef(null);

  useEffect(() => {
    if (!shouldPlay) {
      markPlayed();
      return;
    }

    const tick = (now) => {
      if (startRef.current == null) startRef.current = now;
      const progress = Math.min(1, (now - startRef.current) / INTRO_DURATION_MS);
      setT(progress);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setDone(true);
        markPlayed();
      }
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [shouldPlay]);

  const skip = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setT(1);
    setDone(true);
    markPlayed();
  };

  return { t, done, skip };
}
