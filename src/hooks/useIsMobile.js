import { useEffect, useState } from 'react';

/* A phone in landscape is still a phone — 844px wide passes a naive
   width test and would hand a thumb the whole desktop window manager.
   So a coarse pointer counts too, up to tablet width. */
const NARROW = '(max-width: 767px)';
const TOUCH_LANDSCAPE = '(pointer: coarse) and (max-width: 1023px)';

function check() {
  return window.matchMedia(NARROW).matches || window.matchMedia(TOUCH_LANDSCAPE).matches;
}

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(check);

  useEffect(() => {
    const queries = [window.matchMedia(NARROW), window.matchMedia(TOUCH_LANDSCAPE)];
    const onChange = () => setIsMobile(check());
    queries.forEach((q) => q.addEventListener('change', onChange));
    return () => queries.forEach((q) => q.removeEventListener('change', onChange));
  }, []);

  return isMobile;
}
