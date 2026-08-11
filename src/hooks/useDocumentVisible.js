import { useEffect, useState } from 'react';

/* Backs the space scene's frameloop pause — no point burning GPU/battery
   animating a canvas nobody's looking at. */
export function useDocumentVisible() {
  const [visible, setVisible] = useState(() => document.visibilityState !== 'hidden');

  useEffect(() => {
    const onChange = () => setVisible(document.visibilityState !== 'hidden');
    document.addEventListener('visibilitychange', onChange);
    return () => document.removeEventListener('visibilitychange', onChange);
  }, []);

  return visible;
}
