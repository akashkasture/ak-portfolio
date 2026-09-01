import { useCallback, useEffect, useState } from 'react';
import { ArrowUpRight, Search, Terminal } from 'lucide-react';
import { TRACE } from '../data/trace';
import { playheadDate } from '../data/layout';
import { useTrace, actions } from '../state/store';
import { useTraceUrl } from '../state/url';
import SpatialTrace from './SpatialTrace';
import Inspector from './Inspector';
import AttributeRail from './AttributeRail';
import TraceSummary from './TraceSummary';
import SpanPalette from './SpanPalette';
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
  const [palette, setPalette] = useState(false);
  useTraceUrl();

  const openPalette = useCallback(() => {
    setPalette(true);
    trackEvent('trace_palette_open', {});
  }, []);

  /* One keydown listener for the page. `/` is the convention in trace
     and log tooling and ⌘K is the convention everywhere else, so both
     open the palette; neither may fire while someone is typing into a
     field, which is how a search shortcut usually breaks. */
  useEffect(() => {
    const onKey = (e) => {
      const el = document.activeElement;
      const typing =
        el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable);
      if (e.key === 'Escape') {
        // The palette is the outermost layer, so it closes first rather
        // than letting Escape also shed a layer of trace state on the
        // way out.
        if (palette) setPalette(false);
        else actions.escape();
        return;
      }
      if ((e.key === '/' && !typing) || (e.key.toLowerCase() === 'k' && (e.metaKey || e.ctrlKey))) {
        e.preventDefault();
        openPalette();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [palette, openPalette]);

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
            {/* A shortcut nobody is told about is a shortcut nobody uses,
                so the key is printed on the control that triggers it. */}
            <button
              onClick={openPalette}
              className="flex items-center gap-2 px-3 py-2 rounded-md text-[13px]"
              style={{ border: '1px solid var(--surface-border)', color: 'var(--text-3)' }}
            >
              <Search size={14} />
              Find
              <kbd className="text-[10.5px] font-mono" style={{ color: 'var(--text-4)' }}>/</kbd>
            </button>
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

        <TraceSummary />

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
            <SpatialTrace />
            <div className="mt-4 space-y-1.5">
              <p className="text-[11.5px]" style={{ color: 'var(--text-4)' }}>
                Drag the year axis to move the playhead. Select a span for detail,
                an attribute to light every span that carries it.
              </p>
              <p
                className="text-[11.5px] flex items-start gap-2"
                style={{ color: 'var(--text-4)' }}
              >
                <span
                  className="flex-shrink-0 mt-[0.55em]"
                  style={{ width: 14, height: 2, background: 'var(--text-1)', opacity: 0.85 }}
                />
                <span>
                  The critical path — the stretch of the trace each span alone
                  accounts for. Anything without it ran in parallel, which made
                  it concurrent, not lesser.
                </span>
              </p>
            </div>
          </div>

          <div className="min-w-0">{state.focusId ? <Inspector /> : <AttributeRail />}</div>
        </div>
      </div>

      {palette && <SpanPalette onClose={() => setPalette(false)} />}
    </div>
  );
}
