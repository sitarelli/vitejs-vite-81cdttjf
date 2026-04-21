import React, { useEffect, useMemo, useState } from 'react';
import WeatherIcon from './components/WeatherIcon.jsx';
import DayDetail from './components/DayDetail.jsx';
import { ThermoIcon, DropIcon, WindIcon } from './components/DetailIcons.jsx';
import {
  fetchForecast,
  geocodeCity,
  weatherCategory,
  windCardinal,
} from './services/weather.js';

const DEFAULT_CITY = {
  name: 'Milano',
  admin: 'MI',
  country: 'Italia',
  countryCode: 'IT',
  latitude: 45.4642,
  longitude: 9.19,
  timezone: 'Europe/Rome',
};

const FAVORITES_KEY = 'meteo-app.favorites';
const LAST_CITY_KEY = 'meteo-app.last-city';
const GIORNI = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];

function formatDay(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return { dow: GIORNI[d.getDay()], dnum: d.getDate() };
}

function cityKey(c) {
  return `${c.latitude.toFixed(3)},${c.longitude.toFixed(3)}`;
}

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const v = JSON.parse(raw);
    return v ?? fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export default function App() {
  const [view, setView] = useState('main'); // 'main' | 'detail'
  const [selectedDay, setSelectedDay] = useState(0);
  const [city, setCity] = useState(() => readJSON(LAST_CITY_KEY, DEFAULT_CITY));
  const [query, setQuery] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [favorites, setFavorites] = useState(() => {
    const v = readJSON(FAVORITES_KEY, []);
    return Array.isArray(v) ? v : [];
  });

  const isFavorite = useMemo(
    () => favorites.some((f) => cityKey(f) === cityKey(city)),
    [favorites, city]
  );

  const todayCategory = useMemo(
    () => (data ? weatherCategory(data.current.weatherCode) : 'sun'),
    [data]
  );

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);
    fetchForecast(city.latitude, city.longitude, city.timezone)
      .then((d) => {
        if (alive) setData(d);
      })
      .catch((e) => {
        if (alive) setError(e.message || 'Errore nel caricare i dati');
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    writeJSON(LAST_CITY_KEY, city);
    return () => {
      alive = false;
    };
  }, [city]);

  function toggleFavorite() {
    const key = cityKey(city);
    const updated = favorites.some((f) => cityKey(f) === key)
      ? favorites.filter((f) => cityKey(f) !== key)
      : [...favorites, city];
    setFavorites(updated);
    writeJSON(FAVORITES_KEY, updated);
  }

  function removeFavorite(c) {
    const updated = favorites.filter((f) => cityKey(f) !== cityKey(c));
    setFavorites(updated);
    writeJSON(FAVORITES_KEY, updated);
  }

  async function onSearchSubmit(e) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    try {
      setLoading(true);
      setError(null);
      const found = await geocodeCity(q);
      setCity(found);
      setQuery('');
      setDrawerOpen(false);
      setView('main');
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  function selectFavorite(c) {
    setCity(c);
    setDrawerOpen(false);
    setView('main');
  }

  function openDay(index) {
    setSelectedDay(index);
    setView('detail');
  }

  // === RENDER VISTA DETTAGLIO ===
  if (view === 'detail' && data) {
    return (
      <div className="app">
        <div className="phone phone-detail">
          <DayDetail
            city={city}
            days={data.days}
            hours={data.hours}
            selectedDay={selectedDay}
            setSelectedDay={setSelectedDay}
            onBack={() => setView('main')}
            isFavorite={isFavorite}
            onToggleFavorite={toggleFavorite}
          />
          <Footer variant="light" />
        </div>
      </div>
    );
  }

  // === RENDER VISTA PRINCIPALE ===
  const today = data?.days?.[0];

  return (
    <div className="app">
      <div className="phone">
        <TopBar
          city={city}
          onToggleDrawer={() => setDrawerOpen((v) => !v)}
          onToggleFavorite={toggleFavorite}
          isFavorite={isFavorite}
        />

        {drawerOpen && (
          <Drawer
            query={query}
            setQuery={setQuery}
            onSearchSubmit={onSearchSubmit}
            favorites={favorites}
            currentCityKey={cityKey(city)}
            onSelectFavorite={selectFavorite}
            onRemoveFavorite={removeFavorite}
            onClose={() => setDrawerOpen(false)}
          />
        )}

        {loading && <div className="status">Caricamento…</div>}
        {error && <div className="status error">⚠ {error}</div>}

        {data && !loading && (
          <div className="forecast">
            <TodayRow
              category={todayCategory}
              current={data.current}
              today={today}
              onClick={() => openDay(0)}
            />
            {data.days.slice(1).map((d, i) => (
              <DayRow key={d.date} day={d} onClick={() => openDay(i + 1)} />
            ))}
          </div>
        )}

        <Footer />
      </div>
    </div>
  );
}

function TopBar({ city, onToggleDrawer, onToggleFavorite, isFavorite }) {
  return (
    <div className="topbar">
      <button className="icon-btn" onClick={onToggleDrawer} aria-label="menu">
        <span className="hamburger" />
      </button>
      <div className="topbar-title">
        <div className="city">
          {city.name} <span className="caret">▾</span>
        </div>
        <div className="region">
          {(city.admin || city.countryCode) + (city.country ? ', ' + city.country : '')}
        </div>
      </div>
      <button
        className={`icon-btn star-btn ${isFavorite ? 'is-fav' : ''}`}
        onClick={onToggleFavorite}
        aria-label={isFavorite ? 'rimuovi dai preferiti' : 'aggiungi ai preferiti'}
      >
        {isFavorite ? '★' : '☆'}
      </button>
    </div>
  );
}

function Drawer({
  query,
  setQuery,
  onSearchSubmit,
  favorites,
  currentCityKey,
  onSelectFavorite,
  onRemoveFavorite,
  onClose,
}) {
  return (
    <div className="drawer">
      <form className="search-bar" onSubmit={onSearchSubmit}>
        <input
          autoFocus
          type="text"
          placeholder="Cerca città… (es. Roma, Parigi, NY)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">Vai</button>
      </form>
      <div className="drawer-section">
        <div className="drawer-title">Preferiti</div>
        {favorites.length === 0 ? (
          <div className="drawer-empty">
            Nessun preferito. Tocca la <span className="star-inline">★</span> in alto per
            aggiungere la località corrente.
          </div>
        ) : (
          <ul className="fav-list">
            {favorites.map((f) => {
              const active = cityKey(f) === currentCityKey;
              return (
                <li key={cityKey(f)} className={`fav-item ${active ? 'fav-active' : ''}`}>
                  <button className="fav-select" onClick={() => onSelectFavorite(f)}>
                    <span className="fav-star">★</span>
                    <span className="fav-name">
                      {f.name}
                      <span className="fav-region">
                        {(f.admin || f.countryCode) + (f.country ? ', ' + f.country : '')}
                      </span>
                    </span>
                  </button>
                  <button
                    className="fav-remove"
                    onClick={() => onRemoveFavorite(f)}
                    aria-label={`rimuovi ${f.name}`}
                  >
                    ✕
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
      <button className="drawer-close" onClick={onClose}>
        Chiudi
      </button>
    </div>
  );
}

function TodayRow({ category, current, today, onClick }) {
  const precip =
    today && today.precipitation > 0
      ? `${today.precipitation.toFixed(1)} mm${
          today.precipitationProb != null ? ` [${today.precipitationProb}%]` : ''
        }`
      : 'Assenti';
  const wind = `${Math.round(current.windSpeed)} Km/h ${
    windCardinal(current.windDirection) || 'vari'
  }`;

  return (
    <button type="button" className="row row-today" onClick={onClick}>
      <div className="day-label">
        <div className="day-word">Oggi</div>
      </div>
      <div className="today-main">
        <WeatherIcon category={category} size={108} />
        <div className="today-temp">{current.temperature.toFixed(1)}°</div>
      </div>
      <div className="today-details">
        <DetailLine icon={<DropIcon />} text={precip} />
        <DetailLine icon={<WindIcon />} text={wind} />
        <DetailLine text={`T. Percepita ${Math.round(current.apparent)}°`} />
        <DetailLine icon={<DropIcon />} text={`Umidità ${Math.round(current.humidity)}%`} />
      </div>
    </button>
  );
}

function DayRow({ day, onClick }) {
  const { dow, dnum } = formatDay(day.date);
  const cat = weatherCategory(day.weatherCode);
  const precip =
    day.precipitation > 0
      ? `${day.precipitation.toFixed(1)} mm${
          day.precipitationProb != null ? ` [${day.precipitationProb}%]` : ''
        }`
      : 'Assenti';
  const wind = `${Math.round(day.windSpeed)} Km/h ${windCardinal(day.windDirection) || 'vari'}`;

  return (
    <button type="button" className="row" onClick={onClick}>
      <div className="day-label">
        <div className="day-dow">{dow}</div>
        <div className="day-num">{dnum}</div>
      </div>
      <div className="day-icon">
        <WeatherIcon category={cat} size={72} />
      </div>
      <div className="day-temps">
        <div className="temp-line">
          <ThermoIcon type="hot" />
          <span>{Math.round(day.tmax)}°</span>
        </div>
        <div className="temp-line">
          <ThermoIcon type="cold" />
          <span>{Math.round(day.tmin)}°</span>
        </div>
      </div>
      <div className="day-details">
        <DetailLine icon={<DropIcon />} text={precip} />
        <DetailLine icon={<WindIcon />} text={wind} />
      </div>
    </button>
  );
}

function DetailLine({ icon, text }) {
  return (
    <div className="detail-line">
      <span className="detail-text">{text}</span>
      {icon && <span className="detail-icon">{icon}</span>}
    </div>
  );
}

function Footer({ variant = 'dark' }) {
  return (
    <div className={`footer footer-${variant}`}>
      Dati:{' '}
      <a href="https://open-meteo.com" target="_blank" rel="noreferrer">
        Open-Meteo
      </a>{' '}
      · <span className="vittoart">A VittoArt Production</span>
    </div>
  );
}
