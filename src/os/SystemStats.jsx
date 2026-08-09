import { useSimulatedStats } from '../hooks/useSimulatedStats';

function Meter({ label, value }) {
  return (
    <div
      className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono"
      style={{ color: 'var(--text-3)' }}
      title="Simulated for visual effect — not a real system reading"
    >
      <span className="opacity-70">{label}</span>
      <span className="font-semibold" style={{ color: 'var(--text-2)' }}>{value}%</span>
    </div>
  );
}

export default function SystemStats() {
  const { cpu, ram, time } = useSimulatedStats();
  const timeStr = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="flex items-center gap-4">
      <Meter label="CPU" value={cpu} />
      <Meter label="RAM" value={ram} />
      <div className="hidden md:flex items-center gap-1.5 text-[11px] font-mono" style={{ color: 'var(--text-3)' }}>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
        <span>ONLINE</span>
      </div>
      <div className="text-[11px] font-mono tabular-nums" style={{ color: 'var(--text-2)' }}>{timeStr}</div>
    </div>
  );
}
