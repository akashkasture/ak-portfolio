import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import ThemeToggle from '../components/ThemeToggle';
import Briefing from '../apps/Briefing';
import StackTab from './StackTab';
import WorkTab from './WorkTab';
import FlowMap from './FlowMap';
import MobileHome from './MobileHome';
import {
  IconBriefing, IconRocket, IconConstellation, IconWriting, IconPrompt, IconPlane, IconOrbit,
} from '../os/icons';
import { GithubIcon } from '../components/SocialIcons';
import { trackEvent } from '../utils/analytics';

const Terminal = lazy(() => import('../components/Terminal'));
const Contact = lazy(() => import('../components/Contact'));
const Writing = lazy(() => import('../apps/Writing'));
const GitHubApp = lazy(() => import('../apps/GitHubApp'));

/* Phones don't get the desktop's windows. Dragging a title bar with a
   thumb is a worse way to read than scrolling, so every place here is
   one scroll, full width.

   What they do get is the rest of the OS. Home is the phone's desktop:
   the same solar system that runs behind the desktop build's windows,
   framed for a portrait screen, with a launcher on it. The dock holds
   the four places most visitors want; the launcher holds all of them,
   the way a home screen holds every app and a dock holds the favourites.

   Icons come from the AK OS set the desktop dock uses rather than from
   the icon library, so the two surfaces read as one system. */

const PLACES = [
  {
    id: 'briefing', label: 'Briefing', icon: IconBriefing, tint: ['#3f5a7a', '#2c405a'],
    dock: true, render: () => <Briefing flow={<FlowMap />} />,
  },
  {
    id: 'work', label: 'Work', icon: IconRocket, tint: ['#0369a1', '#075985'],
    dock: true, render: () => <WorkTab />,
  },
  {
    id: 'stack', label: 'Stack', icon: IconConstellation, tint: ['#0f766e', '#115e59'],
    render: () => <StackTab />,
  },
  {
    id: 'writing', label: 'Writing', icon: IconWriting, tint: ['#a1554e', '#7d3f39'],
    render: () => <Writing />,
  },
  {
    id: 'terminal', label: 'Shell', icon: IconPrompt, tint: ['#1e293b', '#0f172a'],
    dock: true, fills: true, render: () => <Terminal />,
  },
  {
    id: 'github', label: 'GitHub', icon: GithubIcon, tint: ['#3d434b', '#24292e'],
    render: () => <GitHubApp />,
  },
  {
    id: 'contact', label: 'Contact', icon: IconPlane, tint: ['#2563eb', '#1d4ed8'],
    dock: true, render: () => <Contact compact />,
  },
];

const HOME = { id: 'home', label: 'Home', icon: IconOrbit, fills: true };
const DOCK = [HOME, ...PLACES.filter((p) => p.dock)];

const TAB_BAR_HEIGHT = 58;
const HEADER_HEIGHT = 52;

export default function MobileWorkspace({ onExitWorkspace }) {
  const [active, setActive] = useState('home');
  const scrollRef = useRef(null);

  // Each place is its own place, so switching starts at the top of it
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

  const place = active === 'home' ? HOME : PLACES.find((p) => p.id === active) ?? HOME;

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
            {place.label}
          </span>
        </div>
        <div className="ml-auto flex items-center gap-1">
          <ThemeToggle />
        </div>
      </header>

      <main
        ref={scrollRef}
        className={`flex-1 min-h-0 overscroll-contain ${place.fills ? 'overflow-hidden' : 'overflow-y-auto'}`}
      >
        {/* Keyed so each place mounts fresh and the scroll container
            starts clean — no bleed-through of one place's state into the
            next. Home unmounts along with everything else when you leave
            it, which drops its WebGL context rather than leaving a
            canvas rendering an orrery nobody is looking at; coming back
            rebuilds it from cached textures. */}
        <Suspense fallback={null}>
          {active === 'home' ? (
            <MobileHome places={PLACES} onOpen={select} onExit={onExitWorkspace} />
          ) : (
            <div key={place.id} className={place.fills ? 'h-full' : undefined}>
              {place.render()}
            </div>
          )}
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
        {DOCK.map(({ id, label, icon: Icon }) => {
          const isActive = id === active;
          return (
            <button
              key={id}
              onClick={() => select(id)}
              aria-current={isActive ? 'page' : undefined}
              className="flex-1 flex flex-col items-center justify-center gap-1 transition-colors"
              style={{ color: isActive ? 'var(--os-accent)' : 'var(--text-4)' }}
            >
              <Icon size={19} />
              <span className="text-[10px] font-medium tracking-wide">{label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
