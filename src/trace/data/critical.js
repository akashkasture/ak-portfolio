import { ROOT, SPAN_BY_ID } from './trace';
import { t } from './layout';

/* The critical path.

   Every real trace viewer draws this, and it is the one thing this page
   was missing that would make an engineer believe the metaphor rather
   than just enjoy it. It is also the only view that answers a question
   the waterfall cannot: of everything on screen, which spans actually
   determined how long the whole thing took?

   ── The algorithm ────────────────────────────────────────────────────
   Jaeger's, unchanged. Walk a span's window backwards from its end. At
   each step take the child that finishes latest within what is left:
   that child is what the parent was waiting on, so it is on the path for
   its own window, and the walk recurses into it. Any gap the children do
   not cover is the parent's own time — self time — and is on the path
   too, because nothing else was accounting for it.

   Work that ran *concurrently* falls off the path. That is a statement
   about scheduling and not about worth, and the UI has to say so: three
   projects running inside one role are not lesser because the role's
   length would be the same without any one of them.

   ── The honesty rule ─────────────────────────────────────────────────
   Only spans with recorded dates take part. An indeterminate span is
   drawn across its parent's window because nobody wrote down when it
   started; letting an inferred window decide the critical path would be
   inventing a schedule and then reasoning about it, which is worse than
   having no critical path at all. So they are skipped, and `COVERAGE`
   reports how much of the trace the answer is actually based on. */

const dated = (span) => !span.indeterminate;

function walk(span, from, to, ids, segments) {
  ids.add(span.id);

  /* Latest finisher first. Ties broken by the later start, so between
     two children that end together the shorter one is taken first and
     the longer one still gets the remaining window — otherwise the
     longer span swallows the shorter and the shorter never appears. */
  const kids = span.children
    .filter((c) => dated(c) && c.end.getTime() > from && c.start.getTime() < to)
    .sort((a, b) => b.end - a.end || b.start - a.start);

  let cursor = to;
  for (const child of kids) {
    if (cursor <= from) break;
    const end = Math.min(child.end.getTime(), cursor);
    const start = Math.max(child.start.getTime(), from);
    // Entirely inside a sibling that was already taken — it overlapped
    // rather than extended, so it is off the path.
    if (end <= from || start >= cursor) continue;
    if (end < cursor) segments.push({ spanId: span.id, from: end, to: cursor });
    walk(child, start, end, ids, segments);
    cursor = start;
  }

  // Whatever the children never covered belongs to the parent.
  if (cursor > from) segments.push({ spanId: span.id, from, to: cursor });
}

const ids = new Set();
const rawSegments = [];
walk(ROOT, ROOT.start.getTime(), ROOT.end.getTime(), ids, rawSegments);

/** Every span on the critical path. */
export const CRITICAL_IDS = ids;

/* The self-time segments, in layout coordinates so both renderers can
   draw them without converting dates a second time. Merged per span:
   the walk can hand back two touching pieces of the same span when a
   child sat in the middle of it. */
export const CRITICAL_SEGMENTS = (() => {
  const byId = new Map();
  for (const seg of rawSegments) {
    const list = byId.get(seg.spanId) || [];
    list.push(seg);
    byId.set(seg.spanId, list);
  }
  const out = [];
  for (const list of byId.values()) {
    list.sort((a, b) => a.from - b.from);
    let current = null;
    for (const seg of list) {
      if (current && seg.from <= current.to) {
        current.to = Math.max(current.to, seg.to);
      } else {
        if (current) out.push(current);
        current = { ...seg };
      }
    }
    if (current) out.push(current);
  }
  return out.map((seg) => ({
    spanId: seg.spanId,
    from: new Date(seg.from),
    to: new Date(seg.to),
    ms: seg.to - seg.from,
    x: t(new Date(seg.from)),
    // No minimum width. A floor here would be a small lie with a large
    // consequence: the segments tile the root window exactly once, and
    // padding a one-day gap out to something visible breaks that
    // invariant — which is the only check that proves the walk correct.
    width: t(new Date(seg.to)) - t(new Date(seg.from)),
  }));
})();

/** How much of a span's own duration sits on the critical path, in ms. */
export const SELF_MS = (() => {
  const out = {};
  for (const seg of CRITICAL_SEGMENTS) {
    out[seg.spanId] = (out[seg.spanId] || 0) + seg.ms;
  }
  return out;
})();

/* What the answer rests on. Stated in the UI rather than kept here,
   because a critical path computed over half the trace and presented
   without that number is the kind of confident-looking output this whole
   design is meant to avoid. */
export const COVERAGE = (() => {
  const all = Object.values(SPAN_BY_ID);
  const withDates = all.filter(dated);
  return {
    total: all.length,
    dated: withDates.length,
    onPath: ids.size,
    // Parallel work that had recorded dates and still fell off the path.
    concurrent: withDates.filter((s) => !ids.has(s.id)).length,
  };
})();

export function isCritical(spanId) {
  return ids.has(spanId);
}

/* Indexed by span, for the renderers. The segments tile the root window
   exactly once, so drawing each one under its own row produces a single
   unbroken rule that descends through the tree and comes back up — the
   actual path of execution, drawn rather than described. */
export const SEGMENTS_BY_SPAN = CRITICAL_SEGMENTS.reduce((acc, seg) => {
  (acc[seg.spanId] ||= []).push(seg);
  return acc;
}, {});
