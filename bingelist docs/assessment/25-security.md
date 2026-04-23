# Assessment: Security

**Requirement:** Secure channel (HTTPS) + authorisation + request validation  
**Status: ✅ All three implemented**

---

## 1. Secure Channel — HTTPS

**Requirement:** Encrypted transport so credentials and tokens can't be intercepted.

**How it's implemented** — `server.js`:
```js
const keyPath  = process.env.SSL_KEY;
const certPath = process.env.SSL_CERT;

if (keyPath && certPath) {
  const options = {
    key:  fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath),
  };
  https.createServer(options, app).listen(port, () => {
    console.log(`Watchly listening on https://localhost:${port}`);
  });
}
```

**Evidence:** `cert.pem` and `key.pem` files exist in the project root. Set `SSL_KEY=./key.pem` and `SSL_CERT=./cert.pem` in `.env` to enable HTTPS.

**On Railway/production:** the platform handles TLS termination, so the app always serves over HTTPS.

---

## 2. Authorisation — JWT (JSON Web Tokens)

**Requirement:** Verify the user's identity on every protected request.

**How it's implemented — issuing tokens** (`src/auth.js`):
```js
export function signToken(userId) {
  return jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: '7d' });
}
```
After successful login or register, a 7-day signed token is returned to the client.

**How it's implemented — verifying tokens** (`src/auth.js:requireAuth`):
```js
router.use(requireAuth); // at the top of watchlist.js and episodes.js
```
Every protected route registers `requireAuth` as middleware. It:
1. Reads the `Authorization: Bearer <token>` header
2. Calls `jwt.verify()` — throws if expired, tampered, or wrong secret
3. Sets `req.userId` from the token payload

**Protected routes:** `/api/watchlist/*` and `/api/episodes/*`  
**Public routes:** `/api/auth/*` and `/api/shows/*`

---

## 3. Request Validation

**Requirement:** Only accept data that is expected.

**How it's implemented** — `src/validate.js` is called in every route handler:

```js
// String validation (type + length)
const username = requireString(req.body?.username, 'username', { min: 3, max: 32 });

// Integer validation (rejects strings, decimals, NaN)
const id = requireInt(req.params.id, 'id');

// Enum validation (rejects values not in the allowed list)
const status = requireEnum(req.body.status, 'status', WATCHLIST_STATUSES);
```

If validation fails, a `ValidationError` is thrown. The global error handler in `server.js` catches it and responds with **HTTP 400 Bad Request**:
```json
{ "error": "username must be at least 3 characters", "field": "username" }
```

**SQL injection prevention:** all database queries use **prepared statements with `?` placeholders**. The database driver handles escaping — user input is never concatenated into SQL strings.

**Password security:** passwords are hashed with **bcrypt** (SALT_ROUNDS=10) before storage. Plain-text passwords are never saved.

---

## Security checklist

| Threat | Protection |
|---|---|
| Eavesdropping | HTTPS (TLS encryption) |
| Forged requests | JWT signature verification |
| Expired sessions | JWT 7-day expiry |
| Accessing other users' data | `WHERE user_id = ?` using JWT-derived ID |
| SQL injection | Prepared statements |
| Malformed input | `requireString`, `requireInt`, `requireEnum` |
| Plain-text passwords | bcrypt hashing |
| Oversized payloads | `express.json({ limit: '100kb' })` |

---

## Docs

[[05-auth]] · [[04-validate]] · [[02-server]] · [[07-routes-auth]] · [[09-routes-watchlist]]
