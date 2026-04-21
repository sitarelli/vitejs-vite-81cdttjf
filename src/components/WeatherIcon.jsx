import React from 'react';

/**
 * Icone meteo in SVG.
 * Props:
 *   category: sun, sun-cloud, cloud, fog, rain, snow, storm
 *   size: dimensione in px (default 96)
 *   night: se true, sostituisce sole/soleNuvola con varianti "luna"
 */
export default function WeatherIcon({ category = 'sun', size = 96, night = false }) {
  const s = size;
  if (night && category === 'sun') return <MoonIcon size={s} />;
  if (night && category === 'sun-cloud') return <MoonCloudIcon size={s} />;
  switch (category) {
    case 'sun':
      return <SunIcon size={s} />;
    case 'sun-cloud':
      return <SunCloudIcon size={s} />;
    case 'cloud':
      return <CloudIcon size={s} />;
    case 'fog':
      return <FogIcon size={s} />;
    case 'rain':
      return <RainIcon size={s} />;
    case 'snow':
      return <SnowIcon size={s} />;
    case 'storm':
      return <StormIcon size={s} />;
    default:
      return <SunIcon size={s} />;
  }
}

const sunGradient = (id) => (
  <radialGradient id={id} cx="50%" cy="45%" r="55%">
    <stop offset="0%" stopColor="#fff4b0" />
    <stop offset="40%" stopColor="#ffd54a" />
    <stop offset="85%" stopColor="#f39c12" />
    <stop offset="100%" stopColor="#c46a0a" />
  </radialGradient>
);

const moonGradient = (id) => (
  <radialGradient id={id} cx="35%" cy="40%" r="75%">
    <stop offset="0%" stopColor="#fff8d4" />
    <stop offset="60%" stopColor="#f4d77a" />
    <stop offset="100%" stopColor="#b8941e" />
  </radialGradient>
);

const cloudGradient = (id) => (
  <linearGradient id={id} x1="0%" y1="0%" x2="0%" y2="100%">
    <stop offset="0%" stopColor="#ffffff" />
    <stop offset="60%" stopColor="#e8ecf1" />
    <stop offset="100%" stopColor="#b9c2cd" />
  </linearGradient>
);

const darkCloudGradient = (id) => (
  <linearGradient id={id} x1="0%" y1="0%" x2="0%" y2="100%">
    <stop offset="0%" stopColor="#8b96a3" />
    <stop offset="100%" stopColor="#525b66" />
  </linearGradient>
);

function SunIcon({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
      <defs>{sunGradient('sun-g')}</defs>
      <g stroke="#f5b73b" strokeWidth="3" strokeLinecap="round" opacity="0.55">
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i * Math.PI) / 6;
          const x1 = 50 + Math.cos(a) * 34;
          const y1 = 50 + Math.sin(a) * 34;
          const x2 = 50 + Math.cos(a) * 44;
          const y2 = 50 + Math.sin(a) * 44;
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
        })}
      </g>
      <circle cx="50" cy="50" r="28" fill="url(#sun-g)" stroke="#c46a0a" strokeWidth="1.5" />
      <circle cx="42" cy="42" r="8" fill="#fff7c2" opacity="0.55" />
    </svg>
  );
}

function SunCloudIcon({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
      <defs>
        {sunGradient('sc-sun')}
        {cloudGradient('sc-cl')}
      </defs>
      <g transform="translate(8 6)">
        <circle cx="30" cy="30" r="20" fill="url(#sc-sun)" stroke="#c46a0a" strokeWidth="1.2" />
      </g>
      <g transform="translate(18 38)">
        <path
          d="M14 32 h44 a14 14 0 0 0 0-28 a10 10 0 0 0 -18 -6 a14 14 0 0 0 -26 12 a12 12 0 0 0 0 22 z"
          fill="url(#sc-cl)"
          stroke="#5f6b78"
          strokeWidth="1"
        />
      </g>
    </svg>
  );
}

function MoonIcon({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
      <defs>
        {moonGradient('m-g')}
        <mask id="m-mask">
          <rect width="100" height="100" fill="white" />
          <circle cx="64" cy="40" r="26" fill="black" />
        </mask>
      </defs>
      <circle
        cx="50"
        cy="50"
        r="30"
        fill="url(#m-g)"
        stroke="#8d6e1f"
        strokeWidth="1.2"
        mask="url(#m-mask)"
      />
    </svg>
  );
}

function MoonCloudIcon({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
      <defs>
        {moonGradient('mc-m')}
        <mask id="mc-mask">
          <rect width="100" height="100" fill="white" />
          <circle cx="42" cy="22" r="16" fill="black" />
        </mask>
        {cloudGradient('mc-cl')}
      </defs>
      <g>
        <circle
          cx="30"
          cy="30"
          r="20"
          fill="url(#mc-m)"
          stroke="#8d6e1f"
          strokeWidth="1.2"
          mask="url(#mc-mask)"
        />
      </g>
      <g transform="translate(18 38)">
        <path
          d="M14 32 h44 a14 14 0 0 0 0-28 a10 10 0 0 0 -18 -6 a14 14 0 0 0 -26 12 a12 12 0 0 0 0 22 z"
          fill="url(#mc-cl)"
          stroke="#5f6b78"
          strokeWidth="1"
        />
      </g>
    </svg>
  );
}

function CloudIcon({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
      <defs>{cloudGradient('c-cl')}</defs>
      <g transform="translate(6 22)">
        <path
          d="M16 46 h60 a18 18 0 0 0 0-36 a12 12 0 0 0 -22 -6 a18 18 0 0 0 -34 14 a14 14 0 0 0 -4 28 z"
          fill="url(#c-cl)"
          stroke="#5f6b78"
          strokeWidth="1.2"
        />
      </g>
    </svg>
  );
}

function FogIcon({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
      <defs>{cloudGradient('f-cl')}</defs>
      <g transform="translate(6 14)">
        <path
          d="M16 46 h60 a18 18 0 0 0 0-36 a12 12 0 0 0 -22 -6 a18 18 0 0 0 -34 14 a14 14 0 0 0 -4 28 z"
          fill="url(#f-cl)"
          stroke="#5f6b78"
          strokeWidth="1.2"
        />
      </g>
      <g stroke="#b5c1cf" strokeWidth="4" strokeLinecap="round">
        <line x1="14" y1="74" x2="86" y2="74" />
        <line x1="22" y1="86" x2="78" y2="86" />
      </g>
    </svg>
  );
}

function RainIcon({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
      <defs>{darkCloudGradient('r-cl')}</defs>
      <g transform="translate(6 8)">
        <path
          d="M16 46 h60 a18 18 0 0 0 0-36 a12 12 0 0 0 -22 -6 a18 18 0 0 0 -34 14 a14 14 0 0 0 -4 28 z"
          fill="url(#r-cl)"
          stroke="#323a44"
          strokeWidth="1.2"
        />
      </g>
      <g fill="#4aa3df" stroke="#1e6fa8" strokeWidth="0.8">
        {[
          [22, 68],
          [36, 74],
          [50, 68],
          [64, 74],
          [78, 68],
          [30, 86],
          [46, 90],
          [62, 86],
          [76, 90],
        ].map(([x, y], i) => (
          <path key={i} d={`M${x} ${y} q-3 4 0 7 a2.8 2.8 0 0 0 6 0 q3 -3 0 -7 z`} />
        ))}
      </g>
    </svg>
  );
}

function SnowIcon({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
      <defs>{cloudGradient('sn-cl')}</defs>
      <g transform="translate(6 8)">
        <path
          d="M16 46 h60 a18 18 0 0 0 0-36 a12 12 0 0 0 -22 -6 a18 18 0 0 0 -34 14 a14 14 0 0 0 -4 28 z"
          fill="url(#sn-cl)"
          stroke="#5f6b78"
          strokeWidth="1.2"
        />
      </g>
      <g fill="#ffffff" stroke="#a8bdd6" strokeWidth="0.8">
        {[
          [22, 72],
          [40, 80],
          [58, 72],
          [76, 80],
          [30, 90],
          [50, 90],
          [70, 90],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="3.5" />
        ))}
      </g>
    </svg>
  );
}

function StormIcon({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
      <defs>{darkCloudGradient('st-cl')}</defs>
      <g transform="translate(6 4)">
        <path
          d="M16 46 h60 a18 18 0 0 0 0-36 a12 12 0 0 0 -22 -6 a18 18 0 0 0 -34 14 a14 14 0 0 0 -4 28 z"
          fill="url(#st-cl)"
          stroke="#323a44"
          strokeWidth="1.2"
        />
      </g>
      <polygon
        points="46,56 58,56 50,72 62,72 42,94 50,76 40,76"
        fill="#ffd94a"
        stroke="#b88908"
        strokeWidth="1"
      />
    </svg>
  );
}
