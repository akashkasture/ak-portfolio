import { Quote, Star } from 'lucide-react';
import { testimonials } from '../data/portfolio';
import SectionHeader from './SectionHeader';

function TestimonialCard({ t }) {
  return (
    <div
      className="flex-shrink-0 w-[300px] sm:w-[360px] md:w-[380px] rounded-2xl p-5 sm:p-7 relative overflow-hidden"
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--surface-border)',
        boxShadow: '0 4px 30px rgba(0,0,0,0.08)',
      }}
    >
      {/* Top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.5), transparent)' }} />

      {/* Quote mark */}
      <div className="absolute top-5 right-6 opacity-[0.07]">
        <Quote size={48} style={{ color: 'var(--text-1)' }} />
      </div>

      {/* Stars */}
      <div className="flex gap-0.5 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={13} className="text-amber-400 fill-amber-400" />
        ))}
      </div>

      {/* Text */}
      <p className="text-sm leading-relaxed mb-6 relative z-10" style={{ color: 'var(--text-2)' }}>
        "{t.text}"
      </p>

      {/* Author */}
      <div className="flex items-center gap-3">
        <img
          src={t.avatar}
          alt={t.name}
          className="w-10 h-10 rounded-full object-cover"
          style={{ border: '2px solid rgba(99,102,241,0.25)' }}
        />
        <div>
          <div className="text-sm font-semibold" style={{ color: 'var(--text-1)' }}>{t.name}</div>
          <div className="text-xs" style={{ color: 'var(--text-3)' }}>{t.role} · {t.company}</div>
        </div>
      </div>
    </div>
  );
}

export default function Testimonials() {
  // Triple the array for a seamless loop
  const track = [...testimonials, ...testimonials, ...testimonials];

  return (
    <section id="testimonials" className="section-padding overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          label="Testimonials"
          title="What Colleagues"
          highlight="Say"
          description="Feedback from engineers and managers I've had the privilege of working with."
        />
      </div>

      {/* Full-width scroll belt */}
      <div className="testimonials-wrapper relative mt-2">
        {/* Gradient fade masks */}
        <div className="absolute left-0 top-0 bottom-0 w-32 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to right, var(--bg) 20%, transparent 100%)' }} />
        <div className="absolute right-0 top-0 bottom-0 w-32 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to left, var(--bg) 20%, transparent 100%)' }} />

        <div className="testimonials-track flex gap-5 px-8">
          {track.map((t, i) => (
            <TestimonialCard key={i} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
}
