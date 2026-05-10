import { motion } from 'framer-motion';
import { Clock, ArrowUpRight, Layers, Cpu, Database, Radio, BarChart2, Server } from 'lucide-react';
import { blogPosts } from '../data/portfolio';
import SectionHeader from './SectionHeader';

const TAG_ICONS = { Kafka: Radio, Java: Cpu, PostgreSQL: Database, Kubernetes: Layers, Spring: Server, Trading: BarChart2 };

function pickIcon(tags = []) {
  for (const tag of tags) {
    for (const [key, Icon] of Object.entries(TAG_ICONS)) {
      if (tag.includes(key)) return Icon;
    }
  }
  return Server;
}

export default function Blog() {
  return (
    <section id="blog" className="section-padding" style={{ overflowX: 'clip' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          label="Blog & Articles"
          title="Engineering"
          highlight="Insights"
          description="Deep dives into backend engineering, system design, and distributed systems."
        />

        <div className="grid md:grid-cols-3 gap-6">
          {blogPosts.map((post, i) => {
            const CardIcon = pickIcon(post.tags);
            return (
              <motion.article
                key={i}
                className="relative rounded-2xl overflow-hidden cursor-pointer group"
                style={{
                  background: `linear-gradient(145deg, ${post.color}14 0%, var(--surface) 45%)`,
                  border: `1px solid ${post.color}28`,
                  transition: 'box-shadow 0.35s ease, border-color 0.35s ease, transform 0.25s ease',
                }}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{
                  y: -7,
                  boxShadow: `0 0 60px ${post.color}22, 0 24px 48px rgba(0,0,0,0.35)`,
                  borderColor: `${post.color}55`,
                }}
              >
                {/* Vivid top border */}
                <div
                  className="absolute top-0 left-0 right-0"
                  style={{ height: 2, background: `linear-gradient(90deg, transparent, ${post.color}ee, transparent)` }}
                />

                {/* Corner glow — reveals on hover */}
                <div
                  className="absolute top-0 right-0 w-36 h-36 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `radial-gradient(circle at 100% 0%, ${post.color}28 0%, transparent 65%)` }}
                />

                {/* Shimmer sweep */}
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  style={{ background: `linear-gradient(110deg, transparent 30%, ${post.color}14 50%, transparent 70%)` }}
                  animate={{ x: ['-130%', '230%'] }}
                  transition={{ duration: 3.8, repeat: Infinity, ease: 'linear', repeatDelay: 2.5, delay: i * 0.6 }}
                />

                <div className="relative z-10 p-6">
                  {/* Top row: Icon + read-time badge */}
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center"
                      style={{
                        background: `linear-gradient(135deg, ${post.color}32, ${post.color}10)`,
                        border: `1px solid ${post.color}50`,
                        boxShadow: `0 0 22px ${post.color}38`,
                      }}
                    >
                      <CardIcon size={18} style={{ color: post.color }} />
                    </div>
                    <div
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider"
                      style={{
                        background: `${post.color}14`,
                        border: `1px solid ${post.color}35`,
                        color: post.color,
                      }}
                    >
                      <Clock size={9} />
                      {post.readTime}
                    </div>
                  </div>

                  {/* Title */}
                  <h3
                    className="font-bold text-base leading-snug mb-3 line-clamp-2 transition-colors duration-200"
                    style={{ color: 'var(--text-1)' }}
                  >
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-sm leading-relaxed mb-4 line-clamp-3" style={{ color: 'var(--text-3)' }}>
                    {post.excerpt}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold"
                        style={{
                          borderLeft: `2px solid ${post.color}80`,
                          background: `${post.color}0e`,
                          color: `${post.color}cc`,
                          paddingLeft: '5px',
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Footer */}
                  <div
                    className="flex items-center justify-between pt-4"
                    style={{ borderTop: `1px solid ${post.color}18` }}
                  >
                    <span className="text-[11px] font-mono" style={{ color: 'var(--text-4)' }}>{post.date}</span>
                    <div
                      className="flex items-center gap-1 text-xs font-semibold group-hover:gap-2 transition-all duration-200"
                      style={{ color: post.color }}
                    >
                      Read
                      <ArrowUpRight size={13} />
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>

        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <a
            href="#"
            className="inline-flex items-center gap-2 text-sm transition-colors"
            style={{ color: 'var(--text-3)' }}
          >
            More articles coming soon
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
