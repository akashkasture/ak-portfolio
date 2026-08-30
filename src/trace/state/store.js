import { useSyncExternalStore } from 'react';
import { SPAN_BY_ID, ancestorsOf } from '../data/trace';
import { spanIdsFor } from '../data/attributes';

/* The interaction engine.

   A module-level store rather than a React context, for one reason that
   matters later: the WebGL layer needs to read the playhead every frame.
   Through context that means a re-render per frame of everything under
   the provider; through a store the scene subscribes directly and React
   never hears about it.

   No THREE here, and no DOM. Both renderers drive the same state, which
   is what keeps the flat waterfall and the 3D scene showing the same
   thing rather than two views that drift. */

const EMPTY = Object.freeze(new Set());

let state = {
  playhead: 1, // starts at the present: the trace opens already resolved
  focusId: null,
  filter: null, // an attribute key — the hot path
  projection: 0, // 0 = waterfall (time), 1 = service map (topology)
  expanded: new Set(['root']),
  hoverId: null,
};

const listeners = new Set();

function set(patch) {
  const next = { ...state, ...patch };
  // Cheap identity guard — scroll fires far more often than it changes
  // anything, and every no-op set would otherwise wake every subscriber.
  let changed = false;
  for (const k in patch) {
    if (next[k] !== state[k]) {
      changed = true;
      break;
    }
  }
  if (!changed) return;
  state = next;
  for (const fn of listeners) fn();
}

export function getState() {
  return state;
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/** Subscribe a component to the whole store. */
export function useTrace() {
  return useSyncExternalStore(subscribe, getState, getState);
}

// ── Derived ────────────────────────────────────────────────────────

/* The set of spans the current filter lights up. `null` means no filter
   is active, which every renderer reads as "show everything" — distinct
   from an empty set, which means "a filter is on and nothing matched". */
export function litSpanIds(s = state) {
  return s.filter ? spanIdsFor(s.filter) : null;
}

/** A span is visible when every ancestor above it is expanded. */
export function isVisible(spanId, s = state) {
  const span = SPAN_BY_ID[spanId];
  if (!span || span.root) return true;
  return ancestorsOf(spanId).every((a) => s.expanded.has(a.id));
}

// ── Actions ────────────────────────────────────────────────────────

export const actions = {
  setPlayhead(position) {
    set({ playhead: Math.min(1, Math.max(0, position)) });
  },

  hover(spanId) {
    set({ hoverId: spanId });
  },

  /* Focusing opens the path down to the span, so selecting something
     from the palette or a deep link can't land on a row whose parents
     are collapsed and appear to do nothing. */
  focus(spanId) {
    if (!spanId) return set({ focusId: null });
    const expanded = new Set(state.expanded);
    for (const a of ancestorsOf(spanId)) expanded.add(a.id);
    expanded.add(spanId);
    set({ focusId: spanId, expanded });
  },

  /** Up one level; from a top-level span, out to no focus at all. */
  ascend() {
    const chain = state.focusId ? ancestorsOf(state.focusId) : [];
    const parent = chain[chain.length - 1];
    set({ focusId: parent && !parent.root ? parent.id : null });
  },

  toggleExpanded(spanId) {
    const expanded = new Set(state.expanded);
    if (expanded.has(spanId)) expanded.delete(spanId);
    else expanded.add(spanId);
    set({ expanded });
  },

  /** Clicking the active attribute clears it — the filter is a toggle. */
  toggleFilter(attributeKey) {
    const next = state.filter === attributeKey ? null : attributeKey;
    set({ filter: next });
  },

  setProjection(value) {
    set({ projection: Math.min(1, Math.max(0, value)) });
  },

  /** Escape: shed one layer of state at a time, never everything at once. */
  escape() {
    if (state.focusId) return actions.ascend();
    if (state.filter) return set({ filter: null });
    if (state.projection > 0.5) return set({ projection: 0 });
    return undefined;
  },
};

export { EMPTY };
