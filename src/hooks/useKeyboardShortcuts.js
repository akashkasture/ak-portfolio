import { useEffect, useRef } from 'react';
import { SHORTCUTS } from '../os/shortcuts';
import { trackEvent } from '../utils/analytics';

/* Runs the bindings declared in os/shortcuts.js.

   The guard below matters more than the dispatch does: this OS contains a
   Terminal with a text input and a contact form, and a global handler that
   swallowed "m" or "w" while someone was typing an email address would be
   worse than having no shortcuts at all. */
function isTyping(target) {
  if (!target) return false;
  const tag = target.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target.isContentEditable;
}

export function useKeyboardShortcuts(api) {
  // The window-manager context hands back a new object every render, so the
  // listener reads through a ref and stays bound for the life of the desktop.
  const apiRef = useRef(api);
  useEffect(() => { apiRef.current = api; });

  useEffect(() => {
    const onKeyDown = (e) => {
      if (isTyping(e.target)) return;
      for (const s of SHORTCUTS) {
        if (s.passive || !s.match(e)) continue;
        e.preventDefault();
        s.run(apiRef.current, e);
        trackEvent('keyboard_shortcut', { shortcut: s.id });
        return;
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);
}
