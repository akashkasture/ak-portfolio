import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowUpRight, ExternalLink } from 'lucide-react';
import { GithubIcon } from './SocialIcons';
import { projects, personalInfo } from '../data/portfolio';
import SectionHeader from './SectionHeader';
import { useTheme } from '../context/ThemeContext';
import { trackEvent } from '../utils/analytics';
import { T } from '../os/motion';

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

function ProjectDetail({ project, color, onBack }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 24 }}
      transition={T.base}
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

      {/* These were headed "Impact" and set as big coloured figures, which
          read as measured outcomes. Most of them are design facts — the
          algorithm chosen, the store used, the tracing tool — so they're
          labelled and set as what they are. */}
      <section className="mb-6">
        <h3 className="text-xs font-mono uppercase tracking-widest mb-3" style={{ color: 'var(--text-4)' }}>At a glance</h3>
        <dl className="space-y-1.5">
          {Object.entries(project.metrics).map(([key, val]) => (
            <div key={key} className="flex items-baseline gap-3 text-[13.5px]">
              <dt className="capitalize w-28 flex-shrink-0" style={{ color: 'var(--text-4)' }}>{key}</dt>
              <dd className="font-mono" style={{ color: 'var(--text-2)' }}>{val}</dd>
            </div>
          ))}
        </dl>
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

function ProjectCard({ project, onOpen }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const color = CATEGORY_COLORS[project.category] || '#6366f1';

  return (
    <motion.div
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

          {/* No cover images. These were Unsplash stock — a glowing circuit
              brain and a robot sitting at a laptop — which is exactly the
              visual shorthand that makes a portfolio look generated rather
              than built. The card leads with the work instead. */}
          <div className="px-5 pt-5 flex items-center justify-between gap-3">
            <span
              className="px-2.5 py-1 rounded-lg text-[10px] font-semibold border"
              style={{ background: `${color}18`, borderColor: `${color}35`, color }}
            >
              {project.category}
            </span>
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <a
                href={walkthroughMailto(project)}
                onClick={(e) => { e.stopPropagation(); trackEvent('project_demo_click', { project: project.title }); }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-colors"
                style={{ border: '1px solid var(--surface-border)', color: 'var(--text-2)' }}
              >
                <ExternalLink size={11} /> Walkthrough
              </a>
              <a
                href={personalInfo.github}
                target="_blank" rel="noopener noreferrer"
                onClick={(e) => { e.stopPropagation(); trackEvent('project_code_click', { project: project.title }); }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-colors"
                style={{ border: '1px solid var(--surface-border)', color: 'var(--text-2)' }}
              >
                <GithubIcon size={11} /> GitHub
              </a>
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

            {/* The metric row that sat here repeated the detail view's
                "at a glance" list, in the same big-coloured-figure styling
                that made design facts read as measured results. */}
          </div>
        </div>
      </TiltCard>
    </motion.div>
  );
}

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedId, setSelectedId] = useState(null);

  // The command palette can search by tech and land straight on a project,
  // so it needs a way to say which one after this window has mounted.
  useEffect(() => {
    const onOpenProject = (e) => {
      const id = e.detail?.id;
      if (projects.some((p) => p.id === id)) setSelectedId(id);
    };
    window.addEventListener('ak-os:open-project', onOpenProject);
    return () => window.removeEventListener('ak-os:open-project', onOpenProject);
  }, []);

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
            transition={T.base}
          >
            {filtered.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onOpen={() => { setSelectedId(project.id); trackEvent('project_detail_open', { project: project.title }); }}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
