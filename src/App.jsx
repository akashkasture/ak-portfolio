import { Suspense, lazy, useEffect, useState } from 'react';
import { AnimatePresence, MotionConfig } from 'framer-motion';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';
import { SettingsProvider } from './context/SettingsContext';
import { WindowManagerProvider } from './context/WindowManagerContext';
import TraceStage from './trace/ui/TraceStage';
import MobileTrace from './trace/ui/MobileTrace';

/* Trace is the front door, so it is the only surface on the critical
   path. The workspace and the phone workspace are each a whole app's
   worth of code, and importing them eagerly meant a desktop visitor who
   only ever reads the trace still downloaded the mobile tab bar, the
   Briefing app and the window manager. */
const LoadingScreen = lazy(() => import('./components/LoadingScreen'));
const Desktop = lazy(() => import('./os/Desktop'));
const MobileWorkspace = lazy(() => import('./mobile/MobileWorkspace'));
import { useIsMobile } from './hooks/useIsMobile';

function AppInner() {
  const isMobile = useIsMobile();
  const [loading, setLoading] = useState(true);
  const [bootForce, setBootForce] = useState(false);
  const [bootKey, setBootKey] = useState(0);
  /* Trace is the front door; the workspace is a room you choose to walk
     into. Session-scoped rather than persisted — a returning visitor
     should get the trace again, not be dropped back into whatever
     desktop layout they left behind weeks ago. */
  const [inWorkspace, setInWorkspace] = useState(() => {
    try { return sessionStorage.getItem('ak:surface') === 'workspace'; } catch { return false; }
  });

  const enterWorkspace = () => {
    setInWorkspace(true);
    try { sessionStorage.setItem('ak:surface', 'workspace'); } catch { /* private mode */ }
  };

  /* The way back. Until now the workspace was a one-way door: entering
     it wrote the session key, so even a reload came back into the
     workspace and the trace was unreachable for the rest of the visit. */
  const exitWorkspace = () => {
    setInWorkspace(false);
    try { sessionStorage.removeItem('ak:surface'); } catch { /* private mode */ }
  };

  useEffect(() => {
    const onReplay = () => {
      setBootForce(true);
      setBootKey((k) => k + 1);
      setLoading(true);
    };
    /* The desktop's exit lives four levels down inside the OS chrome, so
       it travels as an event rather than as a prop threaded through the
       window manager. Same idiom the boot replay already uses. */
    const onExit = () => exitWorkspace();
    window.addEventListener('ak-os:replay-boot', onReplay);
    window.addEventListener('ak-os:exit-workspace', onExit);
    return () => {
      window.removeEventListener('ak-os:replay-boot', onReplay);
      window.removeEventListener('ak-os:exit-workspace', onExit);
    };
  }, []);

  // Phones skip the boot sequence entirely. A BIOS readout is a desktop
  // joke, and making someone on a phone watch one before they can read
  // anything is the opposite of what they came for.
  /* The trace needs no boot sequence — it is the thing someone came to
     read, and a BIOS readout in front of it is a toll booth. Both
     surfaces get the same front door and the same way down into the
     workspace; only the layout differs. */
  if (!inWorkspace) {
    return isMobile ? (
      <MobileTrace onEnterWorkspace={enterWorkspace} />
    ) : (
      <TraceStage onEnterWorkspace={enterWorkspace} />
    );
  }

  if (isMobile) return (
    <Suspense fallback={null}>
      <MobileWorkspace onExitWorkspace={exitWorkspace} />
    </Suspense>
  );

  return (
    <Suspense fallback={null}>
      <AnimatePresence>
        {loading && (
          <LoadingScreen key={bootKey} force={bootForce} onDone={() => setLoading(false)} />
        )}
      </AnimatePresence>

      {!loading && (
        <WindowManagerProvider>
          <Desktop />
        </WindowManagerProvider>
      )}
    </Suspense>
  );
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <ThemeProvider>
        <NotificationProvider>
          <SettingsProvider>
            <AppInner />
          </SettingsProvider>
        </NotificationProvider>
      </ThemeProvider>
    </MotionConfig>
  );
}
