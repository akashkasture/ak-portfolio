import { NODES, EDGES } from '../../flow/graph';

/* What is inside a project.

   The concept calls for descending into a project and finding its own
   trace. Nothing in portfolio.js records what happened inside one — no
   internal timings, no call log — and inventing a plausible-looking
   sequence of spans would be exactly the fabrication this portfolio is
   built to avoid.

   But real structure does exist, and it is already stated twice: a
   project lists the technologies it uses, and the flow graph says how
   those parts of the system connect. Intersecting the two gives the
   subsystem that project actually touches, and the graph's own edges
   give the shape. Nothing here is asserted that the data doesn't
   already say — it is only being read together.

   ── Two honest limits, both visible in the output ─────────────────────
   `dashed` edges are excluded. In the graph they mean "runs on", not
   "calls" — the platform hosts a service, it doesn't invoke it — so
   folding them into a call tree would claim a relationship of the wrong
   kind. Platform ends up as a sibling rather than a caller, which is
   what it is.

   And a span has exactly one parent while the topology is a DAG: Kafka
   and the AI layer both write to Postgres. Reducing that to a tree means
   picking one, done deterministically by breadth-first order over the
   graph's own node ordering rather than by preference. The full edge set
   is never lost — it is what the service map draws. */

const CALL_EDGES = EDGES.filter((e) => !e.dashed);
const NODE_ORDER = new Map(NODES.map((n, i) => [n.id, i]));

function nodesFor(tech = []) {
  const lower = tech.map((t) => t.toLowerCase());
  return NODES.filter((node) =>
    lower.some((t) => node.match.some((term) => t.includes(term)))
  );
}

/**
 * The subsystem a project touches, as a tree.
 * @returns {Array<{node, parentId: string|null, level: number}>}
 */
export function subsystemOf(tech = []) {
  const present = nodesFor(tech);
  if (present.length === 0) return [];

  const ids = new Set(present.map((n) => n.id));
  const edges = CALL_EDGES.filter((e) => ids.has(e.from) && ids.has(e.to));
  const hasIncoming = new Set(edges.map((e) => e.to));

  // Entry points are the nodes nothing else in this subsystem calls.
  const roots = present
    .filter((n) => !hasIncoming.has(n.id))
    .sort((a, b) => NODE_ORDER.get(a.id) - NODE_ORDER.get(b.id));

  const claimed = new Map(); // nodeId → { parentId, level }
  const queue = [];
  for (const r of roots) {
    claimed.set(r.id, { parentId: null, level: 0 });
    queue.push(r.id);
  }

  // First claim wins, and the queue is seeded in graph order, so the
  // same project always yields the same tree.
  while (queue.length) {
    const id = queue.shift();
    const { level } = claimed.get(id);
    const children = edges
      .filter((e) => e.from === id && !claimed.has(e.to))
      .sort((a, b) => NODE_ORDER.get(a.to) - NODE_ORDER.get(b.to));
    for (const edge of children) {
      claimed.set(edge.to, { parentId: id, level: level + 1 });
      queue.push(edge.to);
    }
  }

  /* A cycle in the subset would leave nodes unclaimed. The graph has
     none today, but a future edge could introduce one, and silently
     dropping a service the project genuinely uses is worse than
     attaching it at the top. */
  for (const node of present) {
    if (!claimed.has(node.id)) claimed.set(node.id, { parentId: null, level: 0 });
  }

  return present
    .map((node) => ({ node, ...claimed.get(node.id) }))
    .sort((a, b) => a.level - b.level || NODE_ORDER.get(a.node.id) - NODE_ORDER.get(b.node.id));
}
