# src/auth.js — Authentication helpers

**Source file:** `src/auth.js`  
**Depends on:** `bcrypt`, `jsonwebtoken`, environment variable `JWT_SECRET`  
**Used by:** [[07-routes-auth]], [[09-routes-watchlist]], [[10-routes-episodes]]

---

## What this file does

Provides two things:
1. **Password helpers** — `hashPassword` and `verifyPassword` using bcrypt
2. **JWT helpers** — `signToken` and the `requireAuth` Express middleware

---

## Key concepts

### bcrypt
- A password hashing algorithm designed to be slow (CPU-intensive) to make brute-force attacks impractical.
- `SALT_ROUNDS = 10` — the work factor. Higher = slower but more secure. 10 is a standard production value.
- Never store plain-text passwords. Store only the hash and compare using `bcrypt.compare`.
- Both `hash` and `compare` are async (return Promises) because they do heavy computation.

### JWT (JSON Web Token)
- A self-contained token the server signs and gives to the client after login.
- Format: `header.payload.signature` (three base64 parts separated by dots).
- The payload contains `{ sub: userId }`. `sub` = "subject" = who the token belongs to.
- The signature is created using `JWT_SECRET`. Only the server can verify it.
- Tokens expire after 7 days (`TOKEN_TTL = '7d'`).
- The client stores the token in `localStorage` and sends it in every authenticated request as `Authorization: Bearer <token>`.

### requireAuth middleware
- An **Express middleware** function: `(req, res, next) => void`.
- Called automatically before route handlers when registered with `router.use(requireAuth)`.
- Reads the `Authorization: Bearer <token>` header.
- Verifies the JWT using `jwt.verify` (throws on invalid/expired tokens).
- Sets `req.userId` from the token payload so route handlers know who is making the request.
- Calls `next()` on success, or responds with HTTP 401 on failure (which stops the chain).

---

## Exported functions

| Function | Parameters | Returns | When to use |
|---|---|---|---|
| `hashPassword(password)` | plain string | `Promise<hash>` | On register |
| `verifyPassword(password, hash)` | plain + stored hash | `Promise<boolean>` | On login |
| `signToken(userId)` | integer | JWT string | After successful login/register |
| `requireAuth` | — | Express middleware | Protect routes with `router.use(requireAuth)` |

---

## Authorization header format

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

- `Bearer` is the authentication scheme name (OAuth 2.0 standard)
- The token follows after the space

---

## Related docs

[[07-routes-auth]] · [[09-routes-watchlist]] · [[10-routes-episodes]] · [[14-api-js]] · [[01-index]]
