# src/routes/episodes.js — Episode tracking endpoints

**Source file:** `src/routes/episodes.js`  
**Depends on:** [[db]], [[auth]], [[validate]]  
**Mounted at:** `/api/episodes/*`  
**Auth required:** Yes — all routes

---

## What this file does

Tracks which individual episodes a user has marked as watched. Works alongside the watchlist — you need a show in your watchlist before tracking its episodes (handled by the frontend, not enforced here).

---

## Endpoints

### `GET /api/episodes/:show_id`
Returns an array of watched episode IDs for one show.

**Path parameter:** `:show_id` — the TVMaze show ID  
**Headers:** `Authorization: Bearer <token>`

**Response — HTTP 200:**
```json
[302, 303, 304, 305]
```
(plain array of integers, not objects — efficient for rendering checkboxes)

---

### `POST /api/episodes`
Marks one episode as watched.

**Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`  
**Body:**
```json
{ "show_id": 169, "episode_id": 302 }
```

**Response — HTTP 201:**
```json
{ "show_id": 169, "episode_id": 302 }
```

Uses `INSERT OR IGNORE` — calling this twice for the same episode is safe (idempotent).

---

### `DELETE /api/episodes/:episode_id`
Unmarks one episode.

**Path parameter:** `:episode_id` — the TVMaze episode ID  
**Headers:** `Authorization: Bearer <token>`

**Success — HTTP 204 No Content**  
**Error — HTTP 404:** episode wasn't marked as watched

---

## HTTP concepts illustrated

- **GET** — returns a list of IDs; path parameter identifies the show
- **POST** — creates a watched-episode record; body contains both IDs
- **DELETE** — removes the record; path parameter identifies the episode
- **Idempotent POST** — `INSERT OR IGNORE` makes the POST safe to call multiple times without error
- **204 No Content** — standard response for a successful DELETE

---

## Why store `show_id` redundantly?

The `GET` endpoint queries `WHERE user_id = ? AND show_id = ?`. If `show_id` weren't stored, the query would need to join to another table. Storing it here makes the read fast with a single index.

---

## Related docs

[[db]] · [[auth]] · [[episodes-js]] · [[routes-watchlist]] · [[index]]
