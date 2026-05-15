import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { GithubIcon } from './SocialIcons';
import { projects } from '../data/portfolio';
import SectionHeader from './SectionHeader';
import { useTheme } from '../context/ThemeContext';

const FEATURED = projects.slice(0, 4);
const CATEGORIES = ['All', ...new Set(FEATURED.map((p) => p.category))];

const CATEGORY_COLORS = {
  'AI / Backend': '#6366f1',
  'FinTech': '#10b981',
  'Backend': '#06b6d4',
  'Architecture': '#8b5cf6',
  'DevOps': '#f59e0b',
};

function TiltCard({ children, color }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setTilt({
      x: ((y - rect.height / 2) / rect.height) * -10,
      y: ((x - rect.width / 2) / rect.width) * 10,
    });
  };

  return (
    <motion.div
      style={{
        rotateX: hovered ? tilt.x : 0,
        rotateY: hovered ? tilt.y : 0,
        transformStyle: 'preserve-3d',
        transformPerspective: 900,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setTilt({ x: 0, y: 0 }); }}
      transition={{ type: 'spring', stiffness: 280, damping: 30 }}
      className="h-full"
    >
      {children}
    </motion.div>
  );
}

function ProjectCard({ project, index }) {
  const [imgHovered, setImgHovered] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const color = CATEGORY_COLORS[project.category] || '#6366f1';

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
    >
      <TiltCard color={color}>
        <div
          className="group relative rounded-2xl overflow-hidden h-full flex flex-col"
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--surface-border)',
            transition: 'border-color 0.3s, box-shadow 0.3s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = `${color}40`;
            e.currentTarget.style.boxShadow = `0 20px 60px ${isDark ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.1)'}, 0 0 50px ${color}22, inset 0 0 0 1px ${color}14`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--surface-border)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          {/* Animated top border on hover */}
          <div
            className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-400 z-10"
            style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
          />
          {/* Corner glow on hover */}
          <div
            className="absolute top-0 right-0 w-40 h-40 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"
            style={{ background: `radial-gradient(circle at 100% 0%, ${color}20 0%, transparent 65%)` }}
          />

          {/* Image */}
          <div
            className="relative overflow-hidden"
            style={{ aspectRatio: '16/9' }}
            onMouseEnter={() => setImgHovered(true)}
            onMouseLeave={() => setImgHovered(false)}
          >
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-700"
              style={{ transform: imgHovered ? 'scale(1.08)' : 'scale(1)' }}
              loading="lazy"
            />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, var(--surface) 0%, transparent 60%)' }} />

            {/* Hover overlay — category badge only, no misleading external links */}

            {/* Category badge */}
            <div className="absolute top-3 left-3">
              <span
                className="px-2.5 py-1 rounded-lg text-[10px] font-semibold border backdrop-blur-sm"
                style={{
                  background: `${color}20`,
                  borderColor: `${color}35`,
                  color,
                }}
              >
                {project.category}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-5 flex flex-col flex-1">
            <div className="flex items-start justify-between mb-2">
              <h3
                className="font-bold text-base leading-snug"
                style={{ color: 'var(--text-1)' }}
              >
                {project.title}
              </h3>
            </div>

            <p className="text-sm leading-relaxed mb-4 flex-1 line-clamp-3" style={{ color: 'var(--text-3)' }}>
              {project.description}
            </p>

            {/* Tech badges */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {project.tech.slice(0, 5).map((t) => (
                <span
                  key={t}
                  className="px-2 py-0.5 rounded-md text-[10px] font-mono"
                  style={{ border: '1px solid var(--surface-border)', background: 'var(--surface)', color: 'var(--text-3)' }}
                >
                  {t}
                </span>
              ))}
              {project.tech.length > 5 && (
                <span className="px-2 py-0.5 rounded-md text-[10px] font-mono" style={{ color: 'var(--text-3)' }}>
                  +{project.tech.length - 5}
                </span>
              )}
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-2 pt-4" style={{ borderTop: '1px solid var(--surface-border)' }}>
              {Object.entries(project.metrics).map(([key, val]) => (
                <div key={key} className="text-center">
                  <div className="text-xs font-bold" style={{ color }}>
                    {val}
                  </div>
                  <div className="text-[9px] capitalize mt-0.5" style={{ color: 'var(--text-4)' }}>{key}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </TiltCard>
    </motion.div>
  );
}

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered =
    activeCategory === 'All'
      ? FEATURED
      : FEATURED.filter((p) => p.category === activeCategory);

  return (
    <section id="projects" className="section-padding" style={{ overflowX: 'clip' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          label="Featured Projects"
          title="Production-Grade"
          highlight="Systems"
          description="10+ real-world projects built to handle scale, reliability, and performance demands."
        />

        {/* Category filter */}
        <motion.div
          className="flex flex-wrap justify-center gap-2 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {CATEGORIES.map((cat) => {
            const catColor = CATEGORY_COLORS[cat] || '#6366f1';
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200"
                style={{
                  background: isActive ? catColor : 'var(--surface)',
                  border: `1px solid ${isActive ? catColor : 'var(--surface-border)'}`,
                  color: isActive ? '#fff' : 'var(--text-3)',
                  boxShadow: isActive ? `0 0 20px ${catColor}40, 0 4px 16px ${catColor}20` : 'none',
                }}
              >
                {cat}
              </button>
            );
          })}
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            className="grid md:grid-cols-2 xl:grid-cols-2 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {filtered.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </motion.div>
        </AnimatePresence>

        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <a
            href="https://github.com/akashkasture"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-200 text-sm"
            style={{ border: '1px solid var(--surface-border)', color: 'var(--text-3)', background: 'var(--surface)' }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)'; e.currentTarget.style.color = 'var(--text-1)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--surface-border)'; e.currentTarget.style.color = 'var(--text-3)'; }}
          >
            <GithubIcon size={15} />
            View All 10+ Projects on GitHub
            <ChevronRight size={13} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
