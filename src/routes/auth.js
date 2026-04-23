// Authentication routes — no JWT required (these are how you get a JWT).
//
// POST /api/auth/register  → create a new account, return token
// POST /api/auth/login     → verify credentials, return token

import { Router } from 'express';
import { db, isUniqueViolation } from '../db.js';
import { hashPassword, verifyPassword, signToken } from '../auth.js';
import { requireString } from '../validate.js';

const router = Router();

// --- POST /api/auth/register ---
// Request body: { username, password }
// Success:  HTTP 201 Created  → { token, user: { id, username } }
// Conflict: HTTP 409 Conflict → username already taken
router.post('/register', async (req, res, next) => {
  try {
    // Validate inputs — throws ValidationError (→ HTTP 400) if bad
    const username      = requireString(req.body?.username, 'username', { min: 3, max: 32 });
    const password      = requireString(req.body?.password, 'password', { min: 8, max: 128 });

    // Hash the password before storing — NEVER store plain-text passwords
    const password_hash = await hashPassword(password);

    const info = db
      .prepare('INSERT INTO users (username, password_hash) VALUES (?, ?)')
      .run(username, password_hash);

    const user  = { id: info.lastInsertRowid, username };
    const token = signToken(user.id); // JWT the client stores for future requests

    // HTTP 201 = a new resource was created (the user account)
    res.status(201).json({ token, user });
  } catch (error) {
    // SQLite UNIQUE constraint fires when username is already taken
    if (isUniqueViolation(error)) return res.status(409).json({ error: 'username already taken' });
    next(error); // pass anything else to the global error handler
  }
});

// --- POST /api/auth/login ---
// Request body: { username, password }
// Success:  HTTP 200 OK           → { token, user: { id, username } }
// Failure:  HTTP 401 Unauthorized → "invalid credentials"
router.post('/login', async (req, res, next) => {
  try {
    const username = requireString(req.body?.username, 'username', { min: 1, max: 64 });
    const password = requireString(req.body?.password, 'password', { min: 1, max: 128 });

    // Look up the user by username
    const row = db
      .prepare('SELECT id, username, password_hash FROM users WHERE username = ?')
      .get(username);

    // Security: return the same error message whether username or password is wrong.
    // This prevents an attacker from discovering which usernames exist.
    if (!row) return res.status(401).json({ error: 'invalid credentials' });

    const ok = await verifyPassword(password, row.password_hash);
    if (!ok)  return res.status(401).json({ error: 'invalid credentials' });

    const token = signToken(row.id);
    res.json({ token, user: { id: row.id, username: row.username } });
  } catch (error) {
    next(error);
  }
});

export default router;
