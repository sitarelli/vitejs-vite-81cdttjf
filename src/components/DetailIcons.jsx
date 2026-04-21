import React from 'react';

export function ThermoIcon({ type = 'hot', size = 16 }) {
  const bulb = type === 'hot' ? '#d22d2d' : '#2a78c9';
  const stem = type === 'hot' ? '#e6565a' : '#4aa3df';
  return (
    <svg width={size} height={size * 1.6} viewBox="0 0 20 32" aria-hidden="true">
      <rect x="8" y="3" width="4" height="18" rx="2" fill={stem} stroke="#2c2c2c" strokeWidth="0.8" />
      <circle cx="10" cy="23" r="5" fill={bulb} stroke="#2c2c2c" strokeWidth="0.8" />
      <line x1="13" y1="7" x2="15" y2="7" stroke="#2c2c2c" strokeWidth="0.8" strokeLinecap="round" />
      <line x1="13" y1="12" x2="15" y2="12" stroke="#2c2c2c" strokeWidth="0.8" strokeLinecap="round" />
      <line x1="13" y1="17" x2="15" y2="17" stroke="#2c2c2c" strokeWidth="0.8" strokeLinecap="round" />
    </svg>
  );
}

export function DropIcon({ size = 14 }) {
  return (
    <svg width={size} height={size * 1.3} viewBox="0 0 20 26" aria-hidden="true">
      <path
        d="M10 2 C 10 2, 2 12, 2 18 a8 8 0 0 0 16 0 C 18 12, 10 2, 10 2 Z"
        fill="#4aa3df"
        stroke="#1e6fa8"
        strokeWidth="0.8"
      />
      <ellipse cx="7" cy="16" rx="1.6" ry="3" fill="#aed8f3" opacity="0.8" />
    </svg>
  );
}

export function WindIcon({ size = 16 }) {
  return (
    <svg width={size * 1.3} height={size} viewBox="0 0 26 20" aria-hidden="true">
      <g fill="none" stroke="#e8eef5" strokeWidth="1.6" strokeLinecap="round">
        <path d="M2 6 h14 a3 3 0 1 0 -3 -3" />
        <path d="M2 12 h18 a3.5 3.5 0 1 1 -3.5 3.5" />
        <path d="M2 18 h10" />
      </g>
    </svg>
  );
}

/** Piccola icona "nuvola con pioggia" in grigio per la colonna precipitazioni */
export function SmallRainIcon({ size = 18, color = '#9aa6b3' }) {
  return (
    <svg width={size} height={size * 0.85} viewBox="0 0 22 18" aria-hidden="true">
      <path
        d="M5 10 h12 a4 4 0 0 0 0 -8 a3 3 0 0 0 -5 -1.5 a4 4 0 0 0 -7 3 a3 3 0 0 0 0 6.5 z"
        fill={color}
      />
      <g stroke={color} strokeWidth="1.2" strokeLinecap="round">
        <line x1="7" y1="12" x2="6" y2="16" />
        <line x1="11" y1="12" x2="10" y2="16" />
        <line x1="15" y1="12" x2="14" y2="16" />
      </g>
    </svg>
  );
}

/** Freccia del vento che ruota in base ai gradi (0 = Nord, senso orario) */
export function WindArrow({ direction = 0, size = 14, color = '#7a8a9a' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 14 14"
      aria-hidden="true"
      style={{ transform: `rotate(${direction}deg)`, flexShrink: 0 }}
    >
      <path
        d="M 7 1.5 L 12 12 L 7 9 L 2 12 Z"
        fill="none"
        stroke={color}
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Icona tramonto: semisole + linea orizzonte + freccia verso il basso */
export function SunsetIcon({ size = 28 }) {
  return (
    <svg width={size} height={size * 0.7} viewBox="0 0 30 21" aria-hidden="true">
      <defs>
        <radialGradient id="ss-g" cx="50%" cy="100%" r="90%">
          <stop offset="0%" stopColor="#ffd54a" />
          <stop offset="100%" stopColor="#e67e22" />
        </radialGradient>
      </defs>
      <path d="M 6 16 A 9 9 0 0 1 24 16 Z" fill="url(#ss-g)" stroke="#b8651a" strokeWidth="0.7" />
      <g stroke="#e08c1e" strokeWidth="1.2" strokeLinecap="round">
        <line x1="2" y1="13" x2="4" y2="13" />
        <line x1="26" y1="13" x2="28" y2="13" />
        <line x1="5" y1="6" x2="7" y2="8" />
        <line x1="25" y1="6" x2="23" y2="8" />
        <line x1="15" y1="2" x2="15" y2="4" />
      </g>
      <line x1="0" y1="17" x2="30" y2="17" stroke="#b5b5b5" strokeWidth="0.8" />
      <path d="M 15 18 l -2 2 h 4 z" fill="#b5b5b5" />
    </svg>
  );
}

/** Icona alba: come il tramonto ma con freccia verso l'alto */
export function SunriseIcon({ size = 28 }) {
  return (
    <svg width={size} height={size * 0.7} viewBox="0 0 30 21" aria-hidden="true">
      <defs>
        <radialGradient id="sr-g" cx="50%" cy="100%" r="90%">
          <stop offset="0%" stopColor="#fff4b0" />
          <stop offset="100%" stopColor="#ffb73b" />
        </radialGradient>
      </defs>
      <path d="M 6 16 A 9 9 0 0 1 24 16 Z" fill="url(#sr-g)" stroke="#c88718" strokeWidth="0.7" />
      <g stroke="#ee9618" strokeWidth="1.2" strokeLinecap="round">
        <line x1="2" y1="13" x2="4" y2="13" />
        <line x1="26" y1="13" x2="28" y2="13" />
        <line x1="5" y1="6" x2="7" y2="8" />
        <line x1="25" y1="6" x2="23" y2="8" />
        <line x1="15" y1="2" x2="15" y2="4" />
      </g>
      <line x1="0" y1="17" x2="30" y2="17" stroke="#b5b5b5" strokeWidth="0.8" />
      <path d="M 15 20 l -2 -2 h 4 z" fill="#b5b5b5" />
    </svg>
  );
}
