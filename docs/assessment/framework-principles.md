# Assessment: Framework Principles

**Requirement:** Follow the conventions of the chosen technology  
**Status: ✅ Follows Express and ES module conventions throughout**

---

## Backend — Express.js principles

### 1. Router per domain

Express recommends grouping related routes into `Router` instances. Each route file exports one Router:

```js
// src/routes/watchlist.js
const router = Router();
// all watchlist routes here
export default router;

// server.js
app.use('/api/watchlist', watchlistRoutes);
```

**Result:** all watchlist-related endpoints are in one file; all episode endpoints in another; etc.

### 2. Middleware chain

Express's core pattern is a pipeline of middleware functions:

```
Request
  → express.json()          (parse body)
  → requireAuth()           (check JWT — only on protected routers)
  → route handler           (business logic)
  → global error handler    (catch any thrown errors)
  → Response
```

`requireAuth` is registered with `router.use(requireAuth)` at the top of the watchlist and episodes route files — it runs before every handler in those files automatically.

### 3. Error propagation with `next(e)`

Express routes call `next(err)` to forward errors to the global error handler instead of handling them inline:

```js
} catch (e) {
  next(e); // → reaches app.use((err, req, res, _next) => ...) in server.js
}
```

### 4. Synchronous SQLite with better-sqlite3

`better-sqlite3` is the idiomatic choice for SQLite in Express apps because its synchronous API matches Express's request/response pattern without forcing async/await on simple DB calls.

---

## Frontend — ES Module principles

### 1. One module per concern

Each JS file has a single responsibility:

| File | Responsibility |
|---|---|
| `api.js` | HTTP + localStorage only |
| `auth.js` | Auth API calls only |
| `search.js` | Search view only |
| `watchlist.js` | Watchlist view only |
| `episodes.js` | Episodes view only |
| `modal.js` | Modal dialog only |
| `toast.js` | Notifications only |
| `app.js` | Wires everything together |

### 2. Named exports + explicit imports

Functions are exported by name and imported explicitly:

```js
// watchlist.js
export async function refreshWatchlist() { ... }
export function initWatchlist({ onViewEpisodes }) { ... }

// app.js
import { initWatchlist, refreshWatchlist } from './watchlist.js';
```

This makes dependencies visible and avoids global variables.

### 3. Event-driven architecture

All user interactions are handled through event listeners. No polling, no global state mutations outside event handlers:

```js
addBtn.addEventListener('click', async () => {
  // everything that happens when Add is clicked
});
```

### 4. DOM manipulation without a framework

Follows the native DOM API pattern:
- `document.createElement` to create elements
- `.appendChild` / `.insertAdjacentHTML` to attach them
- `.classList.toggle` for CSS state
- Never `innerHTML` with user data (prevents XSS)

---

## Code organisation

```
Bingelist/
  server.js          ← entry point
  src/
    db.js            ← data layer
    auth.js          ← auth utilities
    validate.js      ← shared validators
    tvmaze.js        ← external API wrapper
    routes/          ← one file per API domain
  public/
    index.html       ← single HTML page
    css/styles.css   ← all styles
    js/              ← one file per UI concern
```

---

## Docs

[[server]] · [[routes-auth]] · [[routes-watchlist]] · [[app-js]] · [[api-js]] · [[index]]
