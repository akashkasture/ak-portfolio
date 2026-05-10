import { motion } from 'framer-motion';
import SectionHeader from './SectionHeader';

function generateHeatmapData() {
  const weeks = 52;
  const days = 7;
  const data = [];
  for (let w = 0; w < weeks; w++) {
    const week = [];
    for (let d = 0; d < days; d++) {
      const rand = Math.random();
      let level = 0;
      if (rand > 0.55) level = 1;
      if (rand > 0.72) level = 2;
      if (rand > 0.84) level = 3;
      if (rand > 0.93) level = 4;
      week.push(level);
    }
    data.push(week);
  }
  return data;
}

const LEVEL_COLORS = [
  'bg-white/5',
  'bg-emerald-900/60',
  'bg-emerald-700/70',
  'bg-emerald-500/80',
  'bg-emerald-400',
];

const heatmapData = generateHeatmapData();
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function GitHubHeatmap() {
  const totalContributions = heatmapData.flat().reduce((sum, v) => sum + v * 3, 0);

  return (
    <section className="section-padding">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          label="GitHub Activity"
          title="Contribution"
          highlight="Heatmap"
          description="Consistency is the hallmark of great engineering."
        />

        <motion.div
          className="glass rounded-2xl p-6 border border-white/8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-white font-bold text-lg">{totalContributions.toLocaleString()}</span>
              <span className="text-slate-500 text-sm ml-2">contributions in the last year</span>
            </div>
            <a
              href="https://github.com/akashkasture"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              View on GitHub →
            </a>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[640px]">
              <div className="flex gap-1 mb-1">
                {months.map((m, i) => (
                  <div key={m} className="text-[10px] text-slate-600 flex-1 text-center"
                    style={{ minWidth: i === 0 || i === 11 ? 'auto' : '3.5rem' }}>
                    {m}
                  </div>
                ))}
              </div>

              <div className="flex gap-1">
                {heatmapData.map((week, wi) => (
                  <div key={wi} className="flex flex-col gap-1">
                    {week.map((level, di) => (
                      <motion.div
                        key={di}
                        className={`w-3 h-3 rounded-sm ${LEVEL_COLORS[level]} cursor-pointer transition-all duration-150 hover:ring-1 hover:ring-white/20`}
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: (wi * 7 + di) * 0.001, duration: 0.2 }}
                        title={`${level * 3} contributions`}
                      />
                    ))}
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 mt-3 justify-end">
                <span className="text-[10px] text-slate-600">Less</span>
                {LEVEL_COLORS.map((c, i) => (
                  <div key={i} className={`w-3 h-3 rounded-sm ${c}`} />
                ))}
                <span className="text-[10px] text-slate-600">More</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
