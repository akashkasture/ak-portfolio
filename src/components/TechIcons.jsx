/* Inline SVG tech logo components — no external dependencies */

export function JavaIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Coffee cup body */}
      <path d="M8 4C8 4 7 5.5 7 7C7 8 7.8 8.5 7.8 9.5C7.8 10.5 7 11.5 7 11.5H15C15 11.5 14.2 10.5 14.2 9.5C14.2 8.5 15 8 15 7C15 5.5 14 4 14 4H8Z" fill={color} fillOpacity="0.85"/>
      {/* Rim */}
      <rect x="5.5" y="12.5" width="13" height="1.5" rx="0.75" fill={color}/>
      {/* Body lower */}
      <path d="M6.5 14L7.5 18C7.5 18 8.5 20 12 20C15.5 20 16.5 18 16.5 18L17.5 14H6.5Z" fill={color} fillOpacity="0.65"/>
      {/* Handle */}
      <path d="M15 7.5H17C18 7.5 18.5 8 18.5 9C18.5 10 18 10.5 17 10.5H15" stroke={color} strokeWidth="1.3" strokeLinecap="round" fill="none"/>
    </svg>
  );
}

export function PostgresIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Top ellipse */}
      <ellipse cx="12" cy="5.5" rx="8" ry="2.5" fill={color} fillOpacity="0.75"/>
      {/* Body sides */}
      <rect x="4" y="5.5" width="16" height="11" fill={color} fillOpacity="0.4"/>
      {/* Data stripes */}
      <line x1="4" y1="9" x2="20" y2="9" stroke={color} strokeOpacity="0.7" strokeWidth="0.7"/>
      <line x1="4" y1="12" x2="20" y2="12" stroke={color} strokeOpacity="0.7" strokeWidth="0.7"/>
      <line x1="4" y1="15" x2="20" y2="15" stroke={color} strokeOpacity="0.7" strokeWidth="0.7"/>
      {/* Bottom ellipse */}
      <ellipse cx="12" cy="16.5" rx="8" ry="2.5" fill={color} fillOpacity="0.9"/>
    </svg>
  );
}

export function KafkaIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Central broker node */}
      <circle cx="12" cy="12" r="3" fill={color}/>
      {/* Producer nodes */}
      <circle cx="3.5" cy="6" r="2" fill={color} fillOpacity="0.7"/>
      <circle cx="3.5" cy="18" r="2" fill={color} fillOpacity="0.7"/>
      {/* Consumer nodes */}
      <circle cx="20.5" cy="6" r="2" fill={color} fillOpacity="0.7"/>
      <circle cx="20.5" cy="18" r="2" fill={color} fillOpacity="0.7"/>
      {/* Connecting lines */}
      <line x1="5.3" y1="6.9" x2="9.3" y2="10.3" stroke={color} strokeWidth="1.2" strokeOpacity="0.6"/>
      <line x1="5.3" y1="17.1" x2="9.3" y2="13.7" stroke={color} strokeWidth="1.2" strokeOpacity="0.6"/>
      <line x1="14.7" y1="10.3" x2="18.7" y2="6.9" stroke={color} strokeWidth="1.2" strokeOpacity="0.6"/>
      <line x1="14.7" y1="13.7" x2="18.7" y2="17.1" stroke={color} strokeWidth="1.2" strokeOpacity="0.6"/>
    </svg>
  );
}

export function DockerIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Container grid */}
      <rect x="2" y="3" width="4.5" height="4" rx="0.6" fill={color} fillOpacity="0.6"/>
      <rect x="7.5" y="3" width="4.5" height="4" rx="0.6" fill={color} fillOpacity="0.6"/>
      <rect x="2" y="8" width="4.5" height="4" rx="0.6" fill={color}/>
      <rect x="7.5" y="8" width="4.5" height="4" rx="0.6" fill={color}/>
      <rect x="13" y="8" width="4.5" height="4" rx="0.6" fill={color} fillOpacity="0.75"/>
      {/* Whale body */}
      <path d="M1 14.5C6 13 18 13 22 14.5C22 17 17 19 12 19C7 19 2 17 1 14.5Z" fill={color} fillOpacity="0.45"/>
      {/* Spout */}
      <path d="M20 12C21.5 10.5 23 11 23 12" stroke={color} strokeWidth="1.2" strokeLinecap="round" fill="none" strokeOpacity="0.7"/>
    </svg>
  );
}

export function MeshIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Center */}
      <circle cx="12" cy="12" r="2.5" fill={color}/>
      {/* Outer nodes */}
      <circle cx="12" cy="3"  r="2" fill={color} fillOpacity="0.8"/>
      <circle cx="20" cy="7.5"r="2" fill={color} fillOpacity="0.8"/>
      <circle cx="20" cy="16.5" r="2" fill={color} fillOpacity="0.8"/>
      <circle cx="12" cy="21" r="2" fill={color} fillOpacity="0.8"/>
      <circle cx="4"  cy="16.5" r="2" fill={color} fillOpacity="0.8"/>
      <circle cx="4"  cy="7.5" r="2" fill={color} fillOpacity="0.8"/>
      {/* Spokes */}
      <line x1="12" y1="5"    x2="12" y2="9.5"   stroke={color} strokeWidth="1" strokeOpacity="0.45"/>
      <line x1="18.3" y1="8.5" x2="14.2" y2="10.8" stroke={color} strokeWidth="1" strokeOpacity="0.45"/>
      <line x1="18.3" y1="15.5" x2="14.2" y2="13.2" stroke={color} strokeWidth="1" strokeOpacity="0.45"/>
      <line x1="12" y1="19"   x2="12" y2="14.5"  stroke={color} strokeWidth="1" strokeOpacity="0.45"/>
      <line x1="5.7"  y1="15.5" x2="9.8" y2="13.2" stroke={color} strokeWidth="1" strokeOpacity="0.45"/>
      <line x1="5.7"  y1="8.5" x2="9.8" y2="10.8" stroke={color} strokeWidth="1" strokeOpacity="0.45"/>
    </svg>
  );
}

export function CandlestickIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Bar 1 — bullish */}
      <line x1="5" y1="3"  x2="5" y2="18" stroke={color} strokeWidth="1" strokeOpacity="0.5"/>
      <rect x="3.5" y="6"  width="3" height="7" rx="0.4" fill={color} fillOpacity="0.9"/>
      {/* Bar 2 — bearish */}
      <line x1="12" y1="4" x2="12" y2="19" stroke={color} strokeWidth="1" strokeOpacity="0.5"/>
      <rect x="10.5" y="8" width="3" height="7" rx="0.4" fill={color} fillOpacity="0.5"/>
      {/* Bar 3 — bullish */}
      <line x1="19" y1="2" x2="19" y2="15" stroke={color} strokeWidth="1" strokeOpacity="0.5"/>
      <rect x="17.5" y="4" width="3" height="7" rx="0.4" fill={color} fillOpacity="0.9"/>
      {/* Trend line */}
      <path d="M3.5 15 Q8 12 12 13 Q16 14 19 8" stroke={color} strokeWidth="0.9" fill="none" strokeOpacity="0.5" strokeDasharray="1.5 1.5"/>
    </svg>
  );
}
