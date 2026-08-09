import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Command, X } from 'lucide-react';
import { useIsMobile } from '../hooks/useIsMobile';

const HINT_KEY = 'ak-os-hint-seen';

function Clock() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const date = now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <motion.div
      className="absolute top-8 right-8 text-right pointer-events-none select-none"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.6 }}
    >
      <div
        className="text-6xl font-extralight tabular-nums tracking-tight leading-none"
        style={{ color: 'var(--text-1)', textShadow: '0 2px 24px rgba(0,0,0,0.35)' }}
      >
        {time}
      </div>
      <div className="text-sm mt-2 font-medium" style={{ color: 'var(--text-3)' }}>{date}</div>
    </motion.div>
  );
}

function markHintSeen() {
  try { localStorage.setItem(HINT_KEY, '1'); } catch { /* ignore */ }
}

function HintToast() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let seen = false;
    try { seen = localStorage.getItem(HINT_KEY) === '1'; } catch { /* ignore */ }
    if (seen) return;
    const show = setTimeout(() => setVisible(true), 1600);
    const hide = setTimeout(() => { setVisible(false); markHintSeen(); }, 10000);
    return () => { clearTimeout(show); clearTimeout(hide); };
  }, []);

  const dismiss = () => {
    setVisible(false);
    markHintSeen();
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="absolute top-8 left-1/2 -translate-x-1/2 flex items-center gap-3 pl-4 pr-2 py-2.5 rounded-2xl dock-glass"
          initial={{ opacity: 0, y: -16, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -16, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 300, damping: 24 }}
        >
          <Command size={14} style={{ color: 'var(--os-accent)' }} />
          <span className="text-[13px]" style={{ color: 'var(--text-2)' }}>
            Welcome to AK OS — press <kbd className="px-1.5 py-0.5 rounded-md text-[11px] font-mono mx-0.5" style={{ background: 'rgba(255,255,255,0.1)', color: 'var(--text-1)' }}>⌘K</kbd> to search, or explore the dock below
          </span>
          <button
            onClick={dismiss}
            aria-label="Dismiss hint"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <X size={13} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function DesktopWidgets() {
  const isMobile = useIsMobile();
  if (isMobile) return null;
  return (
    <>
      <Clock />
      <HintToast />
    </>
  );
}
