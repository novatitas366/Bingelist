# public/js/api.js — HTTP client

**Source file:** `public/js/api.js`  
**Depends on:** browser built-ins (`fetch`, `localStorage`)  
**Used by:** [[15-auth-js]], [[19-search-js]], [[20-watchlist-js]], [[21-episodes-js]], [[18-modal-js]]

---

## What this file does

Every API call in the app goes through the `request()` function here. It:
- Adds the correct headers (`Content-Type`, `Authorization`)
- Handles HTTP errors by throwing `ApiError`
- Manages the JWT token in `localStorage`

---

## Key concepts

- **`fetch`** — the browser's built-in HTTP client. Returns a `Promise<Response>`.
- **`localStorage`** — browser key-value storage that persists across page refreshes. Used to store the JWT token so the user stays logged in.
- **Authorization header** — `Authorization: Bearer <token>` is the standard way to send a JWT. The `requireAuth` middleware on the backend reads this header.
- **HTTP status codes** — `res.ok` is `true` for 200–299, `false` for 400+. We throw an error for non-OK responses so callers can `catch` them.
- **`ApiError`** — a custom Error subclass that carries `.status` (the HTTP status code). Callers can check `e.status === 409` to handle specific cases.

---

## `request(path, options)` function

```js
const data = await request('/watchlist', { method: 'GET', auth: true });
const row  = await request('/watchlist', { method: 'POST', auth: true, body: { ... } });
```

| Option | Default | Effect |
|---|---|---|
| `method` | `'GET'` | HTTP verb |
| `body` | undefined | Object to JSON-encode; adds `Content-Type: application/json` header |
| `auth` | `false` | If true, adds `Authorization: Bearer <token>` header |

**Returns:** parsed JSON data, or `null` for HTTP 204 (no body)  
**Throws:** `ApiError` for any non-OK response

---

## localStorage keys

| Key | Stores |
|---|---|
| `watchly.token` | JWT string (the Authorization token) |
| `watchly.user` | JSON-encoded `{ id, username }` object |

---

## `ApiError` class

```js
try {
  await request('/watchlist', { method: 'POST', auth: true, body: { ... } });
} catch (e) {
  if (e.status === 409) { /* already in watchlist */ }
  else { /* other error */ }
}
```

---

## Related docs

[[15-auth-js]] · [[19-search-js]] · [[20-watchlist-js]] · [[21-episodes-js]] · [[05-auth]] · [[01-index]]
