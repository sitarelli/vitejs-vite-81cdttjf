// Open-Meteo: API gratuita, nessuna API key necessaria.
// Docs: https://open-meteo.com/en/docs

const GEOCODE_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';

/**
 * Cerca una città e ritorna la prima corrispondenza (lat, lon, nome, paese).
 */
export async function geocodeCity(query) {
  const url = `${GEOCODE_URL}?name=${encodeURIComponent(query)}&count=1&language=it&format=json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Errore geocoding');
  const data = await res.json();
  if (!data.results || data.results.length === 0) {
    throw new Error(`Città "${query}" non trovata`);
  }
  const r = data.results[0];
  return {
    name: r.name,
    admin: r.admin1 || '',
    country: r.country || '',
    countryCode: r.country_code || '',
    latitude: r.latitude,
    longitude: r.longitude,
    timezone: r.timezone,
  };
}

/**
 * Scarica previsioni correnti + giornaliere + ORARIE per una coppia lat/lon.
 */
export async function fetchForecast(lat, lon, timezone = 'auto') {
  const params = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    current:
      'temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m,wind_direction_10m',
    daily:
      'weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,wind_direction_10m_dominant,sunrise,sunset',
    hourly:
      'temperature_2m,apparent_temperature,weather_code,precipitation,precipitation_probability,wind_speed_10m,wind_direction_10m',
    timezone,
    forecast_days: '5',
    wind_speed_unit: 'kmh',
  });
  const res = await fetch(`${FORECAST_URL}?${params.toString()}`);
  if (!res.ok) throw new Error('Errore previsioni');
  const data = await res.json();

  const current = {
    temperature: data.current.temperature_2m,
    apparent: data.current.apparent_temperature,
    humidity: data.current.relative_humidity_2m,
    weatherCode: data.current.weather_code,
    windSpeed: data.current.wind_speed_10m,
    windDirection: data.current.wind_direction_10m,
  };

  const days = data.daily.time.map((date, i) => ({
    date,
    weatherCode: data.daily.weather_code[i],
    tmax: data.daily.temperature_2m_max[i],
    tmin: data.daily.temperature_2m_min[i],
    precipitation: data.daily.precipitation_sum[i],
    precipitationProb: data.daily.precipitation_probability_max[i],
    windSpeed: data.daily.wind_speed_10m_max[i],
    windDirection: data.daily.wind_direction_10m_dominant[i],
    sunrise: data.daily.sunrise[i],
    sunset: data.daily.sunset[i],
  }));

  const hours = data.hourly.time.map((t, i) => ({
    time: t,
    temperature: data.hourly.temperature_2m[i],
    apparent: data.hourly.apparent_temperature[i],
    weatherCode: data.hourly.weather_code[i],
    precipitation: data.hourly.precipitation[i],
    precipitationProb: data.hourly.precipitation_probability[i],
    windSpeed: data.hourly.wind_speed_10m[i],
    windDirection: data.hourly.wind_direction_10m[i],
  }));

  return { current, days, hours };
}

/** Codice WMO -> categoria semplice per selezionare l'icona */
export function weatherCategory(code) {
  if (code === 0) return 'sun';
  if (code === 1 || code === 2) return 'sun-cloud';
  if (code === 3) return 'cloud';
  if (code === 45 || code === 48) return 'fog';
  if ((code >= 51 && code <= 57) || (code >= 61 && code <= 67) || (code >= 80 && code <= 82))
    return 'rain';
  if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) return 'snow';
  if (code >= 95 && code <= 99) return 'storm';
  return 'cloud';
}

/** Descrizione testuale in italiano del codice WMO (per vista dettaglio) */
export function weatherDescription(code) {
  const m = {
    0: 'sereno',
    1: 'prev. sereno',
    2: 'nubi sparse',
    3: 'nuvoloso',
    45: 'nebbia',
    48: 'nebbia ghiacciata',
    51: 'pioviggine leggera',
    53: 'pioviggine',
    55: 'pioviggine intensa',
    56: 'pioviggine gelata',
    57: 'pioviggine gelata forte',
    61: 'pioggia debole',
    63: 'pioggia moderata',
    65: 'pioggia forte',
    66: 'pioggia gelata',
    67: 'pioggia gelata forte',
    71: 'neve debole',
    73: 'neve moderata',
    75: 'neve forte',
    77: 'granuli di neve',
    80: 'rovesci deboli',
    81: 'rovesci moderati',
    82: 'rovesci forti',
    85: 'rovesci di neve',
    86: 'rovesci di neve forti',
    95: 'possibili temporali',
    96: 'temporali con grandine',
    99: 'temporali forti',
  };
  return m[code] || '—';
}

/** Gradi vento -> sigla cardinale a 16 punti (es. "ESE") */
export function windCardinal(deg) {
  if (deg == null || Number.isNaN(deg)) return '';
  const dirs = [
    'N', 'NNE', 'NE', 'ENE',
    'E', 'ESE', 'SE', 'SSE',
    'S', 'SSO', 'SO', 'OSO',
    'O', 'ONO', 'NO', 'NNO',
  ];
  const idx = Math.round(deg / 22.5) % 16;
  return dirs[idx];
}
