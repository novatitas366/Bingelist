# Vertinimas: HTTP Parametrai

**Reikalavimas:** API naudoja bent 3 antraštės, užklausos arba kelio HTTP parametrus  
**Statusas: ✅ 5 skirtingi parametrų naudojimai trijuose tipuose**

---

## 1. Authorization Antraštė (užklausos antraštė)

**Naudojama:** visuose autentifikuotuose endpoint'uose (8–14 endpoint'ų sąraše)  
**Formatas:** `Authorization: Bearer eyJhbGciOi...`

**Kaip siunčiama** — `api.js:request()`:
```js
if (auth) {
  headers['Authorization'] = `Bearer ${getToken()}`;
}
```

**Kaip gaunama** — `src/auth.js:requireAuth`:
```js
const header = req.headers.authorization || '';
const match  = header.match(/^Bearer (.+)$/);
```

Reikšmė yra JWT žetonas pasirašytas `JWT_SECRET`. Backend'as ištraukia vartotojo ID iš jo ir nustato `req.userId`.

---

## 2. Užklausos parametras — `?q=`

**Naudojamas:** `GET /api/shows/search?q=:query`  
**Formatas:** pridedamas prie URL po `?`

**Kaip siunčiamas** — `search.js:runSearch()`:
```js
const shows = await request(`/shows/search?q=${encodeURIComponent(q)}`);
```

**Kaip gaunamas** — `src/routes/shows.js`:
```js
const q = requireString(req.query.q, 'q', { min: 1, max: 200 });
```

`req.query` yra objektas kurį Express sukuria iš URL užklausos eilutės. `req.query.q` yra reikšmė po `?q=`.

---

## 3. Kelio parametras — `:id` (watchlist įrašo ID)

**Naudojamas:** `PATCH /api/watchlist/:id` ir `DELETE /api/watchlist/:id`  
**Formatas:** įterptas URL kelyje

**URL pavyzdys:** `/api/watchlist/5` — `5` yra kelio parametras

**Kaip siunčiamas** — `watchlist.js`:
```js
await request(`/watchlist/${item.id}`, { method: 'PATCH', auth: true, body: {...} });
```

**Kaip gaunamas** — `src/routes/watchlist.js`:
```js
const id = requireInt(req.params.id, 'id');
```

`req.params` yra objektas kurį Express sukuria iš pavadintų `:id` segmentų maršruto šablone.

---

## 4. Kelio parametras — `:show_id`

**Naudojamas:** `GET /api/episodes/:show_id`

**URL pavyzdys:** `/api/episodes/169` — gauna pažiūrėtus epizodus TVMaze serialui 169

**Kaip siunčiamas** — `episodes.js`:
```js
request(`/episodes/${item.show_id}`, { auth: true })
```

**Kaip gaunamas** — `src/routes/episodes.js`:
```js
const show_id = requireInt(req.params.show_id, 'show_id');
```

---

## 5. Kelio parametras — `:episode_id`

**Naudojamas:** `DELETE /api/episodes/:episode_id`

**URL pavyzdys:** `/api/episodes/302` — atpažymi epizodą 302

**Kaip siunčiamas** — `episodes.js`:
```js
await request(`/episodes/${ep.id}`, { method: 'DELETE', auth: true });
```

**Kaip gaunamas** — `src/routes/episodes.js`:
```js
const episode_id = requireInt(req.params.episode_id, 'episode_id');
```

---

## Suvestinė lentelė

| # | Tipas | Pavadinimas | Kryptis | Kur siunčiamas | Kur skaitomas |
|---|---|---|---|---|---|
| 1 | Antraštė | `Authorization` | Užklausa | `api.js` | `src/auth.js` |
| 2 | Užklausos | `q` | Užklausa | `search.js` | `routes/shows.js` |
| 3 | Kelio | `:id` | Užklausos URL | `watchlist.js` | `routes/watchlist.js` |
| 4 | Kelio | `:show_id` | Užklausos URL | `episodes.js` | `routes/episodes.js` |
| 5 | Kelio | `:episode_id` | Užklausos URL | `episodes.js` | `routes/episodes.js` |

---

## Dokumentai

[[14-api-js]] · [[05-auth]] · [[08-routes-shows]] · [[09-routes-watchlist]] · [[10-routes-episodes]]
