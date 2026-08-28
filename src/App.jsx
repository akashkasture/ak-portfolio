import { useEffect, useState } from 'react';
import { AnimatePresence, MotionConfig } from 'framer-motion';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';
import { SettingsProvider } from './context/SettingsContext';
import { WindowManagerProvider } from './context/WindowManagerContext';
import LoadingScreen from './components/LoadingScreen';
import Desktop from './os/Desktop';
import MobileWorkspace from './mobile/MobileWorkspace';
import { useIsMobile } from './hooks/useIsMobile';

function AppInner() {
  const isMobile = useIsMobile();
  const [loading, setLoading] = useState(true);
  const [bootForce, setBootForce] = useState(false);
  const [bootKey, setBootKey] = useState(0);

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
