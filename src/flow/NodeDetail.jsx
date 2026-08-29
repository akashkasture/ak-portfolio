import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { T } from '../os/motion';

/* What a hotspot opens.

   Everything on this panel comes from portfolio.js: the stack list is the
   node's real technologies, the "Shipped" lines are verbatim achievements
   from the current role, and the projects are the ones whose own tech
   array matches this node. There are no invented throughput numbers,
   because the graph is a map of what was built, not a monitoring
   dashboard pretending to read live traffic. */

export default function NodeDetail({ node, onClose, onOpenProject }) {
  return (
    <AnimatePresence>
      {node && (
        <motion.aside
          key={node.id}
          role="dialog"
          aria-modal="false"
          aria-label={`${node.label} details`}
          className="absolute z-20 right-0 top-0 bottom-0 w-full sm:w-[380px] overflow-y-auto"
          style={{
            background: 'var(--surface)',
            borderLeft: '1px solid var(--surface-border)',
            backdropFilter: 'blur(20px)',
          }}
          initial={{ opacity: 0, x: 32 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 32 }}
          transition={T.enter}
        >
          <div className="p-6">
            <div className="flex items-start gap-3 mb-1">
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0 mt-2"
                style={{ background: node.color }}
              />
              <div className="min-w-0">
                <h2 className="font-display text-[24px] leading-tight" style={{ color: 'var(--text-1)' }}>
                  {node.label}
                </h2>
                <div
                  className="text-[10px] font-mono uppercase tracking-[0.14em] mt-1"
                  style={{ color: 'var(--text-4)' }}
                >
                  {node.kind}
                </div>
              </div>
            </div>

            <p className="text-[14px] leading-relaxed mt-4" style={{ color: 'var(--text-2)' }}>
              {node.summary}
            </p>

            {node.proof?.length > 0 && (
              <section className="mt-6">
                <h3
                  className="text-[10px] font-mono uppercase tracking-[0.14em] mb-2.5"
                  style={{ color: 'var(--text-4)' }}
                >
                  Shipped
                </h3>
                <ul className="space-y-2.5">
                  {node.proof.map((line) => (
                    <li
                      key={line}
                      className="text-[13px] leading-relaxed pl-4 relative"
                      style={{ color: 'var(--text-2)' }}
                    >
                      <span
                        className="absolute left-0 top-[0.6em] w-1.5 h-px"
                        style={{ background: 'var(--text-4)' }}
                      />
                      {line}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section className="mt-6">
              <h3
                className="text-[10px] font-mono uppercase tracking-[0.14em] mb-2.5"
                style={{ color: 'var(--text-4)' }}
              >
                Stack
              </h3>
              <div className="flex flex-wrap gap-x-3 gap-y-1.5">
                {node.tech.map((t) => (
                  <span key={t} className="text-[13px] font-mono" style={{ color: 'var(--text-3)' }}>
                    {t}
                  </span>
                ))}
              </div>
            </section>

            {node.projects.length > 0 && (
              <section className="mt-6">
                <h3
                  className="text-[10px] font-mono uppercase tracking-[0.14em] mb-1"
                  style={{ color: 'var(--text-4)' }}
                >
                  Built on this
                </h3>
                <div className="flex flex-col">
                  {node.projects.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => onOpenProject(p)}
                      className="flex items-center justify-between gap-3 py-3 text-left"
                      style={{ borderBottom: '1px solid var(--surface-border)' }}
                    >
                      <span className="min-w-0">
                        <span
                          className="block text-[13.5px] truncate"
                          style={{ color: 'var(--text-1)' }}
                        >
                          {p.title}
                        </span>
                        <span
                          className="block text-[11.5px] font-mono truncate mt-0.5"
                          style={{ color: 'var(--text-4)' }}
                        >
                          {p.tech.slice(0, 4).join(' · ')}
                        </span>
                      </span>
                      <ArrowUpRight size={14} style={{ color: 'var(--text-4)' }} className="flex-shrink-0" />
                    </button>
                  ))}
                </div>
              </section>
            )}

            <button
              onClick={onClose}
              className="mt-7 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-[13px] font-medium"
              style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text-2)' }}
            >
              <ArrowLeft size={14} /> Back to the graph
            </button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
