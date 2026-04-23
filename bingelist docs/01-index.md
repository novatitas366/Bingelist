# Watchly — Codebase Map

Watchly is a TV show watchlist tracker. Users search for shows, save them with a status, and track which episodes they've watched.

Open this folder as an **Obsidian vault** and click any `[[link]]` to jump directly to that file's explanation.

---

## Architecture in one sentence

The **backend** (Node/Express) stores data in SQLite and proxies show info from TVMaze. The **frontend** (vanilla JS modules) talks to the backend REST API using `fetch`.

```
Browser (public/)
  └── app.js           ← coordinator
       ├── api.js      ← all HTTP requests go through here
       ├── auth.js     ← login / register / logout
       ├── search.js   ← search view
       ├── watchlist.js← watchlist view
       ├── episodes.js ← episodes view
       ├── modal.js    ← show detail popup
       ├── toast.js    ← notifications
       └── utils.js    ← stripHtml, STATUS_LABELS (shared)

Server (src/)
  ├── server.js        ← entry point, Express setup
  ├── db.js            ← SQLite database + schema
  ├── auth.js          ← bcrypt + JWT helpers
  ├── validate.js      ← input validation
  ├── tvmaze.js        ← TVMaze API wrapper
  └── routes/
       ├── auth.js     ← POST /api/auth/register+login
       ├── shows.js    ← GET  /api/shows/*
       ├── watchlist.js← CRUD /api/watchlist
       └── episodes.js ← CRUD /api/episodes
```

---

## Backend docs

| File | Role | Doc |
|---|---|---|
| `server.js` | Entry point, middleware, starts server | [[02-server]] |
| `src/db.js` | Opens database, creates tables | [[03-db]] |
| `src/auth.js` | Password hashing + JWT middleware | [[05-auth]] |
| `src/validate.js` | Input validation helpers | [[04-validate]] |
| `src/tvmaze.js` | TVMaze API wrapper | [[06-tvmaze]] |
| `src/routes/auth.js` | Register + login endpoints | [[07-routes-auth]] |
| `src/routes/shows.js` | Show search + detail endpoints | [[08-routes-shows]] |
| `src/routes/watchlist.js` | Watchlist CRUD endpoints | [[09-routes-watchlist]] |
| `src/routes/episodes.js` | Episode tracking endpoints | [[10-routes-episodes]] |

## Frontend docs

| File | Role | Doc |
|---|---|---|
| `public/index.html` | HTML structure + view sections | [[11-index-html]] |
| `public/css/styles.css` | All styling + responsive breakpoints | [[12-styles-css]] |
| `public/js/app.js` | Main coordinator, view switching | [[13-app-js]] |
| `public/js/api.js` | HTTP client, localStorage token | [[14-api-js]] |
| `public/js/auth.js` | Login/register/logout calls | [[15-auth-js]] |
| `public/js/search.js` | Search view logic | [[19-search-js]] |
| `public/js/watchlist.js` | Watchlist view logic | [[20-watchlist-js]] |
| `public/js/episodes.js` | Episode tracking view | [[21-episodes-js]] |
| `public/js/modal.js` | Show detail modal | [[18-modal-js]] |
| `public/js/toast.js` | Notification helper | [[16-toast-js]] |
| `public/js/utils.js` | Shared helpers (stripHtml, STATUS_LABELS) | [[17-utils-js]] |

## Assessment docs

| Requirement | Status | Doc |
|---|---|---|
| ≥5 API endpoints | ✅ 14 endpoints | [[22-endpoints]] |
| ≥2 HTTP action methods | ✅ POST, PATCH, DELETE | [[23-http-methods]] |
| ≥3 header/query/path parameters | ✅ 5 parameter uses | [[24-http-parameters]] |
| Security (HTTPS + JWT + validation) | ✅ All three | [[25-security]] |
| Responsive design (3 device types) | ✅ Mobile/tablet/desktop | [[26-responsive-design]] |
| Framework principles | ✅ Express Router pattern | [[27-framework-principles]] |
