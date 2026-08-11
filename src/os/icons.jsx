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

/* System Monitor — heartbeat */
export const IconPulse = makeIcon(
  <>
    <path d="M3 12.2h3.2l2.3-5.7 3.4 11 2.3-5.3H21" />
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

/* AK Trade — candlesticks */
export const IconCandles = makeIcon(
  <>
    <path d="M6.4 3.8v2.4M6.4 13.4v2.4" />
    <rect x="5" y="6.2" width="2.8" height="7.2" rx="0.8" />
    <path d="M12 5v2M12 17.4v2" />
    <rect x="10.6" y="7" width="2.8" height="10.4" rx="0.8" />
    <path d="M17.6 8.6v2M17.6 17.8v1.8" />
    <rect x="16.2" y="10.6" width="2.8" height="7.2" rx="0.8" />
  </>
);

/* Files — folder */
export const IconFolder = makeIcon(
  <>
    <path d="M3.4 8.2v10a2.2 2.2 0 0 0 2.2 2.2h12.8a2.2 2.2 0 0 0 2.2-2.2V9.8a2.2 2.2 0 0 0-2.2-2.2h-6.7L9.9 5.4a2.2 2.2 0 0 0-1.7-.8H5.6a2.2 2.2 0 0 0-2.2 2.2v1.4Z" />
  </>
);

/* Notes — page with lines */
export const IconNote = makeIcon(
  <>
    <rect x="4.8" y="3.4" width="14.4" height="17.2" rx="2.2" />
    <path d="M8.4 8.6h7.2M8.4 12h7.2M8.4 15.4h4.4" />
  </>
);

/* Trash — can */
export const IconTrash = makeIcon(
  <>
    <path d="M4.4 6.6h15.2" />
    <path d="M9.4 6.6V5.2A1.6 1.6 0 0 1 11 3.6h2a1.6 1.6 0 0 1 1.6 1.6v1.4" />
    <path d="M6 6.6l.8 12.3a2.1 2.1 0 0 0 2.1 1.9h6.2a2.1 2.1 0 0 0 2.1-1.9L18 6.6" />
    <path d="M10 10.4v6M14 10.4v6" />
  </>
);

/* AK Chat — message bubble */
export const IconChat = makeIcon(
  <>
    <path d="M4 5.6a2.2 2.2 0 0 1 2.2-2.2h11.6A2.2 2.2 0 0 1 20 5.6v8.4a2.2 2.2 0 0 1-2.2 2.2H9.6L5.4 20V16.2H6.2A2.2 2.2 0 0 1 4 14V5.6Z" />
    <path d="M8 8.6h8M8 12h5" />
  </>
);

/* Dev Toolbox — wrench */
export const IconWrench = makeIcon(
  <>
    <path d="M14.6 4.4a4.6 4.6 0 0 0-6 5.6L4 14.6a2.2 2.2 0 0 0 3.1 3.1l4.6-4.6a4.6 4.6 0 0 0 5.6-6l-2.9 2.9-2.4-.6-.6-2.4Z" />
  </>
);

/* Calendar — grid with a marked day */
export const IconCalendar = makeIcon(
  <>
    <rect x="3.6" y="5" width="16.8" height="15" rx="2.2" />
    <path d="M3.6 9.6h16.8M8 3.4v3.4M16 3.4v3.4" />
    <circle cx="12" cy="14.4" r="1.6" />
  </>
);

/* Settings — gear */
export const IconGear = makeIcon(
  <>
    <circle cx="12" cy="12" r="3.4" />
    <path d="M12 2.6v2.6M12 18.8v2.6M2.6 12h2.6M18.8 12h2.6M5.35 5.35l1.85 1.85M16.8 16.8l1.85 1.85M18.65 5.35 16.8 7.2M7.2 16.8l-1.85 1.85" />
  </>
);
