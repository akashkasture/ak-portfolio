import { useEffect, useRef, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { POSTS_BY_RECENCY, POST_BY_SLUG, hasPublishedPosts } from '../data/posts';
import PostBody from '../components/PostBody';
import { trackEvent } from '../utils/analytics';

/* Notes on systems work — the same component on the phone and in a
   desktop window, because a post is a column of text either way.

   Posts that aren't written yet are listed rather than hidden. A reader
   deciding whether this is worth a bookmark is better served by knowing
   what's coming than by an empty page, and an un-tappable row that says
   "planned" can't be mistaken for something to read. What it must never
   do is carry a date or a reading time — those would be claims about
   work that doesn't exist. */

function formatDate(iso) {
  if (!iso) return null;
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

function Meta({ post }) {
  const date = formatDate(post.date);
  return (
    <div className="flex items-center gap-2 text-[11.5px] font-mono" style={{ color: 'var(--text-4)' }}>
      {post.published ? (
        <>
          {date && <span>{date}</span>}
          {date && <span aria-hidden>·</span>}
          <span>{post.readingMinutes} min</span>
        </>
      ) : (
        <span
          className="px-1.5 py-0.5 rounded"
          style={{ border: '1px solid var(--surface-border)', color: 'var(--text-4)' }}
        >
          planned
        </span>
      )}
    </div>
  );
}

function Row({ post, onOpen }) {
  const inner = (
    <>
      <div className="flex items-start justify-between gap-3">
        <div
          className="text-[15px] font-medium leading-snug"
          style={{ color: post.published ? 'var(--text-1)' : 'var(--text-3)' }}
        >
          {post.title}
        </div>
      </div>
      <p className="text-[13.5px] leading-relaxed mt-1.5" style={{ color: 'var(--text-3)' }}>
        {post.summary}
      </p>
      <div className="flex items-center gap-3 mt-2.5 flex-wrap">
        <Meta post={post} />
        <span className="text-[11.5px] font-mono" style={{ color: 'var(--text-4)' }}>
          {post.tags.join(' · ')}
        </span>
      </div>
    </>
  );

  const style = { borderBottom: '1px solid var(--surface-border)' };

  // A planned post is not a link to nowhere.
  return post.published ? (
    <button onClick={() => onOpen(post.slug)} className="w-full text-left py-5" style={style}>
      {inner}
    </button>
  ) : (
    <div className="py-5" style={style}>
      {inner}
    </div>
  );
}

export default function Writing() {
  const [slug, setSlug] = useState(null);
  const topRef = useRef(null);
  const post = slug ? POST_BY_SLUG[slug] : null;

  // Opening a post should start at its first line, not wherever the list
  // happened to be scrolled to.
  useEffect(() => {
    topRef.current?.scrollIntoView({ block: 'start' });
  }, [slug]);

  const open = (next) => {
    setSlug(next);
    trackEvent('post_open', { slug: next });
  };

  return (
    <div className="@container">
      <div ref={topRef} className="max-w-2xl mx-auto px-5 py-7 sm:px-8 sm:py-9">
        {post ? (
          <article>
            <button
              onClick={() => setSlug(null)}
              className="flex items-center gap-1.5 text-[13px] mb-6"
              style={{ color: 'var(--text-3)' }}
            >
              <ArrowLeft size={14} />
              Writing
            </button>
            <h1
              className="font-display text-[24px] @sm:text-[28px] leading-tight"
              style={{ color: 'var(--text-1)' }}
            >
              {post.title}
            </h1>
            <div className="mt-3 mb-7">
              <Meta post={post} />
            </div>
            <PostBody body={post.body} />
          </article>
        ) : (
          <>
            <h1 className="font-display text-[26px] leading-tight" style={{ color: 'var(--text-1)' }}>
              Writing
            </h1>
            <p className="text-[13px] mt-1.5" style={{ color: 'var(--text-3)' }}>
              Notes on scaling, databases, and the things that break first.
            </p>

            {!hasPublishedPosts && (
              <p className="text-[13px] leading-relaxed mt-5" style={{ color: 'var(--text-4)' }}>
                Nothing published yet — these are the ones being written.
              </p>
            )}

            <div className="mt-4">
              {POSTS_BY_RECENCY.map((p) => (
                <Row key={p.slug} post={p} onOpen={open} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
