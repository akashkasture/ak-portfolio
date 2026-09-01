import { useEffect, useRef } from 'react';
import { SPAN_BY_ID } from '../data/trace';
import { getState, subscribe, actions } from './store';

/* The trace in the address bar.

   A trace has a URL. That is not a flourish — it is most of what makes
   trace tooling usable, because the thing you found is only worth
   finding if you can hand it to someone else. Here it means a link can
   open directly on one project, already drilled in, with the attribute
   that matters already lit, instead of on the front door with a note
   saying where to click.

   Only the three pieces of state that are worth sharing are carried:
   what is selected, what is being drilled into, and which attribute is
   filtered. The playhead, the camera arc and which rows happen to be
   expanded are view state — restoring them would make a shared link
   arrive mid-gesture. */

const PARAMS = { focusId: 'span', drillId: 'in', filter: 'attr' };

function readUrl() {
  if (typeof window === 'undefined') return null;
  const q = new URLSearchParams(window.location.search);
  return {
    focusId: q.get(PARAMS.focusId),
    drillId: q.get(PARAMS.drillId),
    filter: q.get(PARAMS.filter),
  };
}

/** The link that would restore the state passed in. */
export function linkFor(state = getState()) {
  if (typeof window === 'undefined') return '';
  const q = new URLSearchParams();
  for (const [key, param] of Object.entries(PARAMS)) {
    if (state[key]) q.set(param, state[key]);
  }
  const query = q.toString();
  return `${window.location.origin}${window.location.pathname}${query ? `?${query}` : ''}`;
}

/** Two-way sync between the store and the query string. */
export function useTraceUrl() {
  const applied = useRef(false);

  useEffect(() => {
    if (applied.current) return;
    applied.current = true;

    const incoming = readUrl();
    if (!incoming) return;
    // Ignore ids that no longer exist. A span id is derived from the
    // data, so an old link can outlive the thing it pointed at, and
    // landing on a blank inspector is worse than landing on the trace.
    if (incoming.drillId && SPAN_BY_ID[incoming.drillId]) actions.descend(incoming.drillId);
    if (incoming.focusId && SPAN_BY_ID[incoming.focusId]) actions.focus(incoming.focusId);
    if (incoming.filter) actions.toggleFilter(incoming.filter);
  }, []);

  useEffect(() => {
    // replaceState, not pushState: focusing spans is exploration, and a
    // back button that has to be pressed forty times to leave the page
    // is a worse outcome than one that leaves immediately.
    let last = window.location.href;
    const write = () => {
      const next = linkFor();
      if (next === last) return;
      last = next;
      window.history.replaceState(null, '', next);
    };
    write();
    return subscribe(write);
  }, []);
}
