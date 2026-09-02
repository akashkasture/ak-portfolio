import { Suspense, lazy, useEffect, useMemo, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { PLANETS } from '../space/planetData';
import { detectQualityTier, hasWebGLSupport } from '../space/detectQuality';
import { personalInfo } from '../data/portfolio';
import { trackEvent } from '../utils/analytics';
import PlanetSheet from './PlanetSheet';

const SpaceScene = lazy(() => import('../space/SpaceScene'));

/* The phone's home screen.

   The workspace used to open on a tab of prose, which made "AK OS on a
   phone" a claim the phone never backed up: no desktop, no wallpaper,
   nothing you could touch. This is the desktop — the same solar system
   the desktop build runs behind its windows, framed for a portrait
   screen, with the launcher sitting on it the way icons sit on any
   phone home screen.

   Three rules hold it together:

   1. Nothing lives only inside WebGL. Every planet is also a button in
      the row above the launcher, and every figure the scene can show is
      in the sheet those buttons open. Without a GPU this screen loses a
      picture and no information.
   2. The scene loads behind two deliberate taps — the trace's Workspace
      button, then nothing at all, since Home is where the workspace
      opens. A visitor who only reads the trace never downloads a byte
      of three.js. On the phone it also runs on the small texture set:
      1.4 MB rather than 7.3 MB.
   3. The middle of the screen is deliberately empty of controls, so the
      part of the system you can actually reach with a thumb is the
      part you can tap. */

const CLOCK_TICK = 30_000;

/* This screen is a window onto space, and space does not have a light
   mode. The scene renders on #04050b whatever the theme is, so the
   launcher over it is painted in fixed light-on-dark values rather than
   theme tokens — reading --text-1 here would put near-black type on a
   black sky the moment someone switched to the light theme. The panels
   that sit *above* the scene (the planet sheet, the header, the dock)
   are ordinary surfaces and keep their tokens. */
const ON_SPACE = {
  bright: '#f1f5f9',
  body: 'rgba(226,232,240,0.72)',
  muted: 'rgba(203,213,225,0.45)',
  chip: 'rgba(255,255,255,0.055)',
  chipBorder: 'rgba(255,255,255,0.11)',
  sky: '#04050b',
};

function useClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), CLOCK_TICK);
    return () => clearInterval(id);
  }, []);
  return now;
}

function Launcher({ places, onOpen, onExit, planet, onPick, onClose }) {
  const now = useClock();

  return (
    <>
      {/* pointer-events-none all the way down except on real controls,
          so the whole middle band of the screen belongs to the scene. */}
      <div className="absolute inset-0 flex flex-col pointer-events-none">
        <div className="px-5 pt-4 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="text-[15px] font-semibold leading-tight" style={{ color: ON_SPACE.bright }}>
              {personalInfo.name}
            </div>
            <div className="text-[11.5px] mt-0.5 truncate" style={{ color: ON_SPACE.body }}>
              {personalInfo.title}
            </div>
          </div>
          {/* A real clock, reading the device's own time — the one
              readout on this screen that is not decorative. */}
          <div className="text-right flex-shrink-0">
            <div className="text-[15px] font-mono tabular-nums leading-tight" style={{ color: ON_SPACE.bright }}>
              {now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div className="text-[10.5px] font-mono" style={{ color: ON_SPACE.muted }}>
              {now.toLocaleDateString([], { day: '2-digit', month: 'short' })}
            </div>
          </div>
        </div>

        <div className="flex-1" />

        <div
          className="pointer-events-auto px-4 pb-4 pt-14"
          style={{
            background:
              `linear-gradient(to top, ${ON_SPACE.sky} 14%, rgba(4,5,11,0.90) 48%, rgba(4,5,11,0.52) 76%, transparent)`,
          }}
        >
          <div className="flex items-center justify-between gap-3 mb-2 px-1">
            <span
              className="text-[10px] font-mono uppercase tracking-[0.14em]"
              style={{ color: ON_SPACE.muted }}
            >
              Solar system
            </span>
            <span className="text-[10.5px]" style={{ color: ON_SPACE.muted }}>
              tap a body for its figures
            </span>
          </div>

          {/* The keyboard- and screen-reader-reachable half of the scene.
              Same eight bodies, same sheet, no canvas required. */}
          <div className="flex gap-1.5 overflow-x-auto pb-3 -mx-1 px-1" style={{ scrollbarWidth: 'none' }}>
            {PLANETS.map((p) => (
              <button
                key={p.id}
                onClick={() => onPick(p)}
                className="flex items-center gap-1.5 flex-shrink-0 pl-2 pr-2.5 py-1.5 rounded-full text-[11.5px]"
                style={{
                  border: `1px solid ${planet?.id === p.id ? 'rgba(255,255,255,0.28)' : ON_SPACE.chipBorder}`,
                  background: ON_SPACE.chip,
                  color: planet?.id === p.id ? ON_SPACE.bright : ON_SPACE.body,
                }}
              >
                <span
                  className="w-[7px] h-[7px] rounded-full flex-shrink-0"
                  style={{ background: p.color }}
                />
                {p.name}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-4 gap-x-2 gap-y-3.5">
            {places.map(({ id, label, icon: Icon, tint }) => (
              <button
                key={id}
                onClick={() => {
                  onOpen(id);
                  trackEvent('mobile_home_launch', { app: id });
                }}
                className="flex flex-col items-center gap-1.5"
              >
                <span
                  className="grid place-items-center rounded-[15px]"
                  style={{
                    width: 52,
                    height: 52,
                    background: `linear-gradient(150deg, ${tint[0]}, ${tint[1]})`,
                    border: '1px solid rgba(255,255,255,0.10)',
                    boxShadow: '0 6px 16px rgba(0,0,0,0.45)',
                    color: '#fff',
                  }}
                >
                  <Icon size={23} />
                </span>
                <span
                  className="text-[10.5px] leading-none text-center"
                  style={{ color: ON_SPACE.body }}
                >
                  {label}
                </span>
              </button>
            ))}

            <button
              onClick={onExit}
              className="flex flex-col items-center gap-1.5"
            >
              <span
                className="grid place-items-center rounded-[15px]"
                style={{
                  width: 52,
                  height: 52,
                  background: ON_SPACE.chip,
                  border: `1px solid ${ON_SPACE.chipBorder}`,
                  color: ON_SPACE.bright,
                }}
              >
                <ArrowLeft size={23} />
              </span>
              <span className="text-[10.5px] leading-none text-center" style={{ color: ON_SPACE.body }}>
                Trace
              </span>
            </button>
          </div>
        </div>
      </div>

      <PlanetSheet planet={planet} onClose={onClose} />
    </>
  );
}

export default function MobileHome({ places, onOpen, onExit }) {
  /* Both probes touch the DOM and navigator, so they are one-time lazy
     inits rather than memos — the same exemption the desktop Wallpaper
     already makes for them. */
  const [webgl] = useState(() => hasWebGLSupport());
  const [tier] = useState(() => detectQualityTier());
  const reduced = useMemo(
    () =>
      typeof window !== 'undefined' &&
      (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false),
    []
  );

  /* A planet picked from the chip row rather than from the canvas. The
     canvas owns its own selection because only it knows where a body
     currently is in space, so picking from a chip closes that first and
     the sheet never has two things to show. */
  const [picked, setPicked] = useState(null);

  const launcher = (planet, close) => (
    <Launcher
      places={places}
      onOpen={onOpen}
      onExit={onExit}
      planet={planet ?? picked}
      onPick={(p) => {
        close?.();
        setPicked(p);
        trackEvent('mobile_planet_pick', { planet: p.name });
      }}
      onClose={() => {
        close?.();
        setPicked(null);
      }}
    />
  );

  if (!webgl) {
    // No GPU: the stars are CSS and the launcher is unchanged. Never an
    // error message — there is nothing here the visitor has to be told
    // they are missing.
    return (
      <div className="relative w-full h-full overflow-hidden" style={{ background: ON_SPACE.sky }}>
        <div className="absolute inset-0 wallpaper-stars-a" />
        <div className="absolute inset-0 wallpaper-stars-b" />
        <div className="absolute inset-0 wallpaper-vignette" />
        {launcher(null, null)}
      </div>
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden" style={{ background: ON_SPACE.sky }}>
      <Suspense fallback={<div className="absolute inset-0" style={{ background: ON_SPACE.sky }} />}>
        <SpaceScene
          fill
          framing="portrait"
          quality={tier === 'high' ? 'medium' : tier}
          particleDensity="low"
          shootingStars={false}
          // Nothing to parallax against without a mouse, and orbits are
          // motion someone asked not to see.
          parallax={false}
          planetAnimation={!reduced}
          renderSelection={launcher}
        />
      </Suspense>
    </div>
  );
}
