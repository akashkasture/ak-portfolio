/* Best-effort device-capability probe for the "Auto" quality setting.
   No API gives a single reliable "GPU tier" number across browsers, so
   this combines a few widely-supported, real signals — CPU core count,
   device memory (Chrome/Edge only), and coarse-pointer + narrow-viewport
   as a phone heuristic — into one of the tiers the scene already
   understands. A signal that isn't exposed (e.g. deviceMemory on
   Firefox/Safari) is skipped rather than assumed either way, so this
   degrades to fewer signals rather than a wrong guess. */

export function detectQualityTier() {
  if (typeof navigator === 'undefined' || typeof window === 'undefined') return 'high';

  const cores = navigator.hardwareConcurrency ?? null;
  const memory = navigator.deviceMemory ?? null; // GB
  const isPhoneLike = (window.matchMedia?.('(pointer: coarse)').matches ?? false) && window.innerWidth < 768;

  let tier = 2; // 0 low, 1 medium, 2 high — signals only ever pull this down

  if (cores !== null) {
    if (cores <= 2) tier = Math.min(tier, 0);
    else if (cores <= 4) tier = Math.min(tier, 1);
  }
  if (memory !== null) {
    if (memory <= 2) tier = Math.min(tier, 0);
    else if (memory <= 4) tier = Math.min(tier, 1);
  }
  if (isPhoneLike) tier = Math.min(tier, 1);

  return ['low', 'medium', 'high'][tier];
}

let cachedWebglSupport = null;

export function hasWebGLSupport() {
  if (cachedWebglSupport !== null) return cachedWebglSupport;
  try {
    const canvas = document.createElement('canvas');
    cachedWebglSupport = !!(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch {
    cachedWebglSupport = false;
  }
  return cachedWebglSupport;
}
