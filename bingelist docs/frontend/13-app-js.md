# public/js/app.js — Main coordinator

**Source file:** `public/js/app.js`  
**Depends on:** [[14-api-js]], [[15-auth-js]], [[19-search-js]], [[20-watchlist-js]], [[21-episodes-js]], [[16-toast-js]]  
**Used by:** [[11-index-html]] (loaded directly by the `<script>` tag)

---

## What this file does

The single entry point loaded by the browser. It:
1. Wires all modules together
2. Owns view switching (showing/hiding the 4 sections)
3. Handles the auth form (login/register/logout)
4. Restores the session on page reload

Everything in this file is **event-driven** — functions run in response to user actions (clicks, form submissions).

---

## Key concepts

- **Event-driven programming** — JavaScript in the browser doesn't run top-to-bottom after page load. It attaches event listeners and waits. When a user does something (clicks a button, submits a form), the registered callback runs.
- **`async/await`** — used for API calls that take time. `await` pauses the function until the request finishes, then continues. The rest of the page stays interactive while waiting.
- **`e.preventDefault()`** — stops the browser's default behaviour (e.g. a form submit would reload the page; we stop that to handle it with JS instead).
- **Module imports** — each `import { ... } from './file.js'` connects to another module. `app.js` imports functions but doesn't duplicate their logic.
- **Session re-hydration** — on every page load, `getToken()` checks localStorage. If a token exists, the app skips the login screen.

---

## Functions

### `showView(name)`
- Hides all 4 sections, shows only the named one
- Highlights the matching tab button
- Called on tab click, after login, after logout

### `setAuthed(authed)`
- `true` → enable tabs, show auth area, switch to search view
- `false` → disable tabs, hide auth area, switch to auth view

### Auth form handling
- Toggle buttons switch between `'login'` and `'register'` modes
- Form submit calls `login()` or `register()` from `auth.js`
- Errors displayed inline below the form
- On success: calls `setAuthed(true)` and `refreshWatchlist()`

---

## Event listener map

| Event | Element | Action |
|---|---|---|
| `click` | Login/Sign up toggle | Switch `authMode`, update button text |
| `submit` | `#authForm` | Call `login()` or `register()` |
| `click` | `#logoutBtn` | Call `logout()`, `clearEpisodes()`, `setAuthed(false)` |
| `click` | `.tab` | Switch view, refresh watchlist if watchlist tab |
| `click` | `#backToWatchlist` | Switch to watchlist view |

---

## Startup flow

```
Page loads
  → check localStorage for JWT token
  → token found?
      YES → setAuthed(true) → show search view → refreshWatchlist()
      NO  → setAuthed(false) → show auth form
```

---

## Related docs

[[14-api-js]] · [[15-auth-js]] · [[19-search-js]] · [[20-watchlist-js]] · [[21-episodes-js]] · [[11-index-html]] · [[01-index]]
