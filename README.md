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

## PWA / icone / favicon

L'app è installabile come PWA ("Aggiungi a Home"). Tutti gli asset sono nella cartella
`public/` e vengono copiati automaticamente in `dist/` dal build di Vite:

- `icon.svg` — icona master SVG (favicon su browser moderni)
- `favicon.ico`, `favicon-16.png`, `favicon-32.png`, `favicon-48.png`, `favicon-64.png`
  — favicon classici per bookmarks / tab dei browser
- `apple-touch-icon.png` (180×180) — icona sulla Home di iPhone/iPad
- `icon-192.png`, `icon-512.png` — icone PWA standard (Android)
- `icon-maskable-512.png` — icona "maskable" per adaptive icons Android
- `manifest.webmanifest` — definisce nome app (`MeteoVit`), tema colori,
  `display: standalone` per aprire l'app senza barra del browser

### Come si comporta

- **Desktop (bookmark/tab)**: mostra l'icona blu con sole+nuvola
- **Android**: "Aggiungi a schermata Home" dal menu Chrome → icona colorata e app fullscreen
- **iPhone/iPad**: Safari → Condividi → "Aggiungi a Home" → icona colorata e app fullscreen

### Sostituire l'icona

Modifica `public/icon.svg` (512×512 viewBox) e rigenera i PNG. Dalla root del progetto:

```bash
pip install cairosvg
cd public
python3 -c "
import cairosvg
with open('icon.svg','rb') as f: svg = f.read()
for s in [16,32,48,64]:
    cairosvg.svg2png(bytestring=svg, output_width=s, output_height=s, write_to=f'favicon-{s}.png')
for s in [180]:
    cairosvg.svg2png(bytestring=svg, output_width=s, output_height=s, write_to='apple-touch-icon.png')
for s in [192,512]:
    cairosvg.svg2png(bytestring=svg, output_width=s, output_height=s, write_to=f'icon-{s}.png')
"
# Per favicon.ico:
python3 -c "
from PIL import Image
Image.open('favicon-64.png').save('favicon.ico', format='ICO', sizes=[(16,16),(32,32),(48,48),(64,64)])
"
```



## Storage locale

- `meteo-app.favorites` — array di città preferite.
- `meteo-app.last-city` — ultima città visualizzata.

Entrambi sono rimovibili da devtools → Application → Local Storage se vuoi resettare.

---

*A VittoArt Production*
