# Meteo App

App meteo in React + Vite — vista principale stile "iOS classico" (blu skeuomorfico) con
vista di dettaglio orario su fondo bianco. Dati forniti da
**[Open-Meteo](https://open-meteo.com/)** — API gratuita, **nessuna API key richiesta**.

## Funzionalità

- **Vista principale**: previsioni a 5 giorni con temperatura max/min, precipitazioni,
  vento (km/h + direzione cardinale a 16 punti), umidità e temperatura percepita.
- **Vista dettaglio**: tocca un giorno per aprire la vista oraria scrollabile, con tab
  in alto per passare rapidamente da un giorno all'altro (OGGI / DOMANI / …). Ogni ora
  mostra icona meteo, descrizione testuale, temperatura, temperatura percepita,
  precipitazioni e vento con freccia direzionale. Marker automatici alba/tramonto
  inseriti tra le righe orarie. Icone notturne (luna) per le ore fuori dal giorno solare.
- **Preferiti**: tocca la ⭐ in alto per aggiungere la località corrente ai preferiti
  (si accende di giallo quando attiva). I preferiti sono salvati in `localStorage` e
  gestiti nel menu ☰: selezionali per caricarli istantaneamente o rimuovili con la ✕.
- **Ricerca città**: dal menu ☰ puoi cercare qualsiasi città nel mondo (es. Roma, Parigi,
  New York).
- **Persistenza**: l'ultima città visualizzata viene ricordata al riavvio.
- Responsive, ottimizzata per mobile.

## Come avviare in locale

```bash
npm install
npm run dev
```

Apri http://localhost:5173

## Deploy: StackBlitz → GitHub → Vercel

### 1) StackBlitz
- Vai su https://stackblitz.com/
- "Create New" → "Vite" → "React"
- Sostituisci i file con questi, oppure "Import" lo zip.
- Dev server parte automaticamente.

### 2) GitHub
- In StackBlitz, pulsante "Connect Repository" (icona GitHub).
- Create new repo, dai un nome, conferma. Push automatico.

### 3) Vercel
- Vai su https://vercel.com/, login con GitHub.
- "Add New… / Project" → seleziona il repo.
- Framework Preset: **Vite** (auto-detect). Deploy.
- Il file `vercel.json` incluso gestisce il routing SPA.

## Dove cambiare la città iniziale

In `src/App.jsx`, modifica l'oggetto `DEFAULT_CITY`. Default: Milano. Comunque, dopo la
prima ricerca, l'app ricorda l'ultima città in `localStorage` e la ripropone al riavvio.

## Struttura del progetto

```
src/
├── App.jsx                       # Stato globale, routing viste, drawer preferiti
├── App.css                       # Stile "iOS blue" + vista dettaglio bianca
├── main.jsx                      # Entry point React
├── services/
│   └── weather.js                # Chiamate Open-Meteo: geocoding, forecast
│                                 # (current + daily + hourly), descrizioni WMO,
│                                 # cardinal a 16 punti
└── components/
    ├── WeatherIcon.jsx           # SVG: sole, sole+nuvola, nuvola, pioggia, neve,
    │                             # nebbia, temporale + varianti notturne (luna)
    ├── DetailIcons.jsx           # SVG: termometro, goccia, vento, freccia vento,
    │                             # nuvolina pioggia, alba, tramonto
    └── DayDetail.jsx             # Vista dettaglio oraria + tab giorni
```

## Note sull'API

- Geocoding: `https://geocoding-api.open-meteo.com/v1/search`
- Forecast: `https://api.open-meteo.com/v1/forecast`
  - current, daily (incl. sunrise/sunset), hourly per 5 giorni
- I codici meteo WMO vengono tradotti in categorie icona (`weatherCategory`) e in
  descrizioni italiane (`weatherDescription`).
- Nessun rate limit stretto per uso non commerciale.

## Storage locale

- `meteo-app.favorites` — array di città preferite.
- `meteo-app.last-city` — ultima città visualizzata.

Entrambi sono rimovibili da devtools → Application → Local Storage se vuoi resettare.

---

*A VittoArt Production*
