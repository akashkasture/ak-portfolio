import { useState, useEffect, lazy, Suspense } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import CareerJourney from './components/CareerJourney';
import Projects from './components/Projects';
import SkillsConstellation from './components/SkillsConstellation';
import Experience from './components/Experience';
const Trading = lazy(() => import('./components/Trading'));
import Terminal from './components/Terminal';
import GitHubHeatmap from './components/GitHubHeatmap';
import Testimonials from './components/Testimonials';
import Blog from './components/Blog';
import Contact from './components/Contact';
import Footer from './components/Footer';
import CursorGlow from './components/CursorGlow';
import LoadingScreen from './components/LoadingScreen';
import GridBackground from './components/GridBackground';

function AppInner() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Give enough time for all boot lines to appear + brief pause
    const timer = setTimeout(() => setLoading(false), 3200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence>
        {loading && <LoadingScreen key="loading" />}
      </AnimatePresence>

      {!loading && (
        <div className="relative min-h-screen overflow-x-hidden" style={{ color: 'var(--text-1)' }}>
          <CursorGlow />
          <GridBackground />
          <Navbar />
          <main className="relative z-10">
            <Hero />
            <About />
            <Terminal />
            <CareerJourney />
            <Projects />
            <SkillsConstellation />
            <Experience />
            <Suspense fallback={null}><Trading /></Suspense>
            <GitHubHeatmap />
            <Testimonials />
            <Blog />
            <Contact />
          </main>
          <Footer />
        </div>
      )}
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppInner />
    </ThemeProvider>
  );
}
