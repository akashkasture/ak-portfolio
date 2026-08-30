import { MapPin, ArrowUpRight } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../components/SocialIcons';
import { personalInfo, experience, projects, techBadges } from '../data/portfolio';
import { trackEvent } from '../utils/analytics';
import Figures from '../components/Figures';

/* The thirty-second answer. Everything on this screen is something a
   recruiter needs before they decide whether to keep reading — no
   decoration, no scroll-triggered reveals, nothing that has to finish
   animating before it can be read. Every number here comes straight
   from the experience data; nothing is invented for effect. */

const current = experience[0];

// The three achievements worth leading with, in the order someone
// skimming would want them: scale, money, then the systems work.
const PROOF = [
  current.achievements[0],
  current.achievements[1],
  current.achievements[3],
];

const FEATURED = projects.slice(0, 3);

function Section({ label, children }) {
  return (
    <section className="mb-8">
      <h2
        className="text-[11px] font-mono uppercase tracking-[0.14em] mb-3"
        style={{ color: 'var(--text-4)' }}
      >
        {label}
      </h2>
      {children}
    </section>
  );
}

/* `flow` is a slot rather than an import so the phone can put its
   architecture map here — high on the page, where it does the most work —
   without the desktop Briefing window paying for a diagram it already has
   a whole 3D mode for. */
export default function Briefing({ flow = null }) {
  return (
    <div className="@container">
      <div className="max-w-2xl mx-auto px-5 py-7 sm:px-8 sm:py-9">
        {/* Identity */}
        <header className="mb-8">
          <h1
            className="font-display text-[28px] @sm:text-[34px] leading-[1.1]"
            style={{ color: 'var(--text-1)' }}
          >
            {personalInfo.name}
          </h1>
          <p className="mt-1.5 text-[15px]" style={{ color: 'var(--text-2)' }}>
            {current.role} at {current.company}
          </p>
          <div
            className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px]"
            style={{ color: 'var(--text-3)' }}
          >
            <span className="flex items-center gap-1.5">
              <MapPin size={13} />
              {personalInfo.location}
            </span>
            <span className="font-mono">{current.period}</span>
            {personalInfo.available && (
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Open to opportunities
              </span>
            )}
          </div>
        </header>

        <p
          className="text-[15px] leading-relaxed mb-8"
          style={{ color: 'var(--text-2)' }}
        >
          {personalInfo.description}
        </p>

        {flow && <Section label="The system I work on">{flow}</Section>}

        <Section label="What I've shipped">
          <ul className="space-y-3">
            {PROOF.map((point) => (
              <li
                key={point}
                className="text-[14px] leading-relaxed pl-4 relative"
                style={{ color: 'var(--text-2)' }}
              >
                <span
                  className="absolute left-0 top-[0.6em] w-1.5 h-px"
                  style={{ background: 'var(--text-4)' }}
                />
                <Figures text={point} />
              </li>
            ))}
          </ul>
        </Section>

        <Section label="Built">
          <div className="space-y-3">
            {FEATURED.map((p) => (
              <div key={p.id}>
                <div className="text-[14px] font-medium" style={{ color: 'var(--text-1)' }}>
                  {p.title}
                </div>
                <div
                  className="text-[13px] leading-relaxed mt-0.5"
                  style={{ color: 'var(--text-3)' }}
                >
                  {p.tech.slice(0, 5).join(' · ')}
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section label="Stack">
          <div className="flex flex-wrap gap-x-3 gap-y-1.5">
            {techBadges.slice(0, 16).map((t) => (
              <span key={t} className="text-[13px] font-mono" style={{ color: 'var(--text-3)' }}>
                {t}
              </span>
            ))}
          </div>
        </Section>

        <Section label="Start here">
          <div className="flex flex-col gap-px">
            <a
              href={personalInfo.resumeUrl}
              onClick={() => trackEvent('briefing_link', { target: 'resume' })}
              className="flex items-center justify-between py-3 text-[14px] transition-colors"
              style={{ color: 'var(--text-1)', borderBottom: '1px solid var(--surface-border)' }}
            >
              Request résumé
              <ArrowUpRight size={15} style={{ color: 'var(--text-4)' }} />
            </a>
            <a
              href={`mailto:${personalInfo.email}`}
              onClick={() => trackEvent('briefing_link', { target: 'email' })}
              className="flex items-center justify-between py-3 text-[14px] transition-colors"
              style={{ color: 'var(--text-1)', borderBottom: '1px solid var(--surface-border)' }}
            >
              <span className="font-mono text-[13px]">{personalInfo.email}</span>
              <ArrowUpRight size={15} style={{ color: 'var(--text-4)' }} />
            </a>
            <a
              href={personalInfo.github}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent('briefing_link', { target: 'github' })}
              className="flex items-center justify-between py-3 text-[14px] transition-colors"
              style={{ color: 'var(--text-1)', borderBottom: '1px solid var(--surface-border)' }}
            >
              <span className="flex items-center gap-2">
                <GithubIcon size={14} /> GitHub
              </span>
              <ArrowUpRight size={15} style={{ color: 'var(--text-4)' }} />
            </a>
            <a
              href={personalInfo.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent('briefing_link', { target: 'linkedin' })}
              className="flex items-center justify-between py-3 text-[14px] transition-colors"
              style={{ color: 'var(--text-1)' }}
            >
              <span className="flex items-center gap-2">
                <LinkedinIcon size={14} /> LinkedIn
              </span>
              <ArrowUpRight size={15} style={{ color: 'var(--text-4)' }} />
            </a>
          </div>
        </Section>
      </div>
    </div>
  );
}
