import { lazy, Suspense, useState } from 'react';
import { ArrowUpRight, Terminal, X } from 'lucide-react';
import { TRACE, SPAN_BY_ID } from '../data/trace';
import { playheadDate } from '../data/layout';
import { useTrace } from '../state/store';
import Waterfall from '../dom/Waterfall';
import Inspector from './Inspector';
import AttributeRail from './AttributeRail';
import { personalInfo } from '../../data/portfolio';
import { trackEvent } from '../../utils/analytics';

const FlowMap = lazy(() => import('../../mobile/FlowMap'));

/* The trace on a phone.

   This is the part of the concept that pays for itself. A waterfall is a
   vertical list, so a tall screen gets the *canonical* rendering rather
   than a squeezed desktop one — spans stacked top to bottom, time
   running across a full-width track, depth as indentation. Nothing is
   dropped and nothing is rearranged into a different information
   architecture; it is the same span tree, the same attributes, the same
   hot path.

   And no WebGL. The 864 kB is not a trade worth making on someone's
   mobile data for a third axis they can reach by tapping "map" — which
   is the service map, camera B's projection, already drawn flat.

   The two views the desktop reaches by orbiting, the phone reaches by a
   toggle. Same two views, same data, an input appropriate to the
   device. */

const VIEWS = [
  { id: 'trace', label: 'Trace', hint: 'time' },
  { id: 'map', label: 'Map', hint: 'topology' },
];

export default function MobileTrace({ onEnterWorkspace }) {
  const state = useTrace();
  const [view, setView] = useState('trace');
  const [showAttributes, setShowAttributes] = useState(false);
  const focused = state.focusId ? SPAN_BY_ID[state.focusId] : null;

  const pick = (id) => {
    setView(id);
    trackEvent('mobile_trace_view', { view: id });
  };

  return (
    <div
      className="min-h-screen"
      style={{ background: 'var(--bg)', color: 'var(--text-1)' }}
    >
      <div className="px-5 pt-7 pb-24" style={{ paddingTop: 'calc(env(safe-area-inset-top) + 28px)' }}>
        <div
          className="text-[10px] font-mono uppercase tracking-[0.16em] mb-2.5"
          style={{ color: 'var(--text-4)' }}
        >
          trace · {TRACE.start.getFullYear()} → present
        </div>
        <h1
          className="font-display text-[30px] leading-[1.05]"
          style={{ color: 'var(--text-1)' }}
        >
          {personalInfo.name}
        </h1>
        <p className="text-[14px] mt-1.5" style={{ color: 'var(--text-2)' }}>
          {TRACE.root.subtitle}
        </p>
        <p className="text-[14px] leading-relaxed mt-4" style={{ color: 'var(--text-2)' }}>
          {personalInfo.description}
        </p>

        <div className="flex items-center gap-1.5 mt-6 flex-wrap">
          {VIEWS.map((v) => {
            const active = view === v.id;
            return (
              <button
                key={v.id}
                onClick={() => pick(v.id)}
                aria-pressed={active}
                className="px-2.5 py-1 rounded text-[11.5px] font-mono"
                style={{
                  color: active ? 'var(--text-1)' : 'var(--text-3)',
                  background: active ? 'var(--surface-alt)' : 'transparent',
                  border: `1px solid ${active ? 'var(--surface-border)' : 'transparent'}`,
                }}
              >
                {v.label}
                <span style={{ color: 'var(--text-4)' }}> · {v.hint}</span>
              </button>
            );
          })}
          <button
            onClick={() => setShowAttributes(true)}
            className="px-2.5 py-1 rounded text-[11.5px] font-mono ml-auto"
            style={{
              color: state.filter ? '#fff' : 'var(--text-3)',
              background: state.filter ? 'var(--os-accent)' : 'transparent',
              border: `1px solid ${state.filter ? 'var(--os-accent)' : 'var(--surface-border)'}`,
            }}
          >
            {state.filter || 'filter'}
          </button>
        </div>

        {view === 'trace' ? (
          <div className="mt-4">
            <div className="flex items-baseline justify-between gap-3 mb-1">
              <span
                className="text-[10px] font-mono uppercase tracking-[0.12em]"
                style={{ color: 'var(--text-4)' }}
              >
                span tree
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
            <Waterfall compact />
            <p className="text-[11px] mt-3" style={{ color: 'var(--text-4)' }}>
              Drag the year axis to move the playhead. Tap a span for detail.
            </p>
          </div>
        ) : (
          <div className="mt-5">
            <Suspense fallback={null}>
              <FlowMap />
            </Suspense>
          </div>
        )}
      </div>

      {/* Detail arrives as a sheet rather than a side rail — there is no
          room beside anything on a phone. */}
      {focused && (
        <div
          className="fixed inset-x-0 bottom-0 z-30 max-h-[72vh] overflow-y-auto rounded-t-xl"
          style={{
            background: 'var(--bg)',
            borderTop: '1px solid var(--surface-border)',
            boxShadow: '0 -12px 40px rgba(0,0,0,0.55)',
            paddingBottom: 'env(safe-area-inset-bottom)',
          }}
        >
          <div className="p-3">
            <Inspector />
          </div>
        </div>
      )}

      {showAttributes && (
        <div
          className="fixed inset-0 z-40 flex flex-col"
          style={{ background: 'var(--bg)' }}
          role="dialog"
          aria-modal="true"
          aria-label="Filter by attribute"
        >
          <div
            className="flex items-center justify-between px-5 py-3 flex-shrink-0"
            style={{
              borderBottom: '1px solid var(--surface-border)',
              paddingTop: 'calc(env(safe-area-inset-top) + 12px)',
            }}
          >
            <span className="text-[14px] font-medium">Filter</span>
            <button onClick={() => setShowAttributes(false)} aria-label="Close" className="p-1">
              <X size={18} style={{ color: 'var(--text-3)' }} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-5 py-5">
            <AttributeRail />
          </div>
        </div>
      )}

      <nav
        className="fixed inset-x-0 bottom-0 z-20 flex items-stretch"
        style={{
          height: 58,
          borderTop: '1px solid var(--surface-border)',
          background: 'var(--nav-bg)',
          paddingBottom: 'env(safe-area-inset-bottom)',
          // The detail sheet covers this; hiding it avoids two competing
          // bottom surfaces stacked on top of each other.
          display: focused ? 'none' : 'flex',
        }}
        aria-label="Elsewhere"
      >
        <a
          href={`mailto:${personalInfo.email}`}
          onClick={() => trackEvent('trace_link', { target: 'email', surface: 'mobile' })}
          className="flex-1 flex items-center justify-center gap-1.5 text-[13px]"
          style={{ color: 'var(--text-2)' }}
        >
          Contact
          <ArrowUpRight size={14} />
        </a>
        <button
          onClick={() => {
            trackEvent('trace_enter_workspace', { surface: 'mobile' });
            onEnterWorkspace();
          }}
          className="flex-1 flex items-center justify-center gap-1.5 text-[13px]"
          style={{ color: 'var(--text-2)', borderLeft: '1px solid var(--surface-border)' }}
        >
          <Terminal size={14} />
          Workspace
        </button>
      </nav>
    </div>
  );
}
