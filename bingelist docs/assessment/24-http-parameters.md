# Assessment: HTTP Parameters

**Requirement:** API uses at least 3 header, query, or path HTTP parameters  
**Status: ✅ 5 distinct parameter uses across the 3 types**

---

## 1. Authorization Header (request header)

**Used by:** all authenticated endpoints (8–14 in the endpoint list)  
**Format:** `Authorization: Bearer eyJhbGciOi...`

**How it's sent** — `api.js:request()`:
```js
if (auth) {
  headers['Authorization'] = `Bearer ${getToken()}`;
}
```

**How it's received** — `src/auth.js:requireAuth`:
```js
const header = req.headers.authorization || '';
const match  = header.match(/^Bearer (.+)$/);
```

The value is the JWT token signed with `JWT_SECRET`. The backend extracts the user ID from it and sets `req.userId`.

---

## 2. Query Parameter — `?q=`

**Used by:** `GET /api/shows/search?q=:query`  
**Format:** appended to the URL after `?`

**How it's sent** — `search.js:runSearch()`:
```js
const shows = await request(`/shows/search?q=${encodeURIComponent(q)}`);
```

**How it's received** — `src/routes/shows.js`:
```js
const q = requireString(req.query.q, 'q', { min: 1, max: 200 });
```

`req.query` is an object Express builds from the URL's query string. `req.query.q` is the value after `?q=`.

---

## 3. Path Parameter — `:id` (watchlist entry ID)

**Used by:** `PATCH /api/watchlist/:id` and `DELETE /api/watchlist/:id`  
**Format:** embedded in the URL path

**Example URL:** `/api/watchlist/5` — the `5` is the path parameter

**How it's sent** — `watchlist.js`:
```js
await request(`/watchlist/${item.id}`, { method: 'PATCH', auth: true, body: {...} });
```

**How it's received** — `src/routes/watchlist.js`:
```js
const id = requireInt(req.params.id, 'id');
```

`req.params` is an object Express builds from the named `:id` segments in the route pattern.

---

## 4. Path Parameter — `:show_id`

**Used by:** `GET /api/episodes/:show_id`

**Example URL:** `/api/episodes/169` — fetches watched episodes for TVMaze show 169

**How it's sent** — `episodes.js`:
```js
request(`/episodes/${item.show_id}`, { auth: true })
```

**How it's received** — `src/routes/episodes.js`:
```js
const show_id = requireInt(req.params.show_id, 'show_id');
```

---

## 5. Path Parameter — `:episode_id`

**Used by:** `DELETE /api/episodes/:episode_id`

**Example URL:** `/api/episodes/302` — unmarks episode 302

**How it's sent** — `episodes.js`:
```js
await request(`/episodes/${ep.id}`, { method: 'DELETE', auth: true });
```

**How it's received** — `src/routes/episodes.js`:
```js
const episode_id = requireInt(req.params.episode_id, 'episode_id');
```

---

## Summary table

| # | Type | Name | Direction | Where sent | Where read |
|---|---|---|---|---|---|
| 1 | Header | `Authorization` | Request | `api.js` | `src/auth.js` |
| 2 | Query | `q` | Request | `search.js` | `routes/shows.js` |
| 3 | Path | `:id` | Request URL | `watchlist.js` | `routes/watchlist.js` |
| 4 | Path | `:show_id` | Request URL | `episodes.js` | `routes/episodes.js` |
| 5 | Path | `:episode_id` | Request URL | `episodes.js` | `routes/episodes.js` |

---

## Docs

[[14-api-js]] · [[05-auth]] · [[08-routes-shows]] · [[09-routes-watchlist]] · [[10-routes-episodes]]
