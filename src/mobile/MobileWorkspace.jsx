import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { FileText, Briefcase, Layers, PenLine, TerminalSquare, Mail } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';
import Briefing from '../apps/Briefing';
import StackTab from './StackTab';
import WorkTab from './WorkTab';
import FlowMap from './FlowMap';
import { trackEvent } from '../utils/analytics';

const Terminal = lazy(() => import('../components/Terminal'));
const Contact = lazy(() => import('../components/Contact'));
const Writing = lazy(() => import('../apps/Writing'));

/* Phones don't get the desktop. There are no windows here, no dock, no
   wallpaper and no boot sequence — dragging a title bar with a thumb is
   a worse way to read than simply scrolling, and a 3D solar system is
   several megabytes charged to someone's mobile data for pixels behind
   an opaque panel.

   What's left is a workspace: six labelled places, one scroll each,
   Briefing first because that's the answer most visitors came for. */

const TABS = [
  { id: 'briefing', label: 'Briefing', icon: FileText, render: () => <Briefing flow={<FlowMap />} /> },
  { id: 'work', label: 'Work', icon: Briefcase, render: () => <WorkTab /> },
  { id: 'stack', label: 'Stack', icon: Layers, render: () => <StackTab /> },
  { id: 'writing', label: 'Writing', icon: PenLine, render: () => <Writing /> },
  { id: 'terminal', label: 'Shell', icon: TerminalSquare, fills: true, render: () => <Terminal /> },
  { id: 'contact', label: 'Contact', icon: Mail, render: () => <Contact compact /> },
];

const TAB_BAR_HEIGHT = 58;
const HEADER_HEIGHT = 52;

export default function MobileWorkspace() {
  const [active, setActive] = useState('briefing');
  const scrollRef = useRef(null);

  // Each tab is its own place, so switching starts at the top of it
  // rather than halfway down wherever the last one was left.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [active]);

  const select = (id) => {
    if (id === active) {
      scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setActive(id);
    trackEvent('mobile_tab_select', { tab: id });
  };

  const tab = TABS.find((t) => t.id === active) ?? TABS[0];

  return (
    <div
      className="fixed inset-0 flex flex-col"
      style={{ background: 'var(--bg)', color: 'var(--text-1)' }}
    >
      <header
        className="flex items-center gap-3 px-5 flex-shrink-0"
        style={{
          height: HEADER_HEIGHT,
          borderBottom: '1px solid var(--surface-border)',
          paddingTop: 'env(safe-area-inset-top)',
        }}
      >
        <div className="flex items-baseline gap-2 min-w-0">
          <span className="text-[13px] font-mono" style={{ color: 'var(--text-4)' }}>AK</span>
          <span className="text-[14px] font-medium truncate" style={{ color: 'var(--text-1)' }}>
            {tab.label}
          </span>
        </div>
        <div className="ml-auto flex items-center gap-1">
          <ThemeToggle />
        </div>
      </header>

      <main
        ref={scrollRef}
        className={`flex-1 min-h-0 overscroll-contain ${tab.fills ? 'overflow-hidden' : 'overflow-y-auto'}`}
      >
        {/* Keyed so each tab mounts fresh and the scroll container starts
            clean — no bleed-through of one tab's state into the next. */}
        <Suspense fallback={null}>
          <div key={tab.id} className={tab.fills ? 'h-full' : undefined}>
            {tab.render()}
          </div>
        </Suspense>
      </main>

      <nav
        className="flex-shrink-0 flex items-stretch"
        style={{
          height: TAB_BAR_HEIGHT,
          borderTop: '1px solid var(--surface-border)',
          background: 'var(--nav-bg)',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
        aria-label="Sections"
      >
        {TABS.map(({ id, label, icon: Icon }) => {
          const isActive = id === active;
          return (
            <button
              key={id}
              onClick={() => select(id)}
              aria-current={isActive ? 'page' : undefined}
              className="flex-1 flex flex-col items-center justify-center gap-1 transition-colors"
              style={{ color: isActive ? 'var(--os-accent)' : 'var(--text-4)' }}
            >
              <Icon size={18} strokeWidth={isActive ? 2.2 : 1.8} />
              <span className="text-[10px] font-medium tracking-wide">{label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
