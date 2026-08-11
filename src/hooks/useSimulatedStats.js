import { useEffect, useState } from 'react';

function wave(base, amplitude, period, t) {
  const jitter = (Math.random() - 0.5) * amplitude * 0.3;
  return Math.round(base + amplitude * Math.sin((t / period) * Math.PI * 2) + jitter);
}

export function useSimulatedStats() {
  const [stats, setStats] = useState({ cpu: 23, ram: 42 });
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const start = Date.now();
    const id = setInterval(() => {
      const t = (Date.now() - start) / 1000;
      setStats({
        cpu: Math.min(97, Math.max(4, wave(28, 18, 40, t))),
        ram: Math.min(97, Math.max(15, wave(45, 12, 65, t + 20))),
      });
    }, 1800);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return { ...stats, time: now };
}
