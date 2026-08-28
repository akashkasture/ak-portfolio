import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowUpRight, ExternalLink, FileText } from 'lucide-react';
import { GithubIcon } from './SocialIcons';
import { projects, blogPosts, personalInfo } from '../data/portfolio';
import SectionHeader from './SectionHeader';
import { useTheme } from '../context/ThemeContext';
import { trackEvent } from '../utils/analytics';

const CATEGORIES = ['All', ...new Set(projects.map((p) => p.category))];

const CATEGORY_COLORS = {
  'AI / Backend': '#6366f1',
  'FinTech': '#10b981',
  'Backend': '#06b6d4',
  'Architecture': '#8b5cf6',
  'DevOps': '#f59e0b',
};

// None of these projects have a public live deploy or a dedicated public repo —
// so "Live Demo" asks for a real walkthrough instead of faking a link, and
// "Code" points at the actual GitHub profile rather than implying a repo that
// doesn't exist.
function walkthroughMailto(project) {
  const subject = encodeURIComponent(`Walkthrough request — ${project.title}`);
  const body = encodeURIComponent(`Hi Akash,\n\nI'd like to see a walkthrough of ${project.title}.\n\n`);
  return `mailto:${personalInfo.email}?subject=${subject}&body=${body}`;
}

// Surfaces a real engineering note when its tags genuinely overlap the project's
// tech stack or title — never invented, just cross-linking existing content.
function relatedNote(project) {
  return blogPosts.find((post) =>
    post.tags.some(
      (tag) =>
        project.tech.some((t) => t.toLowerCase().includes(tag.toLowerCase()) || tag.toLowerCase().includes(t.toLowerCase())) ||
        project.title.toLowerCase().includes(tag.toLowerCase())
    )
  );
}

function ProjectDetail({ project, color, onBack }) {
  const note = relatedNote(project);
  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 24 }}
      transition={{ duration: 0.2 }}
    >
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm mb-5 transition-colors hover:text-white"
        style={{ color: 'var(--text-3)' }}
      >
        <ArrowLeft size={14} /> All Projects
      </button>

      <div className="flex items-start justify-between flex-wrap gap-3 mb-4">
        <div>
          <span
            className="inline-block px-2.5 py-1 rounded-lg text-[10px] font-semibold mb-2"
            style={{ background: `${color}20`, color, border: `1px solid ${color}35` }}
          >
            {project.category}
          </span>
          <h2 className="text-2xl font-bold" style={{ color: 'var(--text-1)' }}>{project.title}</h2>
        </div>
        <div className="flex gap-2">
          <a
            href={walkthroughMailto(project)}
            onClick={() => trackEvent('project_demo_click', { project: project.title })}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-white text-xs font-semibold transition-opacity hover:opacity-90"
            style={{ background: color }}
          >
            <ExternalLink size={12} /> Request Walkthrough
          </a>
          <a
            href={personalInfo.github}
            target="_blank" rel="noopener noreferrer"
            onClick={() => trackEvent('project_code_click', { project: project.title })}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-opacity hover:opacity-90"
            style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text-2)' }}
          >
            <GithubIcon size={12} /> GitHub Profile
          </a>
        </div>
      </div>

      {/* Overview — the real project description, which already reads architecture-first */}
      <section className="mb-6">
        <h3 className="text-xs font-mono uppercase tracking-widest mb-2" style={{ color: 'var(--text-4)' }}>Overview</h3>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-2)' }}>{project.description}</p>
      </section>

      {/* Impact / metrics */}
      <section className="mb-6">
        <h3 className="text-xs font-mono uppercase tracking-widest mb-3" style={{ color: 'var(--text-4)' }}>Impact</h3>
        <div className="grid grid-cols-3 gap-3">
          {Object.entries(project.metrics).map(([key, val]) => (
            <div key={key} className="rounded-xl p-3 text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--surface-border)' }}>
              <div className="text-base font-bold" style={{ color }}>{val}</div>
              <div className="text-[10px] capitalize mt-0.5" style={{ color: 'var(--text-4)' }}>{key}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Tech stack */}
      <section className="mb-6">
        <h3 className="text-xs font-mono uppercase tracking-widest mb-3" style={{ color: 'var(--text-4)' }}>Tech Stack</h3>
        <div className="flex flex-wrap gap-1.5">
          {project.tech.map((t) => (
            <span key={t} className="px-2.5 py-1 rounded-lg text-xs font-mono" style={{ border: '1px solid var(--surface-border)', background: 'var(--surface)', color: 'var(--text-2)' }}>
              {t}
            </span>
          ))}
        </div>
      </section>

      {/* Related engineering note — only when tags genuinely overlap */}
      {note && (
        <section>
          <h3 className="text-xs font-mono uppercase tracking-widest mb-3" style={{ color: 'var(--text-4)' }}>Related Engineering Note</h3>
          <div className="rounded-xl p-4 flex items-start gap-3" style={{ background: `${note.color}0a`, border: `1px solid ${note.color}30` }}>
            <FileText size={16} className="flex-shrink-0 mt-0.5" style={{ color: note.color }} />
            <div className="min-w-0">
              <div className="text-sm font-semibold flex items-center gap-1.5" style={{ color: 'var(--text-1)' }}>
                {note.title} <ArrowUpRight size={12} style={{ color: note.color }} />
              </div>
              <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-3)' }}>{note.excerpt}</p>
              <div className="text-[10px] mt-1.5 font-mono" style={{ color: 'var(--text-4)' }}>{note.date} · {note.readTime}</div>
            </div>
          </div>
        </section>
      )}
    </motion.div>
  );
}

function TiltCard({ children }) {
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

function ProjectCard({ project, index, onOpen }) {
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
      onClick={onOpen}
      className="cursor-pointer"
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

            {/* Hover overlay buttons */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center gap-3"
              animate={{ opacity: imgHovered ? 1 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <a
                href={walkthroughMailto(project)}
                onClick={(e) => { e.stopPropagation(); trackEvent('project_demo_click', { project: project.title }); }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-xs font-semibold backdrop-blur-sm transition-opacity hover:opacity-90"
                style={{ background: color, boxShadow: `0 0 20px ${color}60` }}
              >
                <ExternalLink size={12} />
                Request Walkthrough
              </a>
              <a
                href={personalInfo.github}
                target="_blank" rel="noopener noreferrer"
                onClick={(e) => { e.stopPropagation(); trackEvent('project_code_click', { project: project.title }); }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 text-white text-xs font-semibold backdrop-blur-sm transition-opacity hover:opacity-90"
              >
                <GithubIcon size={12} />
                GitHub
              </a>
            </motion.div>

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

            <p className="text-sm leading-relaxed mb-3 flex-1 line-clamp-3" style={{ color: 'var(--text-3)' }}>
              {project.description}
            </p>

            <span className="text-xs font-semibold mb-3 flex items-center gap-1" style={{ color }}>
              View Details <ArrowUpRight size={12} />
            </span>

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
  const [selectedId, setSelectedId] = useState(null);

  const filtered =
    activeCategory === 'All'
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  const selected = selectedId ? projects.find((p) => p.id === selectedId) : null;

  if (selected) {
    return (
      <div className="@container p-6 sm:p-8">
        <AnimatePresence mode="wait">
          <ProjectDetail
            key={selected.id}
            project={selected}
            color={CATEGORY_COLORS[selected.category] || '#6366f1'}
            onBack={() => setSelectedId(null)}
          />
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="@container p-6 sm:p-8">
      <div>
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
                onClick={() => {
                  setActiveCategory(cat);
                  trackEvent('project_filter_click', { category: cat });
                }}
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
            className="grid @md:grid-cols-2 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {filtered.map((project, i) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={i}
                onOpen={() => { setSelectedId(project.id); trackEvent('project_detail_open', { project: project.title }); }}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
