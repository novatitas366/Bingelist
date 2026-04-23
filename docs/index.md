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
| `server.js` | Entry point, middleware, starts server | [[server]] |
| `src/db.js` | Opens database, creates tables | [[db]] |
| `src/auth.js` | Password hashing + JWT middleware | [[auth]] |
| `src/validate.js` | Input validation helpers | [[validate]] |
| `src/tvmaze.js` | TVMaze API wrapper | [[tvmaze]] |
| `src/routes/auth.js` | Register + login endpoints | [[routes-auth]] |
| `src/routes/shows.js` | Show search + detail endpoints | [[routes-shows]] |
| `src/routes/watchlist.js` | Watchlist CRUD endpoints | [[routes-watchlist]] |
| `src/routes/episodes.js` | Episode tracking endpoints | [[routes-episodes]] |

## Frontend docs

| File | Role | Doc |
|---|---|---|
| `public/index.html` | HTML structure + view sections | [[index-html]] |
| `public/css/styles.css` | All styling + responsive breakpoints | [[styles-css]] |
| `public/js/app.js` | Main coordinator, view switching | [[app-js]] |
| `public/js/api.js` | HTTP client, localStorage token | [[api-js]] |
| `public/js/auth.js` | Login/register/logout calls | [[auth-js]] |
| `public/js/search.js` | Search view logic | [[search-js]] |
| `public/js/watchlist.js` | Watchlist view logic | [[watchlist-js]] |
| `public/js/episodes.js` | Episode tracking view | [[episodes-js]] |
| `public/js/modal.js` | Show detail modal | [[modal-js]] |
| `public/js/toast.js` | Notification helper | [[toast-js]] |
| `public/js/utils.js` | Shared helpers (stripHtml, STATUS_LABELS) | [[utils-js]] |

## Assessment docs

| Requirement | Status | Doc |
|---|---|---|
| ≥5 API endpoints | ✅ 14 endpoints | [[endpoints]] |
| ≥2 HTTP action methods | ✅ POST, PATCH, DELETE | [[http-methods]] |
| ≥3 header/query/path parameters | ✅ 5 parameter uses | [[http-parameters]] |
| Security (HTTPS + JWT + validation) | ✅ All three | [[security]] |
| Responsive design (3 device types) | ✅ Mobile/tablet/desktop | [[responsive-design]] |
| Framework principles | ✅ Express Router pattern | [[framework-principles]] |
