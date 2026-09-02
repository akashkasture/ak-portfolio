/* AK OS icon language — every glyph drawn on the same 24px grid with
   1.8 stroke, round caps/joins, so the dock reads as one family rather
   than a grab-bag of library icons. Components are lucide-compatible
   (size / style / className props) so they drop into the registry. */

function makeIcon(children) {
  return function AkIcon({ size = 24, style, className }) {
    return (
      <svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={style}
        className={className}
        aria-hidden="true"
      >
        {children}
      </svg>
    );
  };
}

/* About — portrait */
export const IconPerson = makeIcon(
  <>
    <circle cx="12" cy="8.6" r="3.4" />
    <path d="M5.2 19.6c1.3-3.4 3.8-5.1 6.8-5.1s5.5 1.7 6.8 5.1" />
  </>
);

/* Experience — briefcase with a career pulse inside */
export const IconCareer = makeIcon(
  <>
    <rect x="3.6" y="7.6" width="16.8" height="12" rx="2.4" />
    <path d="M9 7.6V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1.6" />
    <path d="M7 14h2.4l1.4-2.4 2 4.2 1.4-2.4H17" />
  </>
);

/* Projects — rocket */
export const IconRocket = makeIcon(
  <>
    <path d="M12 2.8c2.9 1.7 4.6 4.8 4.6 8.3l-.1 1.9-2.2 2.2h-4.6L7.5 13l-.1-1.9c0-3.5 1.7-6.6 4.6-8.3Z" />
    <circle cx="12" cy="9.6" r="1.7" />
    <path d="M7.6 13.4 5.2 16.8l3.2-.6M16.4 13.4l2.4 3.4-3.2-.6M12 15.6v4.6" />
  </>
);

/* Terminal — prompt */
export const IconPrompt = makeIcon(
  <>
    <path d="M4.5 6.8 10 12l-5.5 5.2" />
    <path d="M12.8 17.2h6.7" />
  </>
);

/* Skills — constellation */
export const IconConstellation = makeIcon(
  <>
    <circle cx="6.2" cy="7" r="1.7" />
    <circle cx="16.4" cy="5.4" r="1.7" />
    <circle cx="17.8" cy="16.2" r="1.7" />
    <circle cx="8.8" cy="17" r="2.3" />
    <path d="M7.9 7.2l6.8-1.5M16.7 7.1l.8 7.4M7.1 8.5l1.3 6.2M11 16.5l5.1-.2" />
  </>
);

/* Contact — paper plane */
export const IconPlane = makeIcon(
  <>
    <path d="M20.5 3.6 3.4 10.8l6.2 2.7 2.9 6.2 7.99-16.1Z" />
    <path d="M9.6 13.5l10.9-9.9" />
  </>
);

/* Architecture — topology */
export const IconTopology = makeIcon(
  <>
    <rect x="9.4" y="3" width="5.2" height="4.6" rx="1.2" />
    <rect x="3.2" y="16.4" width="5.2" height="4.6" rx="1.2" />
    <rect x="15.6" y="16.4" width="5.2" height="4.6" rx="1.2" />
    <path d="M12 7.6v3M12 10.6H5.8v5.8M12 10.6h6.2v5.8" />
  </>
);

/* Briefing — a sheet with a rule under its heading */
export const IconBriefing = makeIcon(
  <>
    <rect x="4.6" y="3" width="14.8" height="18" rx="2.2" />
    <path d="M8.2 7.6h7.6M8.2 11h7.6M8.2 14.4h4.8" />
  </>
);

/* Writing — a nib on a baseline. Deliberately not another sheet of
   paper: Briefing is already a document, and two documents in one dock
   is a dock you have to read twice. */
export const IconWriting = makeIcon(
  <>
    <path d="M4.4 20.4h15.2" />
    <path d="M7 15.6 15.9 6.7a2.2 2.2 0 1 1 3.1 3.1L10.1 18.7l-4 .9.9-4Z" />
  </>
);

/* Settings — gear */
export const IconGear = makeIcon(
  <>
    <circle cx="12" cy="12" r="3.4" />
    <path d="M12 2.6v2.6M12 18.8v2.6M2.6 12h2.6M18.8 12h2.6M5.35 5.35l1.85 1.85M16.8 16.8l1.85 1.85M18.65 5.35 16.8 7.2M7.2 16.8l-1.85 1.85" />
  </>
);

/* Home / Orrery — a body on an inclined orbit around a centre */
export const IconOrbit = makeIcon(
  <>
    <circle cx="12" cy="12" r="2.6" />
    <ellipse cx="12" cy="12" rx="9.4" ry="4.6" transform="rotate(-24 12 12)" />
    <circle cx="19.4" cy="8.2" r="1.5" fill="currentColor" stroke="none" />
  </>
);

/* Signal Flow — three nodes and the edges between them */
export const IconSignalFlow = makeIcon(
  <>
    <circle cx="12" cy="4.6" r="2" />
    <circle cx="5.4" cy="16" r="2" />
    <circle cx="18.6" cy="16" r="2" />
    <path d="M10.6 6.3 6.8 14.3M13.4 6.3l3.8 8M7.4 16h9.2" />
  </>
);
