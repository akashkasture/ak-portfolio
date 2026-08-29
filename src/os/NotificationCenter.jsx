import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, FileText, Sparkles, X } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import { T } from './motion';

function timeAgo(ts) {
  const mins = Math.round((Date.now() - ts) / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.round(hrs / 24)}d ago`;
}

export default function NotificationCenter() {
  const [open, setOpen] = useState(false);
  const { notifications, unreadCount, markAllRead, dismiss, clear } = useNotifications();

  const toggle = () => {
    const next = !open;
    setOpen(next);
    if (next) markAllRead();
  };

  return (
    <div className="relative">
      <button
        onClick={toggle}
        aria-label="Notifications"
        aria-expanded={open}
        className="relative p-2 rounded-lg text-slate-400 hover:text-white transition-colors hidden sm:block"
        title="Notifications"
      >
        <Bell size={15} />
        {unreadCount > 0 && (
          <span
            className="absolute top-1 right-1 w-2 h-2 rounded-full"
            style={{ background: 'var(--os-accent)', boxShadow: '0 0 6px rgba(var(--os-accent-rgb), 0.7)' }}
          />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <motion.div
              className="absolute top-9 right-0 z-20 w-80 max-h-96 flex flex-col rounded-xl overflow-hidden glass-strong"
              style={{ border: '1px solid var(--nav-border)' }}
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={T.fast}
            >
              <div className="flex items-center justify-between px-3.5 py-2.5 flex-shrink-0" style={{ borderBottom: '1px solid var(--surface-border)' }}>
                <span className="text-xs font-semibold" style={{ color: 'var(--text-1)' }}>Notifications</span>
                {notifications.length > 0 && (
                  <button onClick={clear} className="text-[11px] transition-colors hover:text-white" style={{ color: 'var(--text-4)' }}>
                    Clear all
                  </button>
                )}
              </div>
              <div className="flex-1 min-h-0 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-2 py-10 text-center px-6">
                    <Bell size={22} style={{ color: 'var(--text-4)' }} />
                    <p className="text-xs" style={{ color: 'var(--text-4)' }}>You're all caught up.</p>
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className="group flex items-start gap-2.5 px-3.5 py-2.5 transition-colors hover:bg-white/[0.04]"
                      style={{ borderBottom: '1px solid var(--surface-border)' }}
                    >
                      {n.kind === 'system'
                        ? <Sparkles size={14} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--os-accent)' }} />
                        : <FileText size={14} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--text-3)' }} />}
                      <div className="min-w-0 flex-1">
                        <div className="text-[12.5px] font-medium truncate" style={{ color: 'var(--text-1)' }}>{n.title}</div>
                        {n.body && <div className="text-[11px] truncate mt-0.5" style={{ color: 'var(--text-3)' }}>{n.body}</div>}
                        <div className="text-[10px] mt-1 font-mono" style={{ color: 'var(--text-4)' }}>{timeAgo(n.time)}</div>
                      </div>
                      <button
                        onClick={() => dismiss(n.id)}
                        aria-label="Dismiss"
                        className="p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                        style={{ color: 'var(--text-4)' }}
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
