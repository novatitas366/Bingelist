# server.js — Entry point

**Source file:** `server.js`  
**Depends on:** [[db]], [[auth]], [[validate]], [[routes-auth]], [[routes-shows]], [[routes-watchlist]], [[routes-episodes]]  
**Used by:** nothing (this is the top-level file Node runs)

---

## What this file does

This is the first file Node executes (`node server.js`). It:
1. Loads environment variables from `.env`
2. Imports `src/db.js` as a side-effect (creates the database)
3. Creates an Express app and registers all middleware and routes
4. Starts listening for HTTP or HTTPS connections

---

## Key concepts

- **Express app** — `const app = express()` creates the web server. Middleware and routes are stacked on it in order.
- **Middleware** — `app.use(...)` registers functions that run on every request before route handlers. Order matters.
- **Route mounting** — `app.use('/api/auth', authRoutes)` delegates all `/api/auth/*` requests to the `authRoutes` Router.
- **SPA catch-all** — `app.get(/^\/(?!api\/).*/, ...)` sends `index.html` for any non-API path so the browser-side routing works on refresh.
- **Global error handler** — a middleware with 4 parameters `(err, req, res, next)` catches errors thrown by any route handler.
- **HTTP vs HTTPS** — reads `SSL_KEY`/`SSL_CERT` from environment; uses `https.createServer` if both are set, falls back to `http.createServer`.

---

## Request lifecycle

```
Browser request
  → express.json() parses the body
  → route handler runs (e.g. watchlistRoutes)
    → requireAuth middleware checks JWT (if protected route)
    → business logic runs
    → res.json() sends the response
  → if handler calls next(err):
    → global error handler sends 400 / 4xx / 500
```

---

## HTTP status codes used here

| Code | Meaning | Where |
|---|---|---|
| 400 | Bad Request | ValidationError from validate.js |
| 4xx/5xx | Passthrough | Errors with `.status` property (e.g. TVMaze 404) |
| 500 | Internal Server Error | Unexpected exceptions |

---

## Environment variables read

| Variable | Required | Purpose |
|---|---|---|
| `JWT_SECRET` | **Yes** | Signs and verifies JWT tokens |
| `PORT` | No | Listening port (default 3000) |
| `SSL_KEY` | No | Path to TLS private key |
| `SSL_CERT` | No | Path to TLS certificate |
| `DB_PATH` | No | SQLite file path (default `./watchly.db`) |

---

## Related docs

[[routes-auth]] · [[routes-shows]] · [[routes-watchlist]] · [[routes-episodes]] · [[db]] · [[index]]
