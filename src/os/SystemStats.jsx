import { useEffect, useState } from 'react';

// CPU/RAM meters used to live here as a simulated readout with no real
// meaning — removed rather than relabeled, since a menu bar is exactly the
// place a reader expects real telemetry. The clock below is genuinely real.
export default function SystemStats() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="flex items-center gap-4">
      <div className="hidden md:flex items-center gap-1.5 text-[11px] font-mono" style={{ color: 'var(--text-3)' }}>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
        <span>ONLINE</span>
      </div>
      <div className="text-[11px] font-mono tabular-nums" style={{ color: 'var(--text-2)' }}>{timeStr}</div>
    </div>
  );
}
