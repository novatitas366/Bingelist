# Vertinimas: HTTP Metodai

**Reikalavimas:** API naudoja bent 2 HTTP metodus iš: POST, PUT, PATCH, DELETE  
**Statusas: ✅ Naudojami 3 veiksmų metodai — POST, PATCH, DELETE**

---

## Naudojami metodai

### GET — Duomenų skaitymas (be kūno, be šalutinių efektų)
Naudojamas visiems tik skaitymo endpoint'ams. Nekeičia jokių duomenų.

| Endpoint'as | Ką skaito |
|---|---|
| `GET /api/shows/search?q=` | TVMaze paieškos rezultatai |
| `GET /api/shows/:id` | Vieno serialo detalės |
| `GET /api/watchlist` | Vartotojo watchlist'as |
| `GET /api/episodes/:show_id` | Pažiūrėtų epizodų ID |

---

### POST — Naujo resurso kūrimas
Siunčia duomenis **užklausos kūne**. Grąžina sukurtą resursą su HTTP 201.

| Endpoint'as | Ką sukuria |
|---|---|
| `POST /api/auth/register` | Nauja vartotojo paskyra |
| `POST /api/auth/login` | (Grąžina JWT — ne resursas bet naudoja POST) |
| `POST /api/watchlist` | Naujas watchlist įrašas |
| `POST /api/episodes` | Naujas pažiūrėto epizodo įrašas |

**Frontend pavyzdys** (search.js):
```js
await request('/watchlist', {
  method: 'POST',
  auth: true,
  body: { show_id: 169, show_name: "Breaking Bad", status: "plan_to_watch" }
});
```

---

### PATCH — Dalinis atnaujinimas
Atnaujina **tik laukus pateiktus** kūne. Skiriasi nuo PUT (kuris pakeičia visą resursą).

| Endpoint'as | Ką atnaujina |
|---|---|
| `PATCH /api/watchlist/:id` | statusas, pastaba, arba abu |

**Frontend pavyzdžiai** (watchlist.js):
```js
// Keisti statusą
await request(`/watchlist/${item.id}`, { method: 'PATCH', auth: true, body: { status: 'watched' } });

// Išsaugoti pastabą
await request(`/watchlist/${item.id}`, { method: 'PATCH', auth: true, body: { note: 'Puikus serialas!' } });
```

Taip pat naudojamas episodes.js automatiniam užbaigimui:
```js
await request(`/watchlist/${currentShow.id}`, { method: 'PATCH', auth: true, body: { status: 'watched' } });
```

---

### DELETE — Resurso šalinimas
Jokio užklausos kūno. Sėkmės atveju grąžina HTTP 204 (Nėra turinio).

| Endpoint'as | Ką šalina |
|---|---|
| `DELETE /api/watchlist/:id` | Watchlist įrašas |
| `DELETE /api/episodes/:episode_id` | Pažiūrėto epizodo įrašas |

**Frontend pavyzdys** (watchlist.js):
```js
await request(`/watchlist/${item.id}`, { method: 'DELETE', auth: true });
```

---

## Kur `method` nustatomas

Visi HTTP kvietimai eina per `api.js:request()`. `method` parametras perduodamas aiškiai:
- `request('/watchlist', { method: 'POST', auth: true, body: {...} })`
- `request('/watchlist/5', { method: 'PATCH', auth: true, body: {...} })`
- `request('/watchlist/5', { method: 'DELETE', auth: true })`

---

## Dokumentai

[[14-api-js]] · [[09-routes-watchlist]] · [[10-routes-episodes]] · [[07-routes-auth]]
