import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe, ShieldCheck, Compass, Boxes, Zap, Database, Layers, ArrowRight,
} from 'lucide-react';

const NODES = [
  {
    id: 'client', label: 'Client', icon: Globe, color: '#94a3b8',
    blurb: 'The request origin — a browser, mobile app, or another service. Never talks to backend services directly in a well-designed system; everything goes through the gateway.',
    usedIn: [],
  },
  {
    id: 'gateway', label: 'API Gateway', icon: ShieldCheck, color: '#6366f1',
    blurb: 'Single entry point that handles routing, auth, rate limiting, and request/response transformation, so individual services don’t each reimplement those cross-cutting concerns.',
    usedIn: ['Spring Boot Microservices Starter'],
  },
  {
    id: 'discovery', label: 'Service Discovery', icon: Compass, color: '#f59e0b',
    blurb: 'A registry (e.g. Eureka) that services register with on startup, so the gateway and other services can find live instances by name instead of hardcoded IPs — critical once you’re running more than a couple of replicas.',
    usedIn: ['Spring Boot Microservices Starter'],
  },
  {
    id: 'services', label: 'Microservices', icon: Boxes, color: '#10b981',
    blurb: 'Independently deployable units, each owning a bounded piece of the domain. Isolation means one service failing (with circuit breakers like Resilience4j) doesn’t take the whole system down.',
    usedIn: ['Newgen Software Technology — production microservices'],
  },
  {
    id: 'kafka', label: 'Kafka', icon: Zap, color: '#a855f7',
    blurb: 'Event streaming backbone for async, decoupled communication between services — producers don’t need consumers to be online, and consumers can replay history. Handles ordering via partitions and durability via replication.',
    usedIn: ['Kafka Event Streaming Pipeline', 'ChatStream — AI Conversational Platform'],
  },
  {
    id: 'database', label: 'Database', icon: Database, color: '#06b6d4',
    blurb: 'Source of truth for persisted state. Query optimization (indexes, execution plans) and replication for read scaling and failover matter more here than almost anywhere else in the stack.',
    usedIn: ['SQL Query Optimizer Tool'],
  },
  {
    id: 'cache', label: 'Cache', icon: Layers, color: '#ef4444',
    blurb: 'Sits in front of the database (or between services) to absorb repeat reads. Cache-aside and write-through are the two patterns that matter most, plus deciding what actually needs invalidation logic.',
    usedIn: ['Distributed Cache Library', 'API Rate Limiter — Redis Sliding Window'],
  },
];

export default function ArchitectureLab() {
  const [active, setActive] = useState(null);
  const activeNode = NODES.find((n) => n.id === active);

  return (
    <div className="@container p-6 sm:p-8">
      <h2 className="text-lg font-bold mb-1" style={{ color: 'var(--text-1)' }}>Architecture Lab</h2>
      <p className="text-sm mb-6" style={{ color: 'var(--text-3)' }}>
        A typical request flow through a distributed backend. Click any stage to see what it does and where I’ve actually used it.
      </p>

      {/* Pipeline */}
      <div className="flex flex-wrap @lg:flex-nowrap items-center gap-1.5 mb-6 overflow-x-auto pb-2">
        {NODES.map((node, i) => {
          const Icon = node.icon;
          const isActive = active === node.id;
          return (
            <div key={node.id} className="flex items-center gap-1.5 flex-shrink-0">
              <button
                onClick={() => setActive((p) => (p === node.id ? null : node.id))}
                className="flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl transition-all"
                style={{
                  background: isActive ? `${node.color}18` : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${isActive ? `${node.color}60` : 'var(--surface-border)'}`,
                  minWidth: 92,
                }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: `${node.color}20`, border: `1px solid ${node.color}40` }}
                >
                  <Icon size={15} style={{ color: node.color }} />
                </div>
                <span className="text-[11px] font-mono text-center leading-tight" style={{ color: isActive ? node.color : 'var(--text-3)' }}>
                  {node.label}
                </span>
              </button>
              {i < NODES.length - 1 && (
                <ArrowRight size={14} className="flex-shrink-0" style={{ color: 'var(--text-4)' }} />
              )}
            </div>
          );
        })}
      </div>

      {/* Explanation panel */}
      <AnimatePresence mode="wait">
        {activeNode ? (
          <motion.div
            key={activeNode.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="rounded-xl p-5"
            style={{ background: `${activeNode.color}0a`, border: `1px solid ${activeNode.color}30` }}
          >
            <h3 className="text-sm font-bold mb-2" style={{ color: activeNode.color }}>{activeNode.label}</h3>
            <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-2)' }}>{activeNode.blurb}</p>
            {activeNode.usedIn.length > 0 && (
              <div>
                <div className="text-[10px] font-mono uppercase tracking-widest mb-1.5" style={{ color: 'var(--text-4)' }}>Where I've used this</div>
                <div className="flex flex-wrap gap-1.5">
                  {activeNode.usedIn.map((u) => (
                    <span key={u} className="px-2.5 py-1 rounded-lg text-xs font-mono" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-2)' }}>
                      {u}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          <p className="text-sm text-center py-8" style={{ color: 'var(--text-4)' }}>
            Click a stage above to explore it.
          </p>
        )}
      </AnimatePresence>
    </div>
  );
}
