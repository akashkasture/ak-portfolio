import { useEffect, useState } from 'react';
import { AnimatePresence, MotionConfig } from 'framer-motion';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';
import { SettingsProvider } from './context/SettingsContext';
import { WindowManagerProvider } from './context/WindowManagerContext';
import LoadingScreen from './components/LoadingScreen';
import TraceStage from './trace/ui/TraceStage';
import Desktop from './os/Desktop';
import MobileWorkspace from './mobile/MobileWorkspace';
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

  useEffect(() => {
    const onReplay = () => {
      setBootForce(true);
      setBootKey((k) => k + 1);
      setLoading(true);
    };
    window.addEventListener('ak-os:replay-boot', onReplay);
    return () => window.removeEventListener('ak-os:replay-boot', onReplay);
  }, []);

  // Phones skip the boot sequence entirely. A BIOS readout is a desktop
  // joke, and making someone on a phone watch one before they can read
  // anything is the opposite of what they came for.
  if (isMobile) return <MobileWorkspace />;

  // The trace needs no boot sequence — it is the thing someone came to
  // read, and a BIOS readout in front of it is a toll booth.
  if (!inWorkspace) return <TraceStage onEnterWorkspace={enterWorkspace} />;

  return (
    <>
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
    </>
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
