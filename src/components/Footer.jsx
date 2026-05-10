import { motion } from 'framer-motion';
import { Mail, ArrowUp } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './SocialIcons';
import { personalInfo } from '../data/portfolio';

export default function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="relative border-t border-white/5 py-12 px-4">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(99,102,241,0.12) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          opacity: 0.3,
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-8">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm"
              style={{
                background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
                boxShadow: '0 0 20px rgba(99,102,241,0.4)',
              }}
            >
              AK
            </div>
            <div>
              <div className="text-white font-semibold">{personalInfo.name}</div>
              <div className="text-slate-600 text-xs">{personalInfo.title}</div>
            </div>
          </div>

          <nav className="flex flex-wrap items-center gap-6 text-sm">
            {['About', 'Projects', 'Skills', 'Experience', 'Contact'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-slate-500 hover:text-white transition-colors"
              >
                {item}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {[
              { icon: GithubIcon, href: personalInfo.github, label: 'GitHub' },
              { icon: LinkedinIcon, href: personalInfo.linkedin, label: 'LinkedIn' },
              { icon: Mail, href: `mailto:${personalInfo.email}`, label: 'Email' },
            ].map(({ icon: Icon, href, label }) => (
              <motion.a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="p-2.5 rounded-xl border border-white/8 text-slate-500 hover:text-white hover:border-indigo-500/30 hover:bg-indigo-500/8 transition-all duration-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon size={16} />
              </motion.a>
            ))}
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6 border-t border-white/5">
          <p className="text-slate-600 text-xs font-mono">
            © 2026 Akash Kasture. Software Engineer | Trader | FinTech Enthusiast.
          </p>

          <p className="text-slate-700 text-xs font-mono">
            Pune, India · Open to opportunities
          </p>

          <motion.button
            onClick={scrollToTop}
            className="p-2.5 rounded-xl border border-white/8 text-slate-500 hover:text-white hover:border-indigo-500/30 transition-all duration-200"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Back to top"
          >
            <ArrowUp size={16} />
          </motion.button>
        </div>
      </div>
    </footer>
  );
}
