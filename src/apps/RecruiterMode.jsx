import { motion } from 'framer-motion';
import { X, Sparkles, Mail, MapPin, CheckCircle2, FileText } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../components/SocialIcons';
import { personalInfo, experience, projects, techBadges } from '../data/portfolio';
import { useWindowManager } from '../context/WindowManagerContext';
import { trackEvent } from '../utils/analytics';

const WHY_HIRE_ME = [
  'Backend engineering — Java, Spring Boot, microservices in production',
  'Event-driven systems — Kafka pipelines at 15K+ msgs/day, 99.95% uptime',
  'Production fintech — automated $50M+/month transaction workflows, zero errors',
  'Database optimization — Oracle SQL query tuning, minutes to seconds',
  'Distributed systems — cache-aside, rate limiting, CQRS, event sourcing',
  'DevOps — Docker, Kubernetes, CI/CD pipelines',
];

const FEATURED_PROJECTS = projects.slice(0, 4);

export default function RecruiterMode() {
  const { toggleRecruiterMode } = useWindowManager();

  const close = () => {
    toggleRecruiterMode();
    trackEvent('recruiter_mode_toggle', { active: false });
  };

  return (
    <motion.div
      className="absolute inset-3 sm:inset-6 rounded-xl overflow-hidden flex flex-col glass-strong"
      style={{ boxShadow: '0 24px 70px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.06)' }}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.2 }}
    >
      <div
        className="flex items-center gap-2.5 px-4 py-3 flex-shrink-0"
        style={{ borderBottom: '1px solid var(--surface-border)' }}
      >
        <Sparkles size={15} className="text-indigo-400" />
        <span className="text-sm font-semibold font-mono" style={{ color: 'var(--text-1)' }}>Recruiter Mode</span>
        <button
          onClick={close}
          aria-label="Exit Recruiter Mode"
          className="ml-auto p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto @container">
        <div className="max-w-3xl mx-auto p-6 sm:p-8">
          {/* Identity */}
          <div className="flex items-start justify-between flex-wrap gap-3 mb-8">
            <div>
              <h1 className="text-2xl font-bold" style={{ color: 'var(--text-1)' }}>{personalInfo.name}</h1>
              <p className="text-indigo-400 font-medium mt-1">{personalInfo.title}</p>
              <div className="flex items-center gap-1.5 mt-2 text-sm" style={{ color: 'var(--text-3)' }}>
                <MapPin size={13} />
                {personalInfo.location}
              </div>
            </div>
            {personalInfo.available && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/25 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Open to Opportunities
              </span>
            )}
          </div>

          <p className="text-sm leading-relaxed mb-8" style={{ color: 'var(--text-2)' }}>{personalInfo.description}</p>

          {/* Why hire me */}
          <section className="mb-8">
            <h2 className="text-xs font-mono uppercase tracking-widest mb-3" style={{ color: 'var(--text-4)' }}>Why Hire Me</h2>
            <div className="grid @sm:grid-cols-2 gap-2">
              {WHY_HIRE_ME.map((point) => (
                <div key={point} className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-2)' }}>
                  <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                  {point}
                </div>
              ))}
            </div>
          </section>

          {/* Core stack */}
          <section className="mb-8">
            <h2 className="text-xs font-mono uppercase tracking-widest mb-3" style={{ color: 'var(--text-4)' }}>Core Stack</h2>
            <div className="flex flex-wrap gap-1.5">
              {techBadges.slice(0, 14).map((t) => (
                <span key={t} className="px-2.5 py-1 rounded-lg text-xs font-mono" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--surface-border)', color: 'var(--text-2)' }}>
                  {t}
                </span>
              ))}
            </div>
          </section>

          {/* Experience */}
          <section className="mb-8">
            <h2 className="text-xs font-mono uppercase tracking-widest mb-3" style={{ color: 'var(--text-4)' }}>Experience</h2>
            <div className="space-y-3">
              {experience.map((exp) => (
                <div key={exp.id} className="p-3.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--surface-border)' }}>
                  <div className="flex items-baseline justify-between flex-wrap gap-x-3">
                    <span className="text-sm font-semibold" style={{ color: 'var(--text-1)' }}>{exp.role}</span>
                    <span className="text-xs font-mono" style={{ color: 'var(--text-4)' }}>{exp.period}</span>
                  </div>
                  <div className="text-xs text-indigo-400 mb-1.5">{exp.company}</div>
                  <div className="text-xs leading-relaxed" style={{ color: 'var(--text-3)' }}>{exp.achievements[0]}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Projects */}
          <section className="mb-8">
            <h2 className="text-xs font-mono uppercase tracking-widest mb-3" style={{ color: 'var(--text-4)' }}>Project Impact</h2>
            <div className="grid @sm:grid-cols-2 gap-2">
              {FEATURED_PROJECTS.map((p) => (
                <div key={p.id} className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--surface-border)' }}>
                  <div className="text-sm font-semibold mb-0.5" style={{ color: 'var(--text-1)' }}>{p.title}</div>
                  <div className="text-xs" style={{ color: 'var(--text-3)' }}>{p.category}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Resume + Contact */}
          <section>
            <h2 className="text-xs font-mono uppercase tracking-widest mb-3" style={{ color: 'var(--text-4)' }}>Contact</h2>
            <div className="flex flex-wrap gap-2">
              <a
                href={`mailto:${personalInfo.email}?subject=Resume%20Request`}
                onClick={() => trackEvent('recruiter_resume_request')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
                style={{ background: 'linear-gradient(135deg, #6366f1, #06b6d4)' }}
              >
                <FileText size={14} /> Request Resume
              </a>
              <a
                href={`mailto:${personalInfo.email}`}
                onClick={() => trackEvent('recruiter_contact_click', { type: 'email' })}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
                style={{ border: '1px solid var(--surface-border)', color: 'var(--text-2)' }}
              >
                <Mail size={14} /> {personalInfo.email}
              </a>
              <a
                href={personalInfo.github} target="_blank" rel="noopener noreferrer"
                onClick={() => trackEvent('recruiter_contact_click', { type: 'github' })}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
                style={{ border: '1px solid var(--surface-border)', color: 'var(--text-2)' }}
              >
                <GithubIcon size={14} /> GitHub
              </a>
              <a
                href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer"
                onClick={() => trackEvent('recruiter_contact_click', { type: 'linkedin' })}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
                style={{ border: '1px solid var(--surface-border)', color: 'var(--text-2)' }}
              >
                <LinkedinIcon size={14} /> LinkedIn
              </a>
            </div>
          </section>
        </div>
      </div>
    </motion.div>
  );
}
