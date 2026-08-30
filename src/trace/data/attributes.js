import { SPANS } from './trace';
import { skills } from '../../data/portfolio';

/* The hot path.

   In a trace viewer, "which parts of the system touched Postgres" is
   answered by filtering on a span attribute — you don't build a
   separate skills graph, you interrogate the spans you already have.
   That's the whole reason Skills maps onto attributes in this design:
   the interaction the brief asks for ("click a technology, highlight
   the projects that used it") already exists as a primitive.

   This module is the index that makes it O(1). Built once at module
   load from the span tree, never recomputed. */

const index = new Map();

for (const span of SPANS) {
  for (const attr of span.attributes) {
    const key = attr.key.toLowerCase();
    if (!index.has(key)) {
      index.set(key, { key: attr.key, category: attr.category, spanIds: [], workCount: 0 });
    }
    const entry = index.get(key);
    entry.spanIds.push(span.id);
    /* Two different questions, two different numbers.

       `spanIds` is what the hot path lights: everything carrying the
       attribute, structural subsystem spans included, so filtering on
       Redis illuminates the Redis service inside each project too.

       `workCount` is what gets *shown*, and counts only real work.
       A structural span exists because its project already listed that
       technology, so counting both would report Redis appearing in
       sixteen places when it appears in six pieces of work. */
    if (!span.structural) entry.workCount += 1;
    // A span may know a category the first one to claim the key didn't.
    if (!entry.category && attr.category) entry.category = attr.category;
  }
}

export const ATTRIBUTES = [...index.values()]
  .filter((a) => a.workCount > 0)
  .sort((a, b) => b.workCount - a.workCount || a.key.localeCompare(b.key));

export const ATTRIBUTE_BY_KEY = Object.fromEntries(
  ATTRIBUTES.map((a) => [a.key.toLowerCase(), a])
);

/* Grouped for the inspector, in the skills data's own category order so
   the panel reads like the stack rather than like a tag cloud.
   Attributes with no matching skill category are collected last — those
   are technologies a project lists that the skills data doesn't, which
   is worth surfacing rather than hiding. */
export const ATTRIBUTE_GROUPS = (() => {
  const order = skills.map((g) => g.category);
  const buckets = new Map(order.map((c) => [c, []]));
  const loose = [];
  for (const attr of ATTRIBUTES) {
    if (attr.category && buckets.has(attr.category)) buckets.get(attr.category).push(attr);
    else loose.push(attr);
  }
  const groups = order
    .map((category) => ({
      category,
      color: skills.find((g) => g.category === category)?.color,
      items: buckets.get(category),
    }))
    .filter((g) => g.items.length > 0);
  if (loose.length) groups.push({ category: 'Also used', color: null, items: loose });
  return groups;
})();

// The span ids a filter lights up. Empty selection means "everything",
// which the renderers read as no filter rather than as nothing.
export function spanIdsFor(attributeKey) {
  if (!attributeKey) return null;
  const entry = ATTRIBUTE_BY_KEY[attributeKey.toLowerCase()];
  return entry ? new Set(entry.spanIds) : new Set();
}
