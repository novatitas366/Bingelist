# public/js/auth.js — Login, register, logout

**Source file:** `public/js/auth.js`  
**Depends on:** [[14-api-js]]  
**Used by:** [[13-app-js]]

---

## What this file does

Thin wrappers around the auth API endpoints. Sends credentials to the server and stores the returned JWT and user object in `localStorage` on success.

---

## Functions

### `login(username, password)`
- Calls `POST /api/auth/login` with `{ username, password }` in the request body
- On success: stores the token and user in `localStorage`
- Throws `ApiError` on failure (401 wrong credentials, 400 validation)

### `register(username, password)`
- Calls `POST /api/auth/register` with the same body shape
- On success: stores the token and user
- Throws `ApiError` on failure (409 username taken, 400 validation)

### `logout()`
- Calls `clearToken()` which removes both keys from `localStorage`
- Synchronous — no network request needed (the server doesn't track sessions; JWTs are stateless)

---

## Key concepts

- **No `auth: true`** — login and register don't send an Authorization header because the user doesn't have a token yet. That's the whole point of these endpoints.
- **Stateless JWT auth** — there's no server-side session to invalidate. Logout just deletes the token from the browser. The token remains technically valid until it expires (7 days), but the browser no longer sends it.
- **`request()` from api.js** — all actual HTTP work happens in [[14-api-js]]. This file just organises the auth-specific calls.

---

## HTTP request sent by `login()`

```
POST /api/auth/login HTTP/1.1
Content-Type: application/json

{ "username": "alice", "password": "secret123" }
```

Response (success):
```
HTTP/1.1 200 OK
Content-Type: application/json

{ "token": "eyJ...", "user": { "id": 1, "username": "alice" } }
```

---

## Related docs

[[14-api-js]] · [[13-app-js]] · [[07-routes-auth]] · [[01-index]]
