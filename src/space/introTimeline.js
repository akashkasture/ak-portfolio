/* Boot-reveal choreography for the solar-system wallpaper: stars appear,
   nebula fades in, the black hole and sun materialize, planets pop in
   (in real orbital order out from the sun), then orbital motion ramps up.
   Everything here is driven by a single 0-1 progress value (`t`) advanced
   by useIntroSequence — no per-layer timers to keep in sync by hand. */

export const INTRO_DURATION_MS = 3400;

export const STAGES = {
  curtain: [0, 0.12],
  nebula: [0.1, 0.34],
  blackHole: [0.3, 0.5],
  sun: [0.44, 0.62],
  planets: [0.6, 0.86],
  orbitStart: [0.82, 1],
};

export function remap01(t, a, b) {
  if (b <= a) return t >= b ? 1 : 0;
  return Math.min(1, Math.max(0, (t - a) / (b - a)));
}

export function easeOutCubic(x) {
  return 1 - (1 - x) ** 3;
}

export function planetRevealWindow(index) {
  const [start, end] = STAGES.planets;
  const span = end - start;
  const staggerStep = span / 10;
  const windowSize = span * 0.4;
  const winStart = Math.min(start + index * staggerStep, end - windowSize);
  return [winStart, winStart + windowSize];
}
