# public/js/modal.js — Show detail modal

**Source file:** `public/js/modal.js`  
**Depends on:** [[api-js]]  
**Used by:** [[search-js]], [[watchlist-js]]

---

## What this file does

Manages the show detail popup (modal dialog). When a show's poster or title is clicked, `openModal(show)` fills the modal with the show's data and makes it visible. Cast is fetched asynchronously after the modal opens.

---

## Key concepts

- **Modal pattern** — a fixed-position overlay that blocks interaction with the page behind it. The backdrop is a dark semi-transparent layer; the white box is the modal itself.
- **`body.style.overflow = 'hidden'`** — prevents the page from scrolling while the modal is open.
- **Non-blocking cast fetch** — `.then()` is used instead of `await` so the modal appears immediately. Cast data loads in a second or two later and is appended to the open modal.
- **Three close gestures** — standard accessible modal behaviour:
  1. ✕ button
  2. Click the dark backdrop
  3. Press Escape
- **`e.target === backdrop`** — only closes if the backdrop itself was clicked, not the modal content box (which sits on top of the backdrop).

---

## `openModal(show)` parameter

```js
{
  id,         // TVMaze show ID (used to fetch cast)
  name,       // show title
  image,      // poster URL or null
  summary,    // HTML string (stripped before display)
  premiered,  // "2008-01-20" → show only the year
  genres,     // array of strings
  network,    // "AMC" or null
  status      // "Running" / "Ended" or null
}
```

The `search.js` cards have all these fields already (from the search result). The `watchlist.js` cards fetch them on demand with `GET /api/shows/:id` because the watchlist only stores `show_id` and `show_name`.

---

## API calls made

| Call | Method | Endpoint | Auth |
|---|---|---|---|
| Fetch cast | GET | `/api/shows/:id/cast` | No |

---

## Exported functions

| Function | Use |
|---|---|
| `openModal(show)` | Called from search.js and watchlist.js |
| `closeModal()` | Called by the three close handlers |

---

## Related docs

[[api-js]] · [[search-js]] · [[watchlist-js]] · [[routes-shows]] · [[index]]
