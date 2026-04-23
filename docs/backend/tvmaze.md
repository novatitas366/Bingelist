# src/tvmaze.js — TVMaze API wrapper

**Source file:** `src/tvmaze.js`  
**Depends on:** built-in `fetch` (Node 18+)  
**Used by:** [[routes-shows]]

---

## What this file does

All show and episode data in Watchly comes from the free public [TVMaze API](https://www.tvmaze.com/api). This file wraps the raw TVMaze responses into clean, consistent objects that the rest of the app uses.

Nothing is stored in the database from here — it's a live proxy.

---

## Key concepts

- **External API** — the server acts as a client to TVMaze. The browser never calls TVMaze directly; it goes through `/api/shows/*` which calls TVMaze server-side.
- **fetch** — the built-in HTTP client (available in Node 18+). Returns a Promise.
- **502 Bad Gateway** — the HTTP status code for "my server got a bad response from an upstream service". Used here for any TVMaze error that isn't 404.
- **`formatShowBase`** — a private helper that extracts the 6 fields that appear in both search results and full show details. Avoids repeating the same code twice.
- **Optional chaining `?.`** — `s.image?.original` safely returns `undefined` instead of throwing if `s.image` is null.

---

## Exported functions

| Function | TVMaze endpoint | Used by route |
|---|---|---|
| `searchShows(query)` | `GET /search/shows?q=` | `GET /api/shows/search?q=` |
| `getShow(showId)` | `GET /shows/:id` | `GET /api/shows/:id` |
| `getEpisodes(showId)` | `GET /shows/:id/episodes` | `GET /api/shows/:id/episodes` |
| `getShowCast(showId)` | `GET /shows/:id/cast` | `GET /api/shows/:id/cast` |
| `getShowSeasons(showId)` | `GET /shows/:id/seasons` | `GET /api/shows/:id/seasons` |

---

## Show object shape (returned by searchShows and getShow)

```js
{
  id:        1234,
  name:      "Breaking Bad",
  image:     "https://...",  // null if no image
  summary:   "<p>...</p>",   // may contain HTML tags — strip before displaying
  premiered: "2008-01-20",
  genres:    ["Drama", "Crime"],
  // getShow also includes:
  network:   "AMC",
  status:    "Ended"
}
```

---

## Error handling

| TVMaze status | What this file throws |
|---|---|
| 404 | `err.status = 404` (passed through to the client) |
| Any other non-OK | `err.status = 502` (upstream error) |

---

## Related docs

[[routes-shows]] · [[server]] · [[index]]
