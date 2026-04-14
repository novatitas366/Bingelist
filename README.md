# Watchly

A TV show watchlist tracker. Search shows, track what you're watching, and
check off episodes as you go. Data comes from the free [TVmaze API](https://www.tvmaze.com/api).

Built with Node.js + Express, SQLite (via `better-sqlite3`), JWT auth, and a
plain HTML/CSS/JS frontend — no build step, no frontend framework.

## Features

- User accounts with JWT-based auth (bcrypt-hashed passwords)
- Search TV shows via the TVmaze API
- Personal watchlist with four statuses: `plan_to_watch`, `watching`, `watched`, `dropped`
- Per-show episode tracker — check off episodes as you watch them
- Responsive UI (mobile, tablet, desktop)
- Single deployable unit — backend serves the frontend as static files

## Local setup

Requires Node.js 18+.

```bash
git clone <your-fork-url> watchly
cd watchly
npm install
cp .env.example .env
# edit .env and set JWT_SECRET to a long random string
npm start
```

Open <http://localhost:3000>.

The SQLite file is created automatically at the path in `DB_PATH`
(default `./watchly.db`).

### Environment variables

| Variable     | Required | Default         | Description                        |
| ------------ | -------- | --------------- | ---------------------------------- |
| `PORT`       | no       | `3000`          | HTTP port                          |
| `JWT_SECRET` | **yes**  | —               | Secret used to sign JWTs           |
| `DB_PATH`    | no       | `./watchly.db`  | Path to the SQLite database file   |

## API reference

| Method   | Path                          | Auth | Purpose                              |
| -------- | ----------------------------- | ---- | ------------------------------------ |
| `POST`   | `/api/auth/register`          | —    | Create a new user                    |
| `POST`   | `/api/auth/login`             | —    | Exchange credentials for a JWT       |
| `GET`    | `/api/shows/search?q=`        | —    | Search shows via TVmaze              |
| `GET`    | `/api/shows/:id/episodes`     | —    | List episodes for a show (TVmaze)    |
| `GET`    | `/api/watchlist`              | JWT  | Current user's watchlist             |
| `POST`   | `/api/watchlist`              | JWT  | Add a show to the watchlist          |
| `PATCH`  | `/api/watchlist/:id`          | JWT  | Update a watchlist entry's status/note |
| `DELETE` | `/api/watchlist/:id`          | JWT  | Remove a watchlist entry             |
| `GET`    | `/api/episodes/:show_id`      | JWT  | Watched episode IDs for a show       |
| `POST`   | `/api/episodes`               | JWT  | Mark an episode as watched           |
| `DELETE` | `/api/episodes/:episode_id`   | JWT  | Unmark an episode                    |

Authenticated requests must include `Authorization: Bearer <token>`.

## Deploy to Railway

1. Push this repo to GitHub.
2. In Railway: **New Project → Deploy from GitHub repo** and pick the repo.
3. Under the service's **Variables** tab, set:
   - `JWT_SECRET` — a long random string (required).
   - `DB_PATH` — `/data/watchly.db` (see volume step below).
4. **Attach a Volume** (Settings → Volumes → New Volume) mounted at `/data`.
   Without a volume, the SQLite file is wiped on every redeploy.
5. Railway reads `railway.json` and runs `npm start` automatically.

Your app will be available at the public URL Railway generates.

## Tech stack

- **Backend:** Node.js 18+, Express 4
- **Database:** SQLite via `better-sqlite3`
- **Auth:** `jsonwebtoken` + `bcrypt`
- **Frontend:** plain HTML, CSS, and ES modules — no build step
- **External data:** [TVmaze API](https://www.tvmaze.com/api)
