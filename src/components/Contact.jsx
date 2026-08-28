import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Send, CheckCircle, MapPin, Clock, Copy, Check } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './SocialIcons';
import { personalInfo } from '../data/portfolio';
import SectionHeader from './SectionHeader';
import { trackEvent } from '../utils/analytics';

function CopyEmailButton() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(personalInfo.email);
      setCopied(true);
      trackEvent('contact_email_copy');
      setTimeout(() => setCopied(false), 1400);
    } catch {
      /* clipboard unavailable — the mailto link right next to this still works */
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex items-center gap-1.5 text-xs font-medium transition-colors"
      style={{ color: copied ? '#34d399' : 'var(--text-3)' }}
    >
      {copied ? <Check size={12} /> : <Copy size={12} />}
      {copied ? 'Copied' : 'Copy email'}
    </button>
  );
}

// Field MUST be outside Contact — defining it inside causes React to remount
// the input on every keystroke (new component type = new DOM node = lost focus)
function Field({ label, type, as, placeholder, value, error, onChange }) {
  const Tag = as || 'input';
  return (
    <div>
      <label className="block text-xs font-mono uppercase tracking-widest mb-2" style={{ color: 'var(--text-3)' }}>
        {label}
      </label>
      <Tag
        type={type || 'text'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={Tag === 'textarea' ? 5 : undefined}
        className="w-full px-4 py-3 rounded-xl border transition-all duration-200 outline-none resize-none font-sans text-sm leading-relaxed"
        style={{
          background: 'var(--surface)',
          color: 'var(--text-1)',
          borderColor: error ? 'rgba(239,68,68,0.5)' : 'var(--surface-border)',
        }}
        onFocus={(e) => {
          e.target.style.borderColor = error ? 'rgba(239,68,68,0.8)' : 'rgba(99,102,241,0.6)';
          e.target.style.boxShadow = error
            ? '0 0 0 2px rgba(239,68,68,0.15)'
            : '0 0 0 2px rgba(99,102,241,0.15), 0 0 20px rgba(99,102,241,0.08)';
        }}
        onBlur={(e) => {
          e.target.style.borderColor = error ? 'rgba(239,68,68,0.5)' : 'var(--surface-border)';
          e.target.style.boxShadow = 'none';
        }}
      />
      {error && <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">{error}</p>}
    </div>
  );
}

const contactLinks = [
  {
    icon: Mail,
    label: 'Email',
    value: 'akashkasture4884@gmail.com',
    href: 'mailto:akashkasture4884@gmail.com',
    color: '#6366f1',
  },
  {
    icon: GithubIcon,
    label: 'GitHub',
    value: 'github.com/akashkasture',
    href: 'https://github.com/akashkasture',
    color: '#e2e8f0',
  },
  {
    icon: LinkedinIcon,
    label: 'LinkedIn',
    value: 'linkedin.com/in/akashkasture',
    href: 'https://linkedin.com/in/akashkasture',
    color: '#0ea5e9',
  },
  {
    icon: MapPin,
    label: 'Location',
    value: 'Pune, India',
    href: null,
    color: '#10b981',
  },
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Valid email required';
    if (!form.subject.trim()) e.subject = 'Subject is required';
    if (form.message.length < 20) e.message = 'Message must be at least 20 characters';
    return e;
  };

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  // There's no backend here — submitting opens the visitor's own email client
  // with the message pre-filled, rather than faking a "sent" state with
  // nowhere for the message to actually go.
  const buildMailto = () => {
    const subject = encodeURIComponent(form.subject.trim());
    const body = encodeURIComponent(`${form.message.trim()}\n\n— ${form.name.trim()} (${form.email.trim()})`);
    return `mailto:${personalInfo.email}?subject=${subject}&body=${body}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    trackEvent('contact_form_submit');
    window.location.href = buildMailto();
    setStatus('opened');
  };

  return (
    <div className="@container relative p-6 sm:p-8 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px]"
          style={{ background: 'radial-gradient(ellipse, rgba(99,102,241,0.07) 0%, transparent 65%)' }}
        />
      </div>

      <div className="relative z-10">
        <SectionHeader
          label="Get In Touch"
          title="Let's Build"
          highlight="Together"
          description="Open to exciting opportunities, collaborations, and interesting conversations."
        />

        <div className="grid @lg:grid-cols-5 gap-8">
          {/* Left panel */}
          <div className="@lg:col-span-2 space-y-5">
            <motion.div
              className="rounded-2xl p-6 relative overflow-hidden"
              style={{
                background: 'var(--surface)',
                backdropFilter: 'blur(20px)',
                border: '1px solid var(--surface-border)',
                boxShadow: '0 8px 40px rgba(99,102,241,0.06)',
              }}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              whileHover={{ boxShadow: '0 8px 50px rgba(99,102,241,0.14), 0 0 0 1px rgba(99,102,241,0.15)' }}
            >
              <div
                className="absolute top-0 right-0 w-32 h-32 pointer-events-none"
                style={{ background: 'radial-gradient(circle at 100% 0%, rgba(99,102,241,0.1) 0%, transparent 60%)' }}
              />
              <div className="absolute top-0 left-0 right-0 h-px"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.4), transparent)' }} />
              <h3 className="font-bold text-base mb-5" style={{ color: 'var(--text-1)' }}>Contact Details</h3>
              <div className="space-y-4">
                {contactLinks.map(({ icon: Icon, label, value, href, color }) => (
                  <div key={label} className="flex items-start gap-3 group">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200 group-hover:scale-105"
                      style={{ background: `${color}15`, border: `1px solid ${color}30` }}
                    >
                      <Icon size={14} style={{ color }} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10px] font-mono text-slate-600 uppercase tracking-widest mb-0.5">{label}</div>
                      {href ? (
                        <a
                          href={href}
                          target={href.startsWith('http') ? '_blank' : undefined}
                          rel="noopener noreferrer"
                          onClick={() => trackEvent('contact_link_click', { type: label })}
                          className="text-slate-300 text-sm hover:text-white transition-colors break-all"
                          style={{ '--hover-color': color }}
                        >
                          {value}
                        </a>
                      ) : (
                        <span className="text-slate-300 text-sm">{value}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="rounded-2xl p-5 relative overflow-hidden"
              style={{
                background: 'rgba(16,185,129,0.06)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(16,185,129,0.18)',
                boxShadow: '0 4px 24px rgba(16,185,129,0.06)',
              }}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              whileHover={{ boxShadow: '0 4px 30px rgba(16,185,129,0.15), 0 0 0 1px rgba(16,185,129,0.2)' }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Clock size={14} className="text-emerald-400" />
                <h3 className="font-bold text-sm" style={{ color: 'var(--text-1)' }}>Availability</h3>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
                <span className="text-emerald-400 text-sm font-medium">Open to opportunities</span>
              </div>
              <p className="text-slate-500 text-xs leading-relaxed">
                Typically responds within 24 hours. Available for full-time roles, freelance, and open source.
              </p>
            </motion.div>
          </div>

          {/* Form panel */}
          <motion.div
            className="@lg:col-span-3"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div
              className="rounded-2xl p-8 relative overflow-hidden"
              style={{
                background: 'var(--surface)',
                backdropFilter: 'blur(20px)',
                border: '1px solid var(--surface-border)',
                boxShadow: '0 8px 40px rgba(99,102,241,0.06)',
              }}
            >
              <div
                className="absolute top-0 left-0 w-full h-px"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.4), transparent)' }}
              />
              <AnimatePresence mode="wait">
                {status === 'opened' ? (
                  <motion.div
                    key="opened"
                    className="flex flex-col items-center justify-center py-16 text-center"
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', duration: 0.5 }}
                  >
                    <motion.div
                      initial={{ scale: 0, rotate: -20 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', delay: 0.15, stiffness: 200 }}
                      className="mb-5"
                    >
                      <CheckCircle
                        size={60}
                        className="text-emerald-400"
                        style={{ filter: 'drop-shadow(0 0 20px rgba(16,185,129,0.5))' }}
                      />
                    </motion.div>
                    <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-1)' }}>Almost there</h3>
                    <p className="text-sm max-w-xs" style={{ color: 'var(--text-3)' }}>
                      Your email app should have opened with this message ready to go — just hit send there
                      to reach me directly.
                    </p>
                    <div className="flex items-center gap-3 mt-4">
                      <span className="text-xs" style={{ color: 'var(--text-4)' }}>Nothing open?</span>
                      <a
                        href={`mailto:${personalInfo.email}`}
                        className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
                      >
                        Email me directly
                      </a>
                      <CopyEmailButton />
                    </div>
                    <button
                      onClick={() => { setStatus('idle'); setForm({ name: '', email: '', subject: '', message: '' }); }}
                      className="mt-6 px-5 py-2.5 rounded-xl text-sm transition-all duration-200"
                      style={{ border: '1px solid var(--surface-border)', color: 'var(--text-3)' }}
                    >
                      Send another message
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    className="space-y-5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <h3 className="font-bold text-lg mb-6" style={{ color: 'var(--text-1)' }}>Send a Message</h3>
                    <div className="grid @sm:grid-cols-2 gap-5">
                      <Field
                        name="name" label="Your Name" placeholder="John Doe"
                        value={form.name} error={errors.name} onChange={handleChange('name')}
                      />
                      <Field
                        name="email" label="Email Address" type="email" placeholder="john@example.com"
                        value={form.email} error={errors.email} onChange={handleChange('email')}
                      />
                    </div>
                    <Field
                      name="subject" label="Subject" placeholder="Let's collaborate on..."
                      value={form.subject} error={errors.subject} onChange={handleChange('subject')}
                    />
                    <Field
                      name="message" label="Message" as="textarea"
                      placeholder="Tell me about your project, opportunity, or just say hi..."
                      value={form.message} error={errors.message} onChange={handleChange('message')}
                    />
                    <button
                      type="submit"
                      className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-white transition-all duration-200 relative overflow-hidden group"
                      style={{
                        background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                        boxShadow: '0 0 30px rgba(99,102,241,0.3)',
                      }}
                    >
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{ background: 'linear-gradient(135deg, #818cf8, #6366f1)' }} />
                      <span className="relative flex items-center gap-2">
                        <Send size={15} />
                        Open Email to Send
                      </span>
                    </button>
                    <p className="text-center text-xs" style={{ color: 'var(--text-4)' }}>
                      Opens your email app with this message pre-filled — nothing is sent from this page.
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
