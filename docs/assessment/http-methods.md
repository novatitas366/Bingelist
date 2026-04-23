# Assessment: HTTP Methods

**Requirement:** API uses at least 2 HTTP methods from: POST, PUT, PATCH, DELETE  
**Status: ✅ 3 action methods used — POST, PATCH, DELETE**

---

## Methods used

### GET — Read data (no body, no side effects)
Used for all read-only endpoints. Does not modify any data.

| Endpoint | What it reads |
|---|---|
| `GET /api/shows/search?q=` | TVMaze search results |
| `GET /api/shows/:id` | Single show details |
| `GET /api/watchlist` | User's watchlist |
| `GET /api/episodes/:show_id` | Watched episode IDs |

---

### POST — Create a new resource
Sends data in the **request body**. Returns the created resource with HTTP 201.

| Endpoint | What it creates |
|---|---|
| `POST /api/auth/register` | New user account |
| `POST /api/auth/login` | (Returns a JWT — not a resource but uses POST) |
| `POST /api/watchlist` | New watchlist entry |
| `POST /api/episodes` | New watched-episode record |

**Frontend example** (search.js):
```js
await request('/watchlist', {
  method: 'POST',
  auth: true,
  body: { show_id: 169, show_name: "Breaking Bad", status: "plan_to_watch" }
});
```

---

### PATCH — Partial update
Updates **only the fields provided** in the body. Different from PUT (which replaces the whole resource).

| Endpoint | What it updates |
|---|---|
| `PATCH /api/watchlist/:id` | status, note, or both |

**Frontend examples** (watchlist.js):
```js
// Change status
await request(`/watchlist/${item.id}`, { method: 'PATCH', auth: true, body: { status: 'watched' } });

// Save note
await request(`/watchlist/${item.id}`, { method: 'PATCH', auth: true, body: { note: 'Great show!' } });
```

Also used by episodes.js for auto-complete:
```js
await request(`/watchlist/${currentShow.id}`, { method: 'PATCH', auth: true, body: { status: 'watched' } });
```

---

### DELETE — Remove a resource
No request body. Returns HTTP 204 (No Content) on success.

| Endpoint | What it removes |
|---|---|
| `DELETE /api/watchlist/:id` | A watchlist entry |
| `DELETE /api/episodes/:episode_id` | A watched-episode record |

**Frontend example** (watchlist.js):
```js
await request(`/watchlist/${item.id}`, { method: 'DELETE', auth: true });
```

---

## Where the `method` is set

All HTTP calls go through `api.js:request()`. The `method` option is passed explicitly:
- `request('/watchlist', { method: 'POST', auth: true, body: {...} })`
- `request('/watchlist/5', { method: 'PATCH', auth: true, body: {...} })`
- `request('/watchlist/5', { method: 'DELETE', auth: true })`

---

## Docs

[[api-js]] · [[routes-watchlist]] · [[routes-episodes]] · [[routes-auth]]
