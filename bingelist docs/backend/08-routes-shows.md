# src/routes/shows.js — Show search and detail endpoints

**Source file:** `src/routes/shows.js`  
**Depends on:** [[06-tvmaze]], [[04-validate]]  
**Mounted at:** `/api/shows/*`  
**Auth required:** No

---

## What this file does

Proxies all TV show data from the TVMaze API. No database access, no authentication needed. Acts as a clean intermediary so the browser doesn't talk to TVMaze directly.

---

## Endpoints

### `GET /api/shows/search?q=:query`
**Parameter type: query string** (`?q=value` in the URL)  
Returns an array of matching shows.

```
GET /api/shows/search?q=Breaking+Bad
```

```json
[
  { "id": 169, "name": "Breaking Bad", "image": "...", "summary": "...", ... }
]
```

---

### `GET /api/shows/:id`
**Parameter type: path parameter** (`:id` embedded in the URL)  
Returns full details for one show including network and status.

```
GET /api/shows/169
```

---

### `GET /api/shows/:id/cast`
Returns the top 5 cast members.

```json
[
  { "name": "Bryan Cranston", "character": "Walter White", "image": "..." }
]
```

---

### `GET /api/shows/:id/seasons`
Returns season metadata (count, premiere dates).

---

### `GET /api/shows/:id/episodes`
Returns all episodes for the show (used by the episodes view).

---

## HTTP concepts illustrated

- **GET** — read-only, no body, safe to repeat
- **Query parameter** — `?q=` is used for search/filter values
- **Path parameter** — `:id` is used for identifying a specific resource
- **Route order matters** — `/search` must be declared before `/:id` so Express doesn't interpret "search" as an ID. Similarly, `/:id/cast` before `/:id`.

---

## Why proxy instead of calling TVMaze from the browser?

1. We control the response shape (clean, consistent objects)
2. We can add caching here later without changing the frontend
3. The browser stays same-origin (no CORS headers needed)

---

## Related docs

[[06-tvmaze]] · [[02-server]] · [[19-search-js]] · [[18-modal-js]] · [[21-episodes-js]] · [[01-index]]
