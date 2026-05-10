import { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import CareerJourney from './components/CareerJourney';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Experience from './components/Experience';
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
    const timer = setTimeout(() => setLoading(false), 2200);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <LoadingScreen />;

  return (
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
        <Skills />
        <Experience />
        <GitHubHeatmap />
        <Testimonials />
        <Blog />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppInner />
    </ThemeProvider>
  );
}
