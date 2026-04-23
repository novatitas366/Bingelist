# src/routes/watchlist.js — Watchlist CRUD endpoints

**Source file:** `src/routes/watchlist.js`  
**Depends on:** [[03-db]], [[05-auth]], [[04-validate]]  
**Mounted at:** `/api/watchlist/*`  
**Auth required:** Yes — all routes (enforced by `router.use(requireAuth)`)

---

## What this file does

Full Create/Read/Update/Delete for the authenticated user's watchlist. The `requireAuth` middleware runs before every handler in this file, so unauthenticated requests never reach the route logic.

---

## Endpoints

### `GET /api/watchlist`
Returns all watchlist entries for the logged-in user, newest first.

**Headers required:** `Authorization: Bearer <token>`

**Response — HTTP 200:**
```json
[
  {
    "id": 5,
    "show_id": 169,
    "show_name": "Breaking Bad",
    "show_image": "https://...",
    "status": "watching",
    "note": "Up to S3E4",
    "added_at": "2024-01-15 14:30:00"
  }
]
```

---

### `POST /api/watchlist`
Adds a show to the watchlist.

**Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`  
**Body:**
```json
{
  "show_id": 169,
  "show_name": "Breaking Bad",
  "show_image": "https://...",
  "status": "plan_to_watch"
}
```

**Success — HTTP 201 Created:** the new row  
**Error — HTTP 409:** show already in this user's watchlist

---

### `PATCH /api/watchlist/:id`
Partially updates a watchlist entry. Only fields present in the body are changed.

**Path parameter:** `:id` — the watchlist entry ID  
**Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`  
**Body (at least one field):**
```json
{ "status": "watched", "note": "Amazing finale" }
```

**Success — HTTP 200:** the updated row  
**Error — HTTP 404:** entry not found (or belongs to another user)  
**Error — HTTP 400:** no valid fields provided

---

### `DELETE /api/watchlist/:id`
Removes a watchlist entry.

**Path parameter:** `:id`  
**Headers:** `Authorization: Bearer <token>`

**Success — HTTP 204 No Content** (empty body)  
**Error — HTTP 404:** entry not found

---

## HTTP concepts illustrated

- **GET** — read, no body, no side effects
- **POST** — create, returns 201 with the new resource
- **PATCH** — partial update (only the fields you send); different from PUT (which replaces the entire resource)
- **DELETE** — remove, returns 204 (success with no body)
- **Path parameter** — `:id` identifies which specific entry to update/delete
- **Authorization header** — `Bearer <token>` on every request; `requireAuth` validates it
- **`AND user_id = ?`** in UPDATE/DELETE — prevents one user from modifying another's entries

---

## Security note

Every write query includes `WHERE id = ? AND user_id = ?`. The user ID comes from the verified JWT, not from the request body, so a user can never accidentally (or maliciously) modify another user's data.

---

## Related docs

[[03-db]] · [[05-auth]] · [[04-validate]] · [[20-watchlist-js]] · [[01-index]]
