import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { useTheme } from '../context/ThemeContext';

const NAV_LINKS = [
  { label: 'About',      id: 'about' },
  { label: 'Terminal',   id: 'terminal' },
  { label: 'Journey',    id: 'journey' },
  { label: 'Projects',   id: 'projects' },
  { label: 'Skills',     id: 'skills' },
  { label: 'Experience', id: 'experience' },
  { label: 'Contact',    id: 'contact' },
];

const NAVBAR_H = 72;

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('');
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Track active section via IntersectionObserver
  useEffect(() => {
    const observers = NAV_LINKS.map(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id); },
        { threshold: 0.25, rootMargin: `-${NAVBAR_H}px 0px -55% 0px` }
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach(o => o?.disconnect());
  }, []);

  const scrollTo = useCallback((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - NAVBAR_H;
    window.scrollTo({ top, behavior: 'smooth' });
    setActive(id);
    setOpen(false);
  }, []);

  return (
    <>
      <motion.header
        className={`fixed top-0 inset-x-0 z-40 transition-all duration-500 ${
          scrolled ? 'py-3' : 'bg-transparent py-5'
        }`}
        style={scrolled ? {
          background: 'var(--nav-bg)',
          backdropFilter: 'blur(40px)',
          WebkitBackdropFilter: 'blur(40px)',
          borderBottom: '1px solid var(--nav-border)',
          boxShadow: isDark ? '0 4px 30px rgba(0,0,0,0.6)' : '0 4px 20px rgba(0,0,0,0.08)',
          transition: 'background 0.4s ease',
        } : {}}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2.5 group"
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm"
              style={{
                background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
                boxShadow: '0 0 20px rgba(99,102,241,0.5)',
                transition: 'box-shadow 0.3s',
              }}
            >
              AK
            </div>
            <span className="font-semibold text-white hidden sm:block tracking-tight">
              Akash<span className="text-indigo-400">.</span>dev
            </span>
          </button>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {NAV_LINKS.map(({ label, id }) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className="relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200"
                style={{
                  color: active === id ? '#fff' : '#64748b',
                  background: active === id ? 'rgba(99,102,241,0.1)' : 'transparent',
                }}
              >
                {active === id && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-lg"
                    style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.2)' }}
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                  />
                )}
                <span className="relative z-10 hover:text-slate-200 transition-colors">{label}</span>
              </button>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <ThemeToggle />
          </div>

          <div className="lg:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setOpen(!open)}
              className="p-2 rounded-lg hover:bg-white/5 transition-colors"
              style={{ color: 'var(--text-3)' }}
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-30 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-[#050816]/95 backdrop-blur-xl"
              onClick={() => setOpen(false)}
            />
            <motion.nav
              className="absolute top-20 left-4 right-4 rounded-2xl p-4"
              style={{
                background: 'var(--nav-bg)',
                backdropFilter: 'blur(40px)',
                border: '1px solid var(--nav-border)',
                boxShadow: isDark ? '0 0 60px rgba(124,58,237,0.12)' : '0 8px 40px rgba(0,0,0,0.1)',
              }}
              initial={{ y: -20, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -20, opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex flex-col gap-1">
                {NAV_LINKS.map(({ label, id }, i) => (
                  <motion.button
                    key={id}
                    onClick={() => scrollTo(id)}
                    className="px-4 py-3 text-left rounded-xl transition-colors font-medium"
                    style={{
                      color: active === id ? '#fff' : '#94a3b8',
                      background: active === id ? 'rgba(99,102,241,0.1)' : 'transparent',
                    }}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    {label}
                  </motion.button>
                ))}
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
