# public/js/search.js — Search view

**Source file:** `public/js/search.js`  
**Depends on:** [[14-api-js]], [[16-toast-js]], [[18-modal-js]]  
**Used by:** [[13-app-js]] (`initSearch()`)

---

## What this file does

Handles the Search view: listens for form submissions, calls the search API, and renders show cards. Each card has an "Add" button that sends a POST to the watchlist.

---

## Key concepts

- **DOM construction** — all HTML elements are created with `document.createElement` and assembled programmatically. No template strings with user data, which prevents XSS injection.
- **Event delegation vs direct listeners** — each card gets its own `click` listener on creation. `addBtn.disabled = true` prevents duplicate submissions.
- **`e.preventDefault()`** — stops the browser's native form submit (which would reload the page).
- **`encodeURIComponent(q)`** — URL-encodes the search term so special characters in show names (e.g. `&`, `+`) don't break the query string.
- **409 Conflict handling** — when the user tries to add a show that's already in their list, the server returns 409. The frontend shows "In list" instead of re-enabling the Add button.

---

## Flow

```
User types "Breaking Bad" and hits Search
  → form submit event fires
  → e.preventDefault() stops page reload
  → runSearch("Breaking Bad") is called
    → GET /api/shows/search?q=Breaking%20Bad
    → for each show: card(show) builds a DOM element
    → cards appended to #searchResults

User clicks Add on a card
  → POST /api/watchlist (with Authorization header + JSON body)
  → success: button text changes to "Added ✓"
  → 409 error: button text changes to "In list"
```

---

## API calls made

| Call | Method | Endpoint | Auth |
|---|---|---|---|
| Search shows | GET | `/api/shows/search?q=:query` | No |
| Add to watchlist | POST | `/api/watchlist` | Yes |

---

## `initSearch()` function

Called once from `app.js` during page initialisation. Attaches the `submit` event listener to `#searchForm`. Without calling this, the search form would do nothing.

---

## Related docs

[[14-api-js]] · [[18-modal-js]] · [[16-toast-js]] · [[08-routes-shows]] · [[09-routes-watchlist]] · [[01-index]]
