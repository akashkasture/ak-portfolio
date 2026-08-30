/* Writing.

   ── How to add a post ────────────────────────────────────────────────
   Add an entry below. A post is `published` the moment it has a `date`
   and a non-empty `body`; until then it shows in the list as planned,
   with no date and no reading time, because inventing either would be
   claiming work that doesn't exist yet.

   `body` is an array of blocks rather than a markdown string. That's
   deliberate: rendering markdown means either shipping a parser or
   setting innerHTML, and the second one is the exact hole the site's CSP
   is there to close. Blocks are also easier to extend — a diagram block
   can render an SVG that a markdown string never could.

   Block types:
     { type: 'p',    text }                    paragraph
     { type: 'h',    text }                    section heading
     { type: 'list', items: [] }               bullets
     { type: 'code', lang, code }              fenced code
     { type: 'note', text }                    an aside / caveat
     { type: 'quote', text }                   a pulled-out line

   Reading time is counted from the words actually present. It is never
   set by hand.
   ─────────────────────────────────────────────────────────────────── */

export const posts = [
  {
    slug: 'scaling-an-application',
    title: 'How to scale an application',
    summary:
      'The order I actually reach for things when a service starts falling over, and why the order matters more than any single technique.',
    tags: ['Architecture', 'Scaling'],
    date: null,
    body: [],
  },
  {
    slug: 'the-database-is-the-bottleneck',
    title: '90% of the time, the database is the bottleneck',
    summary:
      'Why scaling the application tier so often changes nothing, and how to tell whether you actually have a database problem before you go rewriting services.',
    tags: ['Databases', 'Performance'],
    date: null,
    body: [],
  },
  {
    slug: 'scaling-postgresql',
    title: 'How I scaled PostgreSQL',
    summary:
      'What I changed, in the order I changed it, on a Postgres instance that had stopped keeping up — and which of those changes actually mattered.',
    tags: ['PostgreSQL', 'Performance'],
    date: null,
    body: [],
  },
  {
    slug: 'database-as-hot-cache',
    title: 'Using a database as a hot cache in front of a master database',
    summary:
      'Putting a second database in front of the system of record instead of a cache — what it buys you, what it costs, and where it goes wrong.',
    tags: ['Databases', 'Caching', 'Architecture'],
    date: null,
    body: [],
  },
];

// Prose blocks only — code isn't read at prose speed, so counting it
// would overstate every post that contains a listing.
const WORDS_PER_MINUTE = 220;

function wordCount(body) {
  return body.reduce((n, block) => {
    if (block.type === 'code') return n;
    const text = block.type === 'list' ? block.items.join(' ') : block.text || '';
    return n + text.trim().split(/\s+/).filter(Boolean).length;
  }, 0);
}

export const POSTS = posts.map((post) => {
  const published = Boolean(post.date) && post.body.length > 0;
  return {
    ...post,
    published,
    readingMinutes: published ? Math.max(1, Math.round(wordCount(post.body) / WORDS_PER_MINUTE)) : null,
  };
});

// Newest first; planned posts sort after everything published.
export const POSTS_BY_RECENCY = [...POSTS].sort((a, b) => {
  if (a.published !== b.published) return a.published ? -1 : 1;
  return (b.date || '').localeCompare(a.date || '');
});

export const POST_BY_SLUG = Object.fromEntries(POSTS.map((p) => [p.slug, p]));

export const hasPublishedPosts = POSTS.some((p) => p.published);
