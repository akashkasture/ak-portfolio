import { createContext, useContext, useEffect, useReducer } from 'react';
import { APPS } from '../apps/registry';

const STORAGE_KEY = 'ak-os-window-state';

function loadSession() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || !parsed.windows) return null;
    return parsed;
  } catch {
    return null;
  }
}

function saveSession(state) {
  try {
    const { windows, activeId, nextZ } = state;
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ windows, activeId, nextZ }));
  } catch {
    // private browsing / quota — window layout persistence is a nice-to-have, not critical
  }
}

function topNonMinimizedId(windows, excludeId) {
  let best = null;
  let bestZ = -Infinity;
  for (const [id, w] of Object.entries(windows)) {
    if (id === excludeId || w.minimized) continue;
    if (w.zIndex > bestZ) { bestZ = w.zIndex; best = id; }
  }
  return best;
}

function makeWindow(appId, zIndex) {
  const app = APPS[appId];
  return {
    appId,
    x: app.defaultPosition.x,
    y: app.defaultPosition.y,
    width: app.defaultSize.width,
    height: app.defaultSize.height,
    zIndex,
    minimized: false,
    maximized: false,
    prevRect: null,
  };
}

function defaultState() {
  return {
    windows: { about: makeWindow('about', 1) },
    activeId: 'about',
    nextZ: 2,
    recruiterMode: false,
    preRecruiterSnapshot: null,
  };
}

function init() {
  const saved = loadSession();
  if (!saved) return defaultState();
  const windows = saved.windows || {};
  const activeId = saved.activeId && windows[saved.activeId] ? saved.activeId : topNonMinimizedId(windows);
  return {
    windows,
    activeId,
    nextZ: saved.nextZ ?? 1,
    recruiterMode: false,
    preRecruiterSnapshot: null,
  };
}

function reducer(state, action) {
  switch (action.type) {
    case 'OPEN_APP': {
      const { appId } = action;
      if (!APPS[appId]) return state;
      const existing = state.windows[appId];
      const zIndex = state.nextZ;
      const nextWindow = existing
        ? { ...existing, minimized: false, zIndex }
        : makeWindow(appId, zIndex);
      return {
        ...state,
        windows: { ...state.windows, [appId]: nextWindow },
        activeId: appId,
        nextZ: state.nextZ + 1,
      };
    }
    case 'CLOSE_APP': {
      const { appId } = action;
      if (!state.windows[appId]) return state;
      const nextWindows = { ...state.windows };
      delete nextWindows[appId];
      const activeId = state.activeId === appId ? topNonMinimizedId(nextWindows) : state.activeId;
      return { ...state, windows: nextWindows, activeId };
    }
    case 'FOCUS_APP': {
      const { appId } = action;
      const existing = state.windows[appId];
      if (!existing || existing.minimized) return state;
      return {
        ...state,
        windows: { ...state.windows, [appId]: { ...existing, zIndex: state.nextZ } },
        activeId: appId,
        nextZ: state.nextZ + 1,
      };
    }
    case 'MINIMIZE_APP': {
      const { appId } = action;
      const existing = state.windows[appId];
      if (!existing) return state;
      const nextWindows = { ...state.windows, [appId]: { ...existing, minimized: true } };
      const activeId = state.activeId === appId ? topNonMinimizedId(nextWindows) : state.activeId;
      return { ...state, windows: nextWindows, activeId };
    }
    case 'TOGGLE_MAXIMIZE': {
      const { appId } = action;
      const existing = state.windows[appId];
      if (!existing) return state;
      if (existing.maximized) {
        const rect = existing.prevRect || {
          x: existing.x, y: existing.y, width: existing.width, height: existing.height,
        };
        return {
          ...state,
          windows: { ...state.windows, [appId]: { ...existing, ...rect, maximized: false, prevRect: null } },
        };
      }
      return {
        ...state,
        windows: {
          ...state.windows,
          [appId]: {
            ...existing,
            maximized: true,
            prevRect: { x: existing.x, y: existing.y, width: existing.width, height: existing.height },
          },
        },
      };
    }
    case 'UPDATE_RECT': {
      const { appId, rect } = action;
      const existing = state.windows[appId];
      if (!existing || existing.maximized) return state;
      return { ...state, windows: { ...state.windows, [appId]: { ...existing, ...rect } } };
    }
    case 'TOGGLE_RECRUITER': {
      if (state.recruiterMode) {
        const snap = state.preRecruiterSnapshot || { windows: {}, activeId: null };
        return {
          ...state,
          windows: snap.windows,
          activeId: snap.activeId,
          recruiterMode: false,
          preRecruiterSnapshot: null,
        };
      }
      return {
        ...state,
        preRecruiterSnapshot: { windows: state.windows, activeId: state.activeId },
        windows: {},
        activeId: 'recruiter',
        recruiterMode: true,
      };
    }
    default:
      return state;
  }
}

const Ctx = createContext(null);

export function WindowManagerProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, init);

  useEffect(() => {
    // Intentionally excludes recruiterMode/preRecruiterSnapshot — those are transient toggle
    // state that should not be persisted across a session-storage restore.
    saveSession(state);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.windows, state.activeId, state.nextZ]);

  const api = {
    windows: state.windows,
    activeId: state.activeId,
    recruiterMode: state.recruiterMode,
    openApp: (appId) => dispatch({ type: 'OPEN_APP', appId }),
    closeApp: (appId) => dispatch({ type: 'CLOSE_APP', appId }),
    focusApp: (appId) => dispatch({ type: 'FOCUS_APP', appId }),
    minimizeApp: (appId) => dispatch({ type: 'MINIMIZE_APP', appId }),
    toggleMaximize: (appId) => dispatch({ type: 'TOGGLE_MAXIMIZE', appId }),
    updateWindowRect: (appId, rect) => dispatch({ type: 'UPDATE_RECT', appId, rect }),
    toggleRecruiterMode: () => dispatch({ type: 'TOGGLE_RECRUITER' }),
  };

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useWindowManager() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useWindowManager must be used within WindowManagerProvider');
  return ctx;
}
