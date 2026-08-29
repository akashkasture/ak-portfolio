/* GA is loaded from here rather than from an inline <script> in index.html.

   That inline block was the one thing standing between this site and a real
   Content-Security-Policy: allowing it meant script-src 'unsafe-inline',
   which permits every injected <script> an XSS would want to run and
   effectively turns the policy off. Loading the tag from a module means the
   policy can name googletagmanager.com and forbid inline script outright.

   No measurement ID configured (a fork, a local checkout without .env) is a
   no-op, not a broken page: nothing is injected and trackEvent stays silent. */

const GA_ID = import.meta.env.VITE_GA_ID;

export function initAnalytics() {
  if (typeof window === 'undefined') return;
  if (!GA_ID || GA_ID.startsWith('G-XXXX')) return;

  window.dataLayer = window.dataLayer || [];
  // gtag must forward `arguments` verbatim, so this stays a function
  // declaration rather than an arrow.
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;

  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`;
  document.head.appendChild(s);

  gtag('js', new Date());
  gtag('config', GA_ID);
}

export function trackEvent(name, params = {}) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', name, params);
  }
}
