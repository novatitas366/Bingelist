# public/js/episodes.js — Episode tracking view

**Source file:** `public/js/episodes.js`  
**Depends on:** [[14-api-js]], [[16-toast-js]]  
**Used by:** [[13-app-js]] (`loadEpisodes()`, `clearEpisodes()`)

---

## What this file does

The most complex frontend module. When the user clicks "Episodes" on a watchlist card, this module:
1. Fetches all episodes + already-watched IDs + season count **in parallel**
2. Groups episodes by season and renders collapsible sections
3. Each episode has a checkbox — checking/unchecking sends POST/DELETE to the API
4. Auto-updates the watchlist status to "watched" when all episodes are checked

---

## Key concepts

- **`Promise.all([...])` — parallel requests** — instead of waiting for episodes, then watched IDs, then seasons (3 sequential round-trips), all three requests fire at the same time. Much faster.
- **`new Set(watchedIds)` — O(1) lookups** — a JavaScript `Set` checks membership in constant time. Used to instantly know whether each episode is checked without scanning an array.
- **Shared mutable `watched` Set** — the `Set` is passed to each season's `renderSeason()` call. When the user checks a box, the episode ID is added to the Set, and all helper functions (`updateSeasonHeader`, `updateOverall`) re-read it to get current counts.
- **Debounce/re-enable** — checkboxes are disabled during the API request to prevent double-clicking, then re-enabled in `finally {}`.
- **Revert on error** — if a POST or DELETE fails, `cb.checked` is flipped back to its previous value so the UI stays consistent.
- **Auto-complete** — `checkAutoComplete()` runs after every checkbox change. If all episodes are watched and status isn't already `'watched'`, it PATCHes the watchlist entry automatically.

---

## Exported functions

### `loadEpisodes(item)`
- `item` = a watchlist entry object from `watchlist.js`
- Fetches and renders everything for that show

### `clearEpisodes()`
- Resets the episodes view to its empty state
- Called on logout so stale data isn't visible after re-login

---

## API calls made

| Call | Method | Endpoint | Auth |
|---|---|---|---|
| Get all episodes | GET | `/api/shows/:id/episodes` | No |
| Get watched IDs | GET | `/api/episodes/:show_id` | Yes |
| Get seasons | GET | `/api/shows/:id/seasons` | No |
| Mark episode | POST | `/api/episodes` | Yes |
| Unmark episode | DELETE | `/api/episodes/:id` | Yes |
| Auto-complete | PATCH | `/api/watchlist/:id` | Yes |

---

## UI structure built by this file

```
#episodesBody
  ├── .episodes-hero          ← poster + title + overall progress bar
  └── .season × N             ← one per season, collapsible
       ├── .season-header     ← Season N | mini progress | count | Mark all
       └── .season-body
            └── .episode × N ← checkbox | thumbnail | title + airdate + desc
```

---

## Related docs

[[14-api-js]] · [[20-watchlist-js]] · [[10-routes-episodes]] · [[08-routes-shows]] · [[01-index]]
