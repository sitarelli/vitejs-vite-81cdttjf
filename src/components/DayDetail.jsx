import React, { useEffect, useRef } from 'react';
import WeatherIcon from './WeatherIcon.jsx';
import {
  SmallRainIcon,
  WindArrow,
  SunriseIcon,
  SunsetIcon,
} from './DetailIcons.jsx';
import {
  weatherCategory,
  weatherDescription,
  windCardinal,
} from '../services/weather.js';

const GIORNI_LONG = [
  'Domenica',
  'Lunedì',
  'Martedì',
  'Mercoledì',
  'Giovedì',
  'Venerdì',
  'Sabato',
];

function formatTabLabel(dateStr, index) {
  if (index === 0) return 'OGGI';
  if (index === 1) return 'DOMANI';
  const d = new Date(dateStr + 'T00:00:00');
  return `${GIORNI_LONG[d.getDay()].toUpperCase()} ${d.getDate()}`;
}

function hhmm(iso) {
  return iso.slice(11, 16);
}

function dayBucket(iso) {
  return iso.slice(0, 10);
}

export default function DayDetail({
  city,
  days,
  hours,
  selectedDay,
  setSelectedDay,
  onBack,
  isFavorite,
  onToggleFavorite,
}) {
  const dayData = days[selectedDay];
  const dayHours = hours.filter((h) => dayBucket(h.time) === dayData.date);

  // Se siamo su "oggi", mostriamo solo dalle ore future (inclusa l'ora corrente).
  const now = new Date();
  const isTodayTab = selectedDay === 0;
  const currentIsoDay = now.toISOString().slice(0, 10);
  const isRealToday = isTodayTab && dayData.date === currentIsoDay;

  const visibleHours = dayHours.filter((h) => {
    if (!isRealToday) return true;
    const hh = parseInt(h.time.slice(11, 13), 10);
    return hh >= now.getHours();
  });

  const sunriseTime = dayData.sunrise ? hhmm(dayData.sunrise) : null;
  const sunsetTime = dayData.sunset ? hhmm(dayData.sunset) : null;

  function isNight(iso) {
    if (!sunriseTime || !sunsetTime) return false;
    const t = hhmm(iso);
    return t < sunriseTime || t >= sunsetTime;
  }

  // Inseriamo marker alba/tramonto tra le righe orarie.
  const items = [];
  let srInserted = false;
  let ssInserted = false;

  visibleHours.forEach((h, idx) => {
    const prev = visibleHours[idx - 1];
    const prevT = prev ? hhmm(prev.time) : '00:00';
    const t = hhmm(h.time);

    if (!srInserted && sunriseTime && prevT < sunriseTime && t >= sunriseTime) {
      items.push({ type: 'sunrise', time: sunriseTime });
      srInserted = true;
    }
    if (!ssInserted && sunsetTime && prevT < sunsetTime && t >= sunsetTime) {
      items.push({ type: 'sunset', time: sunsetTime });
      ssInserted = true;
    }
    items.push({ type: 'hour', hour: h, night: isNight(h.time) });
  });

  // Scroll alla prima ora quando cambiamo giorno
  const bodyRef = useRef(null);
  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = 0;
  }, [selectedDay]);

  return (
    <>
      <div className="detail-header">
        <button className="back-btn" onClick={onBack} aria-label="indietro">
          <BackArrow />
        </button>
        <div className="detail-title">{city.name}</div>
        <div className="detail-actions">
          <button
            className={`star-btn ${isFavorite ? 'is-fav' : ''}`}
            onClick={onToggleFavorite}
            aria-label={isFavorite ? 'rimuovi dai preferiti' : 'aggiungi ai preferiti'}
          >
            {isFavorite ? '★' : '☆'}
          </button>
        </div>
      </div>

      <div className="tab-bar">
        {days.map((d, i) => (
          <button
            key={d.date}
            className={`tab ${i === selectedDay ? 'tab-active' : ''}`}
            onClick={() => setSelectedDay(i)}
          >
            {formatTabLabel(d.date, i)}
          </button>
        ))}
      </div>

      <div className="detail-body" ref={bodyRef}>
        {items.length === 0 && (
          <div className="no-hours">Nessun dato orario disponibile.</div>
        )}
        {items.map((item, i) => {
          if (item.type === 'sunrise')
            return <SunEventRow key={`sr-${i}`} type="sunrise" time={item.time} />;
          if (item.type === 'sunset')
            return <SunEventRow key={`ss-${i}`} type="sunset" time={item.time} />;
          return (
            <HourRow
              key={item.hour.time}
              hour={item.hour}
              night={item.night}
            />
          );
        })}
      </div>
    </>
  );
}

function BackArrow() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
      <path
        d="M 14 4 L 7 11 L 14 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HourRow({ hour, night }) {
  const cat = weatherCategory(hour.weatherCode);
  const desc = weatherDescription(hour.weatherCode);
  const precip =
    hour.precipitation > 0
      ? `${hour.precipitation.toFixed(1)} mm (${hour.precipitationProb ?? 0}%)`
      : 'assenti';
  const windText = `${Math.round(hour.windSpeed)} km/h ${windCardinal(hour.windDirection)}`;

  return (
    <div className="hour-row">
      <div className="hour-left">
        <div className="hour-time">{hhmm(hour.time)}</div>
        <div className="hour-desc">{desc}</div>
      </div>
      <div className="hour-icon">
        <WeatherIcon category={cat} size={58} night={night} />
      </div>
      <div className="hour-temp">
        <div className="hour-temp-main">{Math.round(hour.temperature)}°</div>
        <div className="hour-temp-sub">p.{Math.round(hour.apparent)}°</div>
      </div>
      <div className="hour-meta">
        <div className="hour-precip">
          <span>{precip}</span>
          <SmallRainIcon />
        </div>
        <div className="hour-wind">
          <span>{windText}</span>
          <WindArrow direction={hour.windDirection} />
        </div>
      </div>
    </div>
  );
}

function SunEventRow({ type, time }) {
  return (
    <div className="sun-event">
      <div className="sun-event-icon">
        {type === 'sunrise' ? <SunriseIcon /> : <SunsetIcon />}
      </div>
      <div className="sun-event-time">{time}</div>
      <div className="sun-event-label">
        {type === 'sunrise' ? 'Alba' : 'Tramonto'}
      </div>
    </div>
  );
}
