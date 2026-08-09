import { useState } from 'react';
import { ChevronLeft, ChevronRight, FileText, Milestone, Briefcase } from 'lucide-react';
import { timeline, blogPosts, experience } from '../data/portfolio';

/* Every marker on this calendar comes from a real dated entry in portfolio.js
   (timeline, blogPosts, experience). Only month+year granularity is used
   since that's the precision the source data actually has — no specific
   day is ever invented. */

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTHS_FULL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function monthKey(year, month) {
  return `${year}-${month}`;
}

function parseMonthYear(str) {
  const m = str.trim().match(/^([A-Za-z]{3})[a-z]*\s+(\d{4})$/);
  if (!m) return null;
  const idx = MONTHS.findIndex((x) => x.toLowerCase() === m[1].slice(0, 3).toLowerCase());
  if (idx === -1) return null;
  return { year: Number(m[2]), month: idx };
}

function buildMonthIndex() {
  const index = {};
  const add = (year, month, entry) => {
    const key = monthKey(year, month);
    (index[key] ||= []).push(entry);
  };

  timeline.forEach((t) => {
    const parsed = parseMonthYear(t.year);
    if (parsed) add(parsed.year, parsed.month, { kind: 'milestone', title: t.title, body: t.description, color: t.color });
  });

  blogPosts.forEach((p) => {
    const parsed = parseMonthYear(p.date);
    if (parsed) add(parsed.year, parsed.month, { kind: 'note', title: p.title, body: p.excerpt, color: p.color });
  });

  const now = new Date();
  experience.forEach((e) => {
    const [startStr, endStr] = e.period.split('—').map((s) => s.trim());
    const start = parseMonthYear(startStr);
    if (!start) return;
    const present = endStr.toLowerCase() === 'present';
    const end = present ? { year: now.getFullYear(), month: now.getMonth() } : parseMonthYear(endStr);
    if (!end) return;

    let y = start.year;
    let m = start.month;
    while (y < end.year || (y === end.year && m <= end.month)) {
      const isLatest = present && y === end.year && m === end.month;
      add(y, m, { kind: 'role', title: `${e.role} — ${e.company}`, body: isLatest ? 'Current role' : null, color: '#f59e0b' });
      m += 1;
      if (m > 11) { m = 0; y += 1; }
    }
  });

  return index;
}

const KIND_ICON = { milestone: Milestone, note: FileText, role: Briefcase };

export default function CalendarApp() {
  const [index] = useState(buildMonthIndex);
  const [view, setView] = useState(() => { const d = new Date(); return { year: d.getFullYear(), month: d.getMonth() }; });
  const today = useState(() => new Date())[0];

  const shift = (delta) => {
    setView((v) => {
      let month = v.month + delta;
      let year = v.year;
      if (month < 0) { month = 11; year -= 1; }
      if (month > 11) { month = 0; year += 1; }
      return { year, month };
    });
  };

  const goToday = () => setView({ year: today.getFullYear(), month: today.getMonth() });

  const firstDay = new Date(view.year, view.month, 1).getDay();
  const daysInMonth = new Date(view.year, view.month + 1, 0).getDate();
  const cells = [...Array(firstDay).fill(null), ...Array(daysInMonth).fill(0).map((_, i) => i + 1)];
  const isCurrentMonth = view.year === today.getFullYear() && view.month === today.getMonth();

  const entries = index[monthKey(view.year, view.month)] || [];

  return (
    <div className="@container flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 flex-shrink-0" style={{ borderBottom: '1px solid var(--surface-border)' }}>
        <span className="text-sm font-semibold" style={{ color: 'var(--text-1)' }}>{MONTHS_FULL[view.month]} {view.year}</span>
        <div className="flex items-center gap-1">
          <button onClick={goToday} className="px-2.5 py-1 rounded-lg text-[11px] mr-1" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-3)' }}>Today</button>
          <button onClick={() => shift(-1)} aria-label="Previous month" className="p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors"><ChevronLeft size={15} /></button>
          <button onClick={() => shift(1)} aria-label="Next month" className="p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors"><ChevronRight size={15} /></button>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto p-4">
        {/* Weekday row */}
        <div className="grid grid-cols-7 gap-1 mb-1">
          {WEEKDAYS.map((w) => (
            <div key={w} className="text-center text-[10px] font-mono uppercase" style={{ color: 'var(--text-4)' }}>{w}</div>
          ))}
        </div>

        {/* Day grid */}
        <div className="grid grid-cols-7 gap-1 mb-5">
          {cells.map((day, i) => {
            const isToday = isCurrentMonth && day === today.getDate();
            return (
              <div
                key={i}
                className="aspect-square flex items-center justify-center rounded-lg text-xs"
                style={{
                  background: isToday ? 'var(--os-accent)' : 'rgba(255,255,255,0.03)',
                  color: isToday ? '#fff' : day ? 'var(--text-2)' : 'transparent',
                  fontWeight: isToday ? 700 : 400,
                }}
              >
                {day || ''}
              </div>
            );
          })}
        </div>

        {/* This month's real entries */}
        <div>
          <h3 className="text-[10px] font-mono uppercase tracking-widest mb-2.5" style={{ color: 'var(--text-4)' }}>This Month</h3>
          {entries.length === 0 ? (
            <p className="text-xs" style={{ color: 'var(--text-4)' }}>No recorded milestones this month.</p>
          ) : (
            <div className="space-y-2">
              {entries.map((e, i) => {
                const Icon = KIND_ICON[e.kind];
                return (
                  <div key={i} className="flex items-start gap-2.5 rounded-xl p-3" style={{ background: `${e.color}0a`, border: `1px solid ${e.color}30` }}>
                    <Icon size={14} className="flex-shrink-0 mt-0.5" style={{ color: e.color }} />
                    <div className="min-w-0">
                      <div className="text-[13px] font-semibold" style={{ color: 'var(--text-1)' }}>{e.title}</div>
                      {e.body && <div className="text-[11px] mt-0.5 leading-relaxed" style={{ color: 'var(--text-3)' }}>{e.body}</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
