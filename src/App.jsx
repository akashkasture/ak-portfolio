import { useEffect, useState } from 'react';
import { AnimatePresence, MotionConfig } from 'framer-motion';
import { ThemeProvider } from './context/ThemeContext';
import { WindowManagerProvider } from './context/WindowManagerContext';
import LoadingScreen from './components/LoadingScreen';
import Desktop from './os/Desktop';

function AppInner() {
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
        <AppInner />
      </ThemeProvider>
    </MotionConfig>
  );
}
