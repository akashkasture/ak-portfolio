import { Activity, Cpu, FolderKanban, Layers, MemoryStick, Wrench } from 'lucide-react';
import { projects, techBadges, experience, skills } from '../data/portfolio';
import { useSimulatedStats } from '../hooks/useSimulatedStats';

const STAT_CARDS = [
  { label: 'Projects Shipped', value: String(projects.length), icon: FolderKanban, color: '#6366f1' },
  { label: 'Technologies', value: String(techBadges.length), icon: Wrench, color: '#06b6d4' },
  { label: 'Years Experience', value: '2+', icon: Activity, color: '#f59e0b' },
  { label: 'System Status', value: 'ONLINE', icon: Layers, color: '#10b981' },
];

function Bar({ label, value, color }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-mono" style={{ color: 'var(--text-3)' }}>{label}</span>
        <span className="text-xs font-mono font-semibold" style={{ color }}>{value}%</span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${value}%`, background: color }}
        />
      </div>
    </div>
  );
}

export default function SystemMonitor() {
  const { cpu, ram } = useSimulatedStats();

  return (
    <div className="@container p-6 sm:p-8">
      <div className="flex items-center gap-2 mb-6">
        <Activity size={16} className="text-indigo-400" />
        <h2 className="text-lg font-bold font-mono" style={{ color: 'var(--text-1)' }}>AK SYSTEM MONITOR</h2>
      </div>

      {/* Real stat cards */}
      <div className="grid grid-cols-2 @md:grid-cols-4 gap-3 mb-8">
        {STAT_CARDS.map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="rounded-xl p-4 text-center"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--surface-border)' }}
          >
            <Icon size={16} style={{ color, margin: '0 auto 8px' }} />
            <div className="text-xl font-bold font-mono" style={{ color: 'var(--text-1)' }}>{value}</div>
            <div className="text-[10px] mt-0.5 uppercase tracking-wide" style={{ color: 'var(--text-4)' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Skill category coverage — real category counts, not fabricated percentages */}
      <div className="mb-8">
        <h3 className="text-xs font-mono uppercase tracking-widest mb-3" style={{ color: 'var(--text-4)' }}>Skill Categories</h3>
        <div className="flex flex-wrap gap-2">
          {skills.map((s) => (
            <span
              key={s.category}
              className="px-2.5 py-1 rounded-lg text-xs font-mono"
              style={{ background: `${s.color}15`, border: `1px solid ${s.color}30`, color: s.color }}
            >
              {s.category} · {s.items.length}
            </span>
          ))}
        </div>
      </div>

      {/* Live-ish system readouts — explicitly simulated */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <h3 className="text-xs font-mono uppercase tracking-widest" style={{ color: 'var(--text-4)' }}>Live Readouts</h3>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded" style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text-4)' }} title="Not real system metrics — simulated for visual effect">
            simulated
          </span>
        </div>
        <div className="space-y-4 max-w-sm">
          <Bar label="CPU" value={cpu} color="#6366f1" />
          <Bar label="Memory" value={ram} color="#06b6d4" />
        </div>
      </div>

      <div className="flex items-center gap-2 mt-8 pt-6" style={{ borderTop: '1px solid var(--surface-border)' }}>
        <Cpu size={12} style={{ color: 'var(--text-4)' }} />
        <MemoryStick size={12} style={{ color: 'var(--text-4)' }} />
        <span className="text-[11px] font-mono" style={{ color: 'var(--text-4)' }}>
          {experience.length} roles logged · {projects.length} deployments · AK OS v1.0
        </span>
      </div>
    </div>
  );
}
