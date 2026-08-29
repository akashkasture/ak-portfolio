import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { SHORTCUTS, SHORTCUT_GROUPS } from './shortcuts';
import { T } from './motion';

/* Prints the bindings straight out of the same array that executes them,
   so this can't describe a shortcut the OS doesn't actually have. */

function Keys({ keys }) {
  return (
    <span className="flex items-center gap-1">
      {keys.map((k, i) => (
        <kbd
          key={i}
          className="px-1.5 py-0.5 rounded text-[11px] font-mono"
          style={{
            background: 'rgba(255,255,255,0.07)',
            color: 'var(--text-2)',
            border: '1px solid var(--surface-border)',
          }}
        >
          {k}
        </kbd>
      ))}
    </span>
  );
}

export default function ShortcutsOverlay() {
  const [open, setOpen] = useState(false);
  const closeRef = useRef(null);
  const restoreRef = useRef(null);

  useEffect(() => {
    const show = () => {
      restoreRef.current = document.activeElement;
      setOpen(true);
    };
    window.addEventListener('ak-os:show-shortcuts', show);
    return () => window.removeEventListener('ak-os:show-shortcuts', show);
  }, []);

  const close = () => {
    setOpen(false);
    restoreRef.current?.focus?.();
    restoreRef.current = null;
  };

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
      } else if (e.key === 'Tab') {
        // Close is the only control in here.
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={T.fast}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={close} />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Keyboard shortcuts"
            className="relative w-full max-w-md rounded-2xl overflow-hidden glass-strong"
            style={{ border: '1px solid var(--nav-border)' }}
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={T.enter}
          >
            <div
              className="flex items-center justify-between px-5 py-3.5"
              style={{ borderBottom: '1px solid var(--surface-border)' }}
            >
              <h2 className="text-[13px] font-medium" style={{ color: 'var(--text-1)' }}>
                Keyboard shortcuts
              </h2>
              <button
                ref={closeRef}
                onClick={close}
                aria-label="Close shortcuts"
                className="p-1 rounded"
                style={{ color: 'var(--text-3)' }}
              >
                <X size={15} />
              </button>
            </div>

            <div className="px-5 py-4 max-h-[70vh] overflow-y-auto">
              {SHORTCUT_GROUPS.map((group) => {
                const rows = SHORTCUTS.filter((s) => s.group === group);
                if (!rows.length) return null;
                return (
                  <section key={group} className="mb-5 last:mb-0">
                    <h3
                      className="text-[10px] font-mono uppercase tracking-[0.14em] mb-2"
                      style={{ color: 'var(--text-4)' }}
                    >
                      {group}
                    </h3>
                    <dl className="space-y-1.5">
                      {rows.map((s) => (
                        <div key={s.id} className="flex items-center justify-between gap-4">
                          <dt className="text-[13px]" style={{ color: 'var(--text-2)' }}>
                            {s.label}
                          </dt>
                          <dd className="flex-shrink-0">
                            <Keys keys={s.keys} />
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </section>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
