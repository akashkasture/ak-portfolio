/* The CSS tokens in index.css (--dur-*, --ease-*) govern anything that
   animates in a stylesheet. This is the same set of numbers in the shape
   framer-motion wants, so JS and CSS animate at matching speeds.

   Two sources for one value is how they drift apart, so nothing here
   invents a fourth speed: if an interaction seems to need one, it's
   usually the wrong speed rather than a missing token.

   Ambient loops are deliberately absent. A duration measured in seconds
   is not interface feedback, and this file only describes feedback. */

export const DUR = {
  fast: 0.12,  // acknowledgement — hover, tab, chip, tooltip
  base: 0.2,   // the default: panels, popovers, list transitions
  slow: 0.32,  // something entering or leaving the whole screen
};

export const EASE = {
  standard: [0.2, 0, 0.2, 1],   // moving or leaving
  out:      [0.16, 1, 0.3, 1],  // entering: fast to start, settles gently
};

/* The three transitions that cover nearly every case, so call sites read
   as intent rather than as numbers. */
export const T = {
  fast:  { duration: DUR.fast, ease: EASE.standard },
  base:  { duration: DUR.base, ease: EASE.standard },
  slow:  { duration: DUR.slow, ease: EASE.out },
  enter: { duration: DUR.base, ease: EASE.out },
};
