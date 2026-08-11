import { createContext, useContext, useEffect, useState } from 'react';

export const ACCENT_THEMES = ['default', 'midnight', 'terminal', 'arctic', 'cyber'];

const Ctx = createContext({ theme: 'dark', toggle: () => {}, accent: 'default', setAccent: () => {} });

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('ak-theme') || 'dark');
  const [accent, setAccent] = useState(() => {
    const saved = localStorage.getItem('ak-accent');
    return ACCENT_THEMES.includes(saved) ? saved : 'default';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('ak-theme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute('data-accent', accent);
    localStorage.setItem('ak-accent', accent);
  }, [accent]);

  const toggle = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

  return <Ctx.Provider value={{ theme, toggle, accent, setAccent }}>{children}</Ctx.Provider>;
}

export const useTheme = () => useContext(Ctx);
