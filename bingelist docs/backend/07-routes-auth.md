# src/routes/auth.js — Authentication endpoints

**Source file:** `src/routes/auth.js`  
**Depends on:** [[03-db]], [[05-auth]], [[04-validate]]  
**Mounted at:** `POST /api/auth/register` and `POST /api/auth/login`  
**Auth required:** No (these are how you get a token)

---

## What this file does

Handles user registration and login. On success both routes return a JWT token that the client stores and uses on all subsequent authenticated requests.

---

## Endpoints

### `POST /api/auth/register`

**Request** (HTTP body, Content-Type: application/json):
```json
{ "username": "alice", "password": "secretpass" }
```

**Success — HTTP 201 Created:**
```json
{
  "token": "eyJ...",
  "user": { "id": 1, "username": "alice" }
}
```

**Errors:**
| Status | Body | Reason |
|---|---|---|
| 400 | `{ error: "...", field: "..." }` | Validation failed (too short, etc.) |
| 409 | `{ error: "username already taken" }` | UNIQUE constraint on `users.username` |

---

### `POST /api/auth/login`

**Request:**
```json
{ "username": "alice", "password": "secretpass" }
```

**Success — HTTP 200 OK:**
```json
{
  "token": "eyJ...",
  "user": { "id": 1, "username": "alice" }
}
```

**Errors:**
| Status | Body | Reason |
|---|---|---|
| 400 | `{ error: "...", field: "..." }` | Validation failed |
| 401 | `{ error: "invalid credentials" }` | Wrong username OR wrong password |

> Security note: the same message is returned whether the username doesn't exist or the password is wrong. This prevents an attacker from testing which usernames exist.

---

## Flow diagram

```
POST /api/auth/register
  → validate username + password
  → bcrypt.hash(password)          ← async, CPU-intensive
  → INSERT INTO users
  → signToken(userId)
  → return 201 { token, user }

POST /api/auth/login
  → validate inputs
  → SELECT user WHERE username = ?
  → if not found → 401
  → bcrypt.compare(password, hash) ← async
  → if not match → 401
  → signToken(userId)
  → return 200 { token, user }
```

---

## HTTP concepts illustrated

- **POST** — creates a new resource (user account) or starts a session
- **HTTP 201 Created** — a new resource was created (register)
- **HTTP 401 Unauthorized** — credentials are invalid or missing
- **HTTP 409 Conflict** — the resource already exists
- **Request body** — credentials are in the JSON body, not the URL (security)

---

## Related docs

[[05-auth]] · [[04-validate]] · [[03-db]] · [[15-auth-js]] · [[01-index]]
