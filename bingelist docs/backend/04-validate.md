# src/validate.js — Input validation

**Source file:** `src/validate.js`  
**Depends on:** nothing  
**Used by:** [[07-routes-auth]], [[08-routes-shows]], [[09-routes-watchlist]], [[10-routes-episodes]]

---

## What this file does

Provides small validation functions for every type of user input. Each function either **returns the cleaned value** or **throws a `ValidationError`**.

The global error handler in `server.js` catches `ValidationError` and returns **HTTP 400 Bad Request** with the field name included, so the frontend knows exactly which input was wrong.

---

## Key concepts

- **Guard at the boundary** — validation only happens on incoming data (request body, query string, URL params). We trust data already stored in the database.
- **Fail fast** — if any field is invalid, throw immediately. No need to collect all errors.
- **ValidationError carries a field name** — the response `{ error: "...", field: "username" }` lets the frontend highlight the specific broken input.

---

## Exported functions

### `requireString(val, name, { min, max })`
- Rejects: not a string, too short, too long
- Returns: trimmed string
- Example: `requireString(req.body.username, 'username', { min: 3, max: 32 })`

### `optionalString(val, name, opts)`
- Same as `requireString` but also accepts `null`, `undefined`, or `''` — returns `null` for those
- Used for fields like `note` and `show_image` that can be absent

### `requireInt(val, name)`
- Accepts strings like `"42"` (URL params are always strings)
- Rejects: non-numeric, decimals like `1.5`
- Returns: integer number
- Example: `requireInt(req.params.id, 'id')`

### `requireEnum(val, name, allowed)`
- Rejects any value not in the `allowed` array
- Returns: the value unchanged
- Example: `requireEnum(req.body.status, 'status', WATCHLIST_STATUSES)`

### `WATCHLIST_STATUSES`
- `['plan_to_watch', 'watching', 'watched', 'dropped']`
- Shared between routes/watchlist.js and this file — one source of truth

---

## Error response shape

```json
{
  "error": "username must be at least 3 characters",
  "field": "username"
}
```

---

## Related docs

[[02-server]] · [[07-routes-auth]] · [[09-routes-watchlist]] · [[01-index]]
