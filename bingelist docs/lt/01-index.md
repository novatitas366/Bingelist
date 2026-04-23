# Watchly — Kodo žemėlapis

Watchly yra TV serialų sekimo programa. Vartotojai ieško serialų, išsaugo juos su statusu ir seka kuriuos epizodus pažiūrėjo.

Atidaryti šį aplanką kaip **Obsidian vault** ir spausti `[[nuorodą]]` — pereisi tiesiai į to failo paaiškinimą.

---

## Architektūra vienu sakiniu

**Backend** (Node/Express) saugo duomenis SQLite ir proxiuoja serialų info iš TVMaze. **Frontend** (paprastas JS) kalbasi su backend REST API per `fetch`.

```
Naršyklė (public/)
  └── app.js           ← koordinatorius
       ├── api.js      ← visos HTTP užklausos eina čia
       ├── auth.js     ← prisijungimas / registracija / atsijungimas
       ├── search.js   ← paieškos rodinys
       ├── watchlist.js← watchlist rodinys
       ├── episodes.js ← epizodų rodinys
       ├── modal.js    ← serialo detalių popup
       ├── toast.js    ← pranešimai
       └── utils.js    ← stripHtml, STATUS_LABELS (bendri)

Serveris (src/)
  ├── server.js        ← įėjimo taškas, Express sąranka
  ├── db.js            ← SQLite duomenų bazė + schema
  ├── auth.js          ← bcrypt + JWT pagalbinės funkcijos
  ├── validate.js      ← įvesties tikrinimas
  ├── tvmaze.js        ← TVMaze API apvalkalas
  └── routes/
       ├── auth.js     ← POST /api/auth/register+login
       ├── shows.js    ← GET  /api/shows/*
       ├── watchlist.js← CRUD /api/watchlist
       └── episodes.js ← CRUD /api/episodes
```

---

## Backend dokumentai

| Failas | Vaidmuo | Dokumentas |
|---|---|---|
| `server.js` | Įėjimo taškas, middleware, serverio paleidimas | [[02-server]] |
| `src/db.js` | Duomenų bazės atidarymas, lentelių kūrimas | [[03-db]] |
| `src/auth.js` | Slaptažodžių hešavimas + JWT middleware | [[05-auth]] |
| `src/validate.js` | Įvesties tikrinimo pagalbinės funkcijos | [[04-validate]] |
| `src/tvmaze.js` | TVMaze API apvalkalas | [[06-tvmaze]] |
| `src/routes/auth.js` | Registracijos + prisijungimo endpointai | [[07-routes-auth]] |
| `src/routes/shows.js` | Serialų paieškos + detalių endpointai | [[08-routes-shows]] |
| `src/routes/watchlist.js` | Watchlist CRUD endpointai | [[09-routes-watchlist]] |
| `src/routes/episodes.js` | Epizodų sekimo endpointai | [[10-routes-episodes]] |

## Frontend dokumentai

| Failas | Vaidmuo | Dokumentas |
|---|---|---|
| `public/index.html` | HTML struktūra + rodinių sekcijos | [[11-index-html]] |
| `public/css/styles.css` | Visi stiliai + responsive lūžio taškai | [[12-styles-css]] |
| `public/js/app.js` | Pagrindinis koordinatorius, rodinių perjungimas | [[13-app-js]] |
| `public/js/api.js` | HTTP klientas, localStorage žetonas | [[14-api-js]] |
| `public/js/auth.js` | Prisijungimo/registracijos/atsijungimo kvietimai | [[15-auth-js]] |
| `public/js/search.js` | Paieškos rodinio logika | [[19-search-js]] |
| `public/js/watchlist.js` | Watchlist rodinio logika | [[20-watchlist-js]] |
| `public/js/episodes.js` | Epizodų sekimo rodinys | [[21-episodes-js]] |
| `public/js/modal.js` | Serialo detalių modalas | [[18-modal-js]] |
| `public/js/toast.js` | Pranešimų pagalbinė funkcija | [[16-toast-js]] |
| `public/js/utils.js` | Bendros pagalbinės funkcijos | [[17-utils-js]] |

## Vertinimo dokumentai

| Reikalavimas | Statusas | Dokumentas |
|---|---|---|
| ≥5 API endpointai | ✅ 14 endpointų | [[22-endpoints]] |
| ≥2 HTTP veiksmų metodai | ✅ POST, PATCH, DELETE | [[23-http-methods]] |
| ≥3 antraštės/užklausos/kelio parametrai | ✅ 5 parametrų naudojimai | [[24-http-parameters]] |
| Saugumas (HTTPS + JWT + tikrinimas) | ✅ Visi trys | [[25-security]] |
| Responsive dizainas (3 prietaisų tipai) | ✅ Mobilusis/planšetė/stalinis | [[26-responsive-design]] |
| Karkaso principai | ✅ Express Router šablonas | [[27-framework-principles]] |
