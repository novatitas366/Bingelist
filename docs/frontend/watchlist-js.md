# public/js/watchlist.js — Watchlist view

**Source file:** `public/js/watchlist.js`  
**Depends on:** [[api-js]], [[toast-js]], [[modal-js]]  
**Used by:** [[app-js]] (`initWatchlist()`, `refreshWatchlist()`)

---

## What this file does

Renders and manages the watchlist view. Fetches the user's saved shows, displays them as cards, and handles inline editing of status and notes, plus removal.

---

## State

```js
let items         = [];      // full list fetched from server
let currentFilter = 'all';   // active status filter
let onViewEpisodes = null;   // callback to switch to episodes view
```

The `items` array is the source of truth. After every change (status update, delete) it's updated in-memory and `render()` is called to rebuild the grid — no extra network request needed.

---

## Key concepts

- **In-memory filtering** — filter chips don't re-fetch from the server. They filter the `items` array locally and re-render. Fast and avoids unnecessary API calls.
- **Debounced save** — the note textarea uses a 500ms timeout. Typing quickly doesn't send a PATCH on every keystroke — only after the user pauses for 500ms.
- **Optimistic local update** — after a status PATCH succeeds, `item.status` is updated locally before calling `render()`. This avoids a round-trip `refreshWatchlist()` call.
- **`e.target.closest('.chip')`** — the filter bar uses a single click listener on the whole bar. `closest()` finds the clicked chip even if a child element was clicked.

---

## Exported functions

### `refreshWatchlist()`
- `GET /api/watchlist` with Authorization header
- Replaces `items` array with fresh server data
- Calls `render()` to update the UI

### `initWatchlist({ onViewEpisodes })`
- Stores the episode-view callback
- Attaches the filter chip click listener
- Called once from `app.js`

---

## API calls made

| Action | Method | Endpoint | Auth |
|---|---|---|---|
| Load list | GET | `/api/watchlist` | Yes |
| Change status | PATCH | `/api/watchlist/:id` | Yes |
| Save note | PATCH | `/api/watchlist/:id` | Yes |
| Remove | DELETE | `/api/watchlist/:id` | Yes |
| View show details | GET | `/api/shows/:id` | No |

---

## Event listener map

| Event | Element | Action |
|---|---|---|
| `click` on poster/title | card | Fetch show + open modal |
| `change` | status `<select>` | PATCH status |
| `input` | note `<textarea>` | Debounced PATCH note (500ms) |
| `click` | Episodes button | Call `onViewEpisodes(item)` callback |
| `click` | Remove button | Confirm → DELETE → re-render |
| `click` | filter chip | Update `currentFilter` → re-render |

---

## Related docs

[[api-js]] · [[episodes-js]] · [[modal-js]] · [[routes-watchlist]] · [[index]]
