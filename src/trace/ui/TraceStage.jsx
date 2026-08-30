import { useEffect } from 'react';
import { ArrowUpRight, Terminal } from 'lucide-react';
import { TRACE } from '../data/trace';
import { playheadDate } from '../data/layout';
import { useTrace, actions } from '../state/store';
import Waterfall from '../dom/Waterfall';
import Inspector from './Inspector';
import AttributeRail from './AttributeRail';
import { personalInfo } from '../../data/portfolio';
import { trackEvent } from '../../utils/analytics';

/* The front door.

   Composition only — identity above, the trace below, and one rail on
   the right that is the inspector when something is selected and the
   attribute filter when nothing is. Two panels competing for the same
   space would mean a permanently half-empty column.

   The workspace is still here, one click down. It does a different job:
   a trace is a narrative surface, a windowed desktop is a reference
   surface, and someone who wants four projects open at once and a
   terminal running is not served by a story. */

export default function TraceStage({ onEnterWorkspace }) {
  const state = useTrace();

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') actions.escape();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const enter = () => {
    trackEvent('trace_enter_workspace', {});
    onEnterWorkspace();
  };

  return (
    <div
      className="min-h-screen"
      style={{ background: 'var(--bg)', color: 'var(--text-1)' }}
    >
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 py-8 sm:py-12">
        <header className="flex items-start justify-between gap-6 flex-wrap">
          <div className="min-w-0">
            <div
              className="text-[10.5px] font-mono uppercase tracking-[0.16em] mb-3"
              style={{ color: 'var(--text-4)' }}
            >
              trace · {TRACE.start.getFullYear()} → present
            </div>
            <h1
              className="font-display leading-[1.05]"
              style={{ color: 'var(--text-1)', fontSize: 'clamp(30px, 5vw, 46px)' }}
            >
              {personalInfo.name}
            </h1>
            <p className="text-[15px] mt-2" style={{ color: 'var(--text-2)' }}>
              {TRACE.root.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`mailto:${personalInfo.email}`}
              onClick={() => trackEvent('trace_link', { target: 'email' })}
              className="flex items-center gap-1.5 px-3 py-2 rounded-md text-[13px]"
              style={{ border: '1px solid var(--surface-border)', color: 'var(--text-2)' }}
            >
              Contact
              <ArrowUpRight size={14} />
            </a>
            <button
              onClick={enter}
              className="flex items-center gap-1.5 px-3 py-2 rounded-md text-[13px]"
              style={{ border: '1px solid var(--surface-border)', color: 'var(--text-2)' }}
            >
              <Terminal size={14} />
              Workspace
            </button>
          </div>
        </header>

        <p
          className="text-[15px] leading-relaxed mt-6 max-w-[62ch]"
          style={{ color: 'var(--text-2)' }}
        >
          {personalInfo.description}
        </p>

        <div
          className="grid gap-8 mt-10"
          style={{ gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 20rem)' }}
        >
          <div className="min-w-0">
            <div className="flex items-baseline justify-between gap-4 mb-1">
              <span
                className="text-[10.5px] font-mono uppercase tracking-[0.12em]"
                style={{ color: 'var(--text-4)' }}
              >
                {state.filter ? `filtered · ${state.filter}` : 'span tree'}
              </span>
              <span
                className="text-[11px] font-mono tabular-nums"
                style={{ color: 'var(--text-3)' }}
              >
                {playheadDate(state.playhead).toLocaleDateString(undefined, {
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
            </div>
            <Waterfall />
            <p className="text-[11.5px] mt-4" style={{ color: 'var(--text-4)' }}>
              Drag the year axis to move the playhead. Select a span for detail,
              an attribute to light every span that carries it.
            </p>
          </div>

          <div className="min-w-0">{state.focusId ? <Inspector /> : <AttributeRail />}</div>
        </div>
      </div>
    </div>
  );
}
