import { motion } from 'framer-motion';
import { Clock, ArrowUpRight, BookOpen } from 'lucide-react';
import { blogPosts } from '../data/portfolio';
import SectionHeader from './SectionHeader';

export default function Blog() {
  return (
    <section id="blog" className="section-padding">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          label="Blog & Articles"
          title="Engineering"
          highlight="Insights"
          description="Deep dives into backend engineering, system design, and distributed systems."
        />

        <div className="grid md:grid-cols-3 gap-6">
          {blogPosts.map((post, i) => (
            <motion.article
              key={i}
              className="glass rounded-2xl p-6 border border-white/8 card-hover group cursor-pointer"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -4 }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                style={{ background: `${post.color}15`, border: `1px solid ${post.color}30` }}
              >
                <BookOpen size={18} style={{ color: post.color }} />
              </div>

              <h3 className="text-white font-bold text-base leading-snug mb-3 group-hover:text-indigo-300 transition-colors line-clamp-2">
                {post.title}
              </h3>

              <p className="text-slate-500 text-sm leading-relaxed mb-4 line-clamp-3">
                {post.excerpt}
              </p>

              <div className="flex flex-wrap gap-1.5 mb-5">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-md text-[11px] border"
                    style={{
                      borderColor: `${post.color}25`,
                      background: `${post.color}08`,
                      color: post.color,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div className="flex items-center gap-3 text-xs text-slate-600">
                  <span>{post.date}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Clock size={11} />
                    {post.readTime}
                  </span>
                </div>
                <ArrowUpRight
                  size={14}
                  className="text-slate-600 group-hover:text-indigo-400 transition-colors"
                />
              </div>
            </motion.article>
          ))}
        </div>

        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <a
            href="#"
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-white transition-colors"
          >
            More articles coming soon
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
