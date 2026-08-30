import { personalInfo, experience, projects, timeline, skills } from '../../data/portfolio';
import { POSTS } from '../../data/posts';
import { NODES } from '../../flow/graph';

/* The content engine.

   Builds one span tree out of the portfolio data. Pure — no React, no
   THREE, no DOM. Everything downstream (the HTML waterfall, the WebGL
   scene, the inspector) reads this and nothing else, which is what keeps
   the 3D layer from being coupled to the content.

   The model is OpenTelemetry's, because the metaphor only holds if the
   primitives are the real ones:

     span         a thing that happened, with a start and a duration
     attribute    a key/value carried by a span   → a technology
     event        a timestamped point inside one  → a milestone, a commit
     annotation   a note attached at a moment     → a post

   ── On honesty about time ────────────────────────────────────────────
   Roles have real dates; `experience[].period` gives start and end.
   Projects do not. Nothing in portfolio.js says when ChatStream was
   built, so no project gets an invented start or duration — it is
   marked `indeterminate` and rendered as an open bar across its parent's
   window rather than a solid one that would claim a schedule that was
   never recorded. Add `started` / `shipped` to a project and it becomes
   a real span automatically. */

const MONTHS = {
  jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
  jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
};

export const NOW = new Date();

// "Jul 2024", "2023", "2026+", "Present" → a Date, or null when the
// string carries no usable point in time.
function parsePoint(raw, { endOfPeriod = false } = {}) {
  if (!raw) return null;
  const s = String(raw).trim();
  if (/^present$/i.test(s) || /^current$/i.test(s)) return NOW;

  const withMonth = s.match(/^([A-Za-z]{3})[a-z]*\s+(\d{4})/);
  if (withMonth) {
    const m = MONTHS[withMonth[1].toLowerCase()];
    if (m !== undefined) {
      const y = Number(withMonth[2]);
      return endOfPeriod ? new Date(y, m + 1, 0) : new Date(y, m, 1);
    }
  }

  const yearOnly = s.match(/(\d{4})/);
  if (yearOnly) {
    const y = Number(yearOnly[1]);
    return endOfPeriod ? new Date(y, 11, 31) : new Date(y, 0, 1);
  }
  return null;
}

// "Jul 2024 — Present" / "Jan 2024 - Jun 2024"
function parsePeriod(period) {
  const [a, b] = String(period || '').split(/\s*[—–-]\s*/);
  return { start: parsePoint(a), end: parsePoint(b, { endOfPeriod: true }) };
}

/* Which architecture layer a set of technologies belongs to. Reuses the
   flow graph's own node definitions rather than a second hand-written
   list, so a span's Z position and the service map agree by construction
   instead of by maintenance. */
const LAYER_OF_KIND = {
  Edge: 'edge',
  Compute: 'compute',
  'Event Backbone': 'backbone',
  State: 'state',
  Storage: 'store',
  Infrastructure: 'infra',
  Trading: 'domain',
};

/* Count how many of *this span's technologies* a node claims, not how
   many of the node's terms fire. Scoring terms double-counts:
   "PostgreSQL" matches both `postgres` and `sql` on the storage node,
   which beat every genuine single match. */
function claimCount(node, lowerTech) {
  return lowerTech.reduce(
    (n, t) => n + (node.match.some((term) => t.includes(term)) ? 1 : 0),
    0
  );
}

/* Which layer a span sits at, by weighted vote across the flow graph's
   own node definitions.

   A plain argmax gets this wrong, and wrong in one specific way: Docker,
   AWS, Kubernetes and Jenkins appear in nearly every project, so the
   infrastructure node matches almost everything and wins almost
   everything. ChatStream — an AI platform — came out as Infrastructure
   because it happens to deploy on Docker and EC2.

   A term that appears everywhere carries no information about where a
   thing belongs, which is exactly what inverse document frequency
   measures. So each node's claim is weighted by how rare that claim is
   across the whole corpus: matching Kafka says a lot, matching Docker
   says almost nothing. */
const CORPUS = [...experience.map((e) => e.tech || []), ...projects.map((p) => p.tech || [])].map(
  (tech) => tech.map((t) => t.toLowerCase())
);

const NODE_IDF = new Map(
  NODES.map((node) => {
    const df = CORPUS.reduce((n, tech) => n + (claimCount(node, tech) > 0 ? 1 : 0), 0);
    // +1 keeps a node that matches everything at a small positive weight
    // rather than exactly zero, so it can still break a genuine tie.
    return [node.id, Math.log((CORPUS.length + 1) / (df + 1)) + 0.05];
  })
);

/* The name a thing was given is the most authoritative statement of what
   it is. "Kafka Event Streaming Pipeline" is about Kafka no matter how
   much Docker is in its stack — and without the title voting it landed
   on Infrastructure, because a deployment story out-weighed the subject.
   So the title and category vote too, at double weight. */
const TITLE_WEIGHT = 2;

function layerFor({ tech = [], title = '', category = '' }) {
  const lowerTech = tech.map((t) => t.toLowerCase());
  const lowerName = [title, category].filter(Boolean).map((s) => s.toLowerCase());
  let best = null;
  let bestScore = 0;
  for (const node of NODES) {
    const score =
      (claimCount(node, lowerTech) + TITLE_WEIGHT * claimCount(node, lowerName)) *
      NODE_IDF.get(node.id);
    if (score > bestScore) {
      bestScore = score;
      best = node;
    }
  }
  return best ? LAYER_OF_KIND[best.kind] || 'compute' : 'compute';
}

// Attributes are the skills, so they have to be the *same* strings the
// skills data uses — otherwise the hot-path filter silently matches
// nothing. Anything a project lists that isn't a known skill still
// becomes an attribute; it just won't have a category.
const SKILL_CATEGORY = new Map();
for (const group of skills) {
  for (const item of group.items) {
    SKILL_CATEGORY.set(item.name.toLowerCase(), group.category);
  }
}

/* The projects and the skills list name several technologies
   differently — projects say "Kafka" where skills says "Apache Kafka",
   "CQRS" and "Event Sourcing" separately where skills has them as one
   entry. Left alone that splits one technology into two attributes, so
   filtering on the skills name silently misses every project.

   Only unambiguous synonyms are merged. "GitHub Actions" is *not*
   folded into "Jenkins / CI-CD" — they're different tools, and the
   skills list simply not mentioning one is a gap to surface, not a
   collision to paper over. */
const ALIASES = {
  kafka: 'Apache Kafka',
  postgres: 'PostgreSQL',
  jenkins: 'Jenkins / CI-CD',
  cqrs: 'CQRS / Event Sourcing',
  'event sourcing': 'CQRS / Event Sourcing',
  'aws ec2': 'AWS',
  'aws ecr': 'AWS',
};

function canonical(name) {
  return ALIASES[name.trim().toLowerCase()] || name.trim();
}

function attributesFor(tech = []) {
  const seen = new Set();
  const out = [];
  for (const raw of tech) {
    const name = canonical(raw);
    const key = name.toLowerCase();
    if (seen.has(key)) continue; // aliasing can collapse two into one
    seen.add(key);
    out.push({ key: name, category: SKILL_CATEGORY.get(key) || null });
  }
  return out;
}

/* A project belongs to the role it was built during. Nothing records
   that either, so it's inferred the only defensible way available: the
   role whose own stack overlaps the project's most, falling back to the
   current role. Inference is recorded on the span (`inferredParent`) so
   the UI can decline to state it as fact. */
function parentRoleFor(project, roleSpans) {
  const tech = project.tech.map((t) => t.toLowerCase());
  let best = roleSpans[0];
  let bestScore = -1;
  for (const role of roleSpans) {
    const score = (role.source.tech || []).reduce(
      (n, t) => n + (tech.includes(t.toLowerCase()) ? 1 : 0),
      0
    );
    if (score > bestScore) {
      bestScore = score;
      best = role;
    }
  }
  return best;
}

let seq = 0;
function makeSpan(fields) {
  return {
    id: fields.id ?? `span-${++seq}`,
    kind: 'span',
    events: [],
    annotations: [],
    attributes: [],
    children: [],
    indeterminate: false,
    inferredParent: false,
    ...fields,
  };
}

// ── Build ──────────────────────────────────────────────────────────

const CAREER_START =
  timeline.map((t) => parsePoint(t.year)).filter(Boolean).sort((a, b) => a - b)[0] ||
  new Date(2020, 0, 1);

const roleSpans = experience.map((exp) => {
  const { start, end } = parsePeriod(exp.period);
  return makeSpan({
    id: `role-${exp.id}`,
    name: exp.role,
    subtitle: exp.company,
    layer: layerFor({ tech: exp.tech, title: exp.role, category: exp.company }),
    start: start || CAREER_START,
    end: end || NOW,
    depth: 1,
    attributes: attributesFor(exp.tech),
    source: exp,
    detail: {
      type: 'role',
      description: exp.description,
      proof: exp.achievements,
      period: exp.period,
    },
  });
});

// Newest role first reads correctly in a waterfall (the longest-running
// work at the top), and matches the order the data is already in.
const projectSpans = projects.map((project) => {
  const parent = parentRoleFor(project, roleSpans);
  const started = parsePoint(project.started);
  const shipped = parsePoint(project.shipped, { endOfPeriod: true });
  const known = Boolean(started);
  return makeSpan({
    id: `project-${project.id}`,
    name: project.title,
    subtitle: project.category,
    layer: layerFor({ tech: project.tech, title: project.title, category: project.category }),
    // With no recorded dates a project is drawn across the window of the
    // role it belongs to, flagged so it never reads as a real schedule.
    start: known ? started : parent.start,
    end: known ? shipped || NOW : parent.end,
    indeterminate: !known,
    inferredParent: true,
    parentId: parent.id,
    depth: 2,
    attributes: attributesFor(project.tech),
    source: project,
    detail: {
      type: 'project',
      description: project.description,
      metrics: project.metrics,
      github: project.github,
      live: project.live,
      // The case-study fields the concept doc calls for. Absent today;
      // present the moment they're added to portfolio.js.
      problem: project.problem || null,
      architecture: project.architecture || null,
      contribution: project.contribution || null,
      challenges: project.challenges || null,
      results: project.results || null,
    },
  });
});

for (const span of projectSpans) {
  const parent = roleSpans.find((r) => r.id === span.parentId);
  if (parent) parent.children.push(span);
}

// Milestones are moments, not durations — in trace terms, events on the
// root span rather than spans of their own.
const milestones = timeline
  .map((entry, index) => {
    const at = parsePoint(entry.year);
    if (!at) return null;
    /* "Jul 2024" is a month; "2024" is a whole year and resolving it to
       January 1st would be inventing eleven months of precision. Both
       get placed, but the precision travels with the point so the
       renderers can draw an imprecise marker as imprecise rather than
       as a confident tick. */
    const precision = /^[A-Za-z]{3}/.test(String(entry.year).trim()) ? 'month' : 'year';
    return {
      id: `milestone-${entry.year}-${entry.title}`,
      at,
      precision,
      // Year-only entries land on Jan 1 and would otherwise jump ahead
      // of a month-dated entry earlier in the same year. The author's
      // ordering is itself information, so it breaks the tie.
      index,
      label: entry.title,
      detail: entry.description,
      color: entry.color,
      upcoming: Boolean(entry.locked),
    };
  })
  .filter(Boolean)
  .sort((a, b) => a.at - b.at || a.index - b.index);

// A post is a note attached to the work it came out of. Unpublished
// posts carry no date, so they attach to nothing and stay out of the
// trace entirely rather than appearing at an invented moment.
const annotations = POSTS.filter((p) => p.published).map((p) => ({
  id: `post-${p.slug}`,
  at: new Date(`${p.date}T00:00:00`),
  title: p.title,
  slug: p.slug,
  tags: p.tags,
}));

export const ROOT = makeSpan({
  id: 'root',
  name: personalInfo.name,
  subtitle: personalInfo.title,
  layer: 'edge',
  start: CAREER_START,
  end: NOW,
  depth: 0,
  root: true,
  children: roleSpans,
  events: milestones,
  annotations,
  detail: { type: 'root', description: personalInfo.description },
});

export function flatten(span, out = []) {
  out.push(span);
  for (const child of span.children) flatten(child, out);
  return out;
}

export const SPANS = flatten(ROOT);
export const SPAN_BY_ID = Object.fromEntries(SPANS.map((s) => [s.id, s]));

export const TRACE = {
  root: ROOT,
  spans: SPANS,
  start: CAREER_START,
  end: NOW,
  durationMs: NOW - CAREER_START,
  milestones,
  annotations,
};

// The chain from a span up to the root — the breadcrumb, and the set the
// camera keeps lit when it descends.
export function ancestorsOf(id) {
  const chain = [];
  let current = SPAN_BY_ID[id];
  while (current && current.parentId) {
    current = SPAN_BY_ID[current.parentId];
    if (current) chain.unshift(current);
  }
  if (current !== ROOT && SPAN_BY_ID[id] !== ROOT) chain.unshift(ROOT);
  return chain;
}
