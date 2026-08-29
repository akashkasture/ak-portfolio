import { projects, experience, skills } from '../data/portfolio';

/* The topology is the one Akash actually builds, not an invented one.

   Every node names real technologies from portfolio.js, and the projects
   attached to a node are matched by their own `tech` array rather than
   listed by hand — so adding a project that uses Redis attaches it to the
   Redis node automatically, and nothing here can drift out of sync with
   the data or claim a system that doesn't exist.

   Layout is a downward flow: requests enter at the top, fan through the
   services, cross the event backbone, and land in storage. X spreads the
   branches, Z gives the graph enough depth that flying into it reads as
   travel rather than a zoom on a flat diagram. */

// Case-insensitive: a node claims a project when the project's stack
// mentions any of the node's technologies.
const matchProjects = (terms) =>
  projects.filter((p) =>
    p.tech.some((t) => terms.some((term) => t.toLowerCase().includes(term)))
  );

const skillNames = (category) =>
  skills.find((g) => g.category === category)?.items.map((i) => i.name) ?? [];

const current = experience[0];

export const NODES = [
  {
    id: 'client',
    label: 'Clients',
    kind: 'Edge',
    position: [0, 9, 0],
    color: '#94a3b8',
    radius: 0.85,
    summary:
      'Browsers and WebSocket consumers. Where a request starts and where a streamed token or a price tick finally lands.',
    tech: ['React', 'WebSocket', 'Recharts'],
    match: ['react', 'recharts'],
  },
  {
    id: 'gateway',
    label: 'API Gateway',
    kind: 'Edge',
    position: [0, 5.5, 0],
    color: '#818cf8',
    radius: 0.95,
    summary:
      'Service discovery, routing and resilience in front of the microservices — the layer that decides what a request is allowed to reach.',
    tech: ['Spring Cloud', 'Eureka', 'Resilience4j', 'Spring Security', 'Zipkin'],
    match: ['eureka', 'spring cloud', 'resilience4j', 'spring security'],
    // Real, from the current role.
    proof: [current.achievements[0]],
  },
  {
    id: 'services',
    label: 'Microservices',
    kind: 'Compute',
    position: [-4.6, 1.6, 1.2],
    color: '#6366f1',
    radius: 1.05,
    summary:
      'Spring Boot services doing the actual work: transaction processing, rule-engine validation, batch jobs.',
    tech: skillNames('Backend').slice(0, 6),
    match: ['spring boot', 'java', 'spring batch', 'spring shell'],
    proof: [current.achievements[1], current.achievements[3]].filter(Boolean),
  },
  {
    id: 'ai',
    label: 'AI Layer',
    kind: 'Compute',
    position: [4.6, 1.6, 1.2],
    color: '#a78bfa',
    radius: 1.0,
    summary:
      'LLM orchestration and retrieval. Routes across models, grounds answers on pgvector embeddings, streams tokens back over SSE.',
    tech: ['Spring AI', 'GPT-4', 'Claude', 'Gemini', 'pgvector', 'Spring WebFlux'],
    match: ['spring ai', 'gpt', 'claude', 'gemini', 'pgvector', 'webflux'],
  },
  {
    id: 'feed',
    label: 'Market Feed',
    kind: 'Trading',
    position: [8.6, 4.4, -1.4],
    color: '#f59e0b',
    radius: 0.85,
    summary:
      'The trading side of the same system: a live options chain over WebSocket, screened and charted in real time.',
    tech: skillNames('Trading & Finance').slice(0, 5),
    match: ['banknifty', 'recharts'],
    trader: true,
  },
  {
    id: 'kafka',
    label: 'Kafka',
    kind: 'Event Backbone',
    position: [0, -2.4, 0],
    color: '#22d3ee',
    radius: 1.35,
    summary:
      'The event backbone. Producers write to partitioned topics, consumer groups read independently — ingestion is decoupled from delivery, so a slow consumer never blocks a producer.',
    tech: skillNames('Messaging'),
    match: ['kafka', 'ibm mq', 'rabbitmq'],
    partitions: 3,
  },
  {
    id: 'redis',
    label: 'Redis',
    kind: 'State',
    position: [-6.2, -5.4, -1.0],
    color: '#f87171',
    radius: 1.0,
    summary:
      'Sessions with TTL heartbeats, sliding-window rate limiting, and prompt caching that cuts model spend.',
    tech: ['Redis', 'Micrometer'],
    match: ['redis'],
  },
  {
    id: 'postgres',
    label: 'PostgreSQL',
    kind: 'Storage',
    position: [1.6, -8.4, 0.4],
    color: '#38bdf8',
    radius: 1.1,
    summary:
      'Durable state — relational data, event-sourced streams, and vector embeddings living in the same database.',
    tech: skillNames('Databases').slice(0, 5),
    match: ['postgres', 'oracle', 'jdbc', 'sql', 'cqrs', 'event sourcing'],
  },
  {
    id: 'platform',
    label: 'Platform',
    kind: 'Infrastructure',
    position: [-9.0, 0.6, -3.4],
    color: '#4ade80',
    radius: 0.9,
    summary:
      'How all of it ships and stays observable: containers, orchestration, pipelines, dashboards and traces.',
    tech: skillNames('DevOps').slice(0, 6),
    match: ['docker', 'kubernetes', 'jenkins', 'github actions', 'helm', 'grafana', 'aws'],
  },
];

/* from → to, with a `weight` that only sets how many particles ride the
   edge. It is a visual density, not a throughput claim. */
export const EDGES = [
  { from: 'client', to: 'gateway', weight: 3 },
  { from: 'gateway', to: 'services', weight: 3 },
  { from: 'gateway', to: 'ai', weight: 2 },
  { from: 'services', to: 'kafka', weight: 4 },
  { from: 'ai', to: 'kafka', weight: 2 },
  { from: 'feed', to: 'kafka', weight: 3, trader: true },
  { from: 'kafka', to: 'redis', weight: 3 },
  { from: 'kafka', to: 'postgres', weight: 3 },
  { from: 'ai', to: 'postgres', weight: 2 },
  { from: 'redis', to: 'postgres', weight: 1 },
  { from: 'platform', to: 'services', weight: 1, dashed: true },
  { from: 'platform', to: 'kafka', weight: 1, dashed: true },
];

// Resolve project links once, at module load.
export const GRAPH = NODES.map((n) => ({
  ...n,
  projects: matchProjects(n.match),
}));

export const NODE_BY_ID = Object.fromEntries(GRAPH.map((n) => [n.id, n]));

export const RESOLVED_EDGES = EDGES.map((e) => ({
  ...e,
  fromNode: NODE_BY_ID[e.from],
  toNode: NODE_BY_ID[e.to],
})).filter((e) => e.fromNode && e.toNode);
