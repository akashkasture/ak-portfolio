import { APP_LIST } from '../apps/registry';

/* One list, two consumers: useKeyboardShortcuts runs `match`/`run`, and
   ShortcutsOverlay prints `keys`/`label`. A key map that's maintained
   separately from its handlers is a key map that lies within a week, so
   there is deliberately no second copy of this anywhere.

   Alt is the modifier throughout. Cmd/Ctrl combinations belong to the
   browser — Cmd+W closing the tab instead of the window would be a
   genuinely hostile surprise — and Alt is the one modifier a browser
   reliably leaves alone. */

const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform || '');
export const MOD = isMac ? '⌘' : 'Ctrl';
export const ALT = isMac ? '⌥' : 'Alt';

const alt = (e, code) => e.altKey && !e.ctrlKey && !e.metaKey && e.code === code;

export const SHORTCUTS = [
  {
    id: 'palette',
    group: 'General',
    keys: [MOD, 'K'],
    label: 'Open command palette',
    match: (e) => (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k',
    // The palette owns its own listener so it can toggle; this entry exists
    // for the printed map and as a no-op here.
    run: () => {},
    passive: true,
  },
  {
    id: 'shortcuts',
    group: 'General',
    keys: ['?'],
    label: 'Show this shortcuts map',
    match: (e) => e.key === '?',
    run: () => window.dispatchEvent(new CustomEvent('ak-os:show-shortcuts')),
  },
  {
    id: 'escape',
    group: 'General',
    keys: ['Esc'],
    label: 'Dismiss whatever is open',
    match: () => false, // handled by each overlay that can be dismissed
    run: () => {},
    passive: true,
  },
  {
    id: 'cycle',
    group: 'Windows',
    keys: [ALT, '`'],
    label: 'Cycle through open windows',
    match: (e) => alt(e, 'Backquote'),
    run: (api) => api.cycleWindows(),
  },
  {
    id: 'close',
    group: 'Windows',
    keys: [ALT, 'W'],
    label: 'Close the active window',
    match: (e) => alt(e, 'KeyW'),
    run: (api) => api.activeId && api.closeApp(api.activeId),
  },
  {
    id: 'minimize',
    group: 'Windows',
    keys: [ALT, 'M'],
    label: 'Minimize the active window',
    match: (e) => alt(e, 'KeyM'),
    run: (api) => api.activeId && api.minimizeApp(api.activeId),
  },
  {
    id: 'maximize',
    group: 'Windows',
    keys: [ALT, '↵'],
    label: 'Maximize or restore the active window',
    match: (e) => alt(e, 'Enter'),
    run: (api) => api.activeId && api.toggleMaximize(api.activeId),
  },
  {
    id: 'recruiter',
    group: 'Windows',
    keys: [ALT, 'R'],
    label: 'Toggle Recruiter Mode',
    match: (e) => alt(e, 'KeyR'),
    run: (api) => api.toggleRecruiterMode(),
  },
  {
    id: 'launch',
    group: 'Apps',
    keys: [ALT, `1–${Math.min(APP_LIST.length, 9)}`],
    label: 'Open the nth app in the dock',
    match: (e) => e.altKey && !e.ctrlKey && !e.metaKey && /^Digit[1-9]$/.test(e.code),
    run: (api, e) => {
      const app = APP_LIST[Number(e.code.slice(5)) - 1];
      if (app) api.openApp(app.id);
    },
  },
];

export const SHORTCUT_GROUPS = ['General', 'Windows', 'Apps'];
