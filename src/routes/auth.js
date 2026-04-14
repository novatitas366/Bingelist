import { Router } from 'express';
import { db } from '../db.js';
import { hashPassword, verifyPassword, signToken } from '../auth.js';
import { requireString } from '../validate.js';

const router = Router();

router.post('/register', async (req, res, next) => {
  try {
    const username = requireString(req.body?.username, 'username', { min: 3, max: 32 });
    const password = requireString(req.body?.password, 'password', { min: 8, max: 128 });

    const password_hash = await hashPassword(password);
    try {
      const info = db
        .prepare('INSERT INTO users (username, password_hash) VALUES (?, ?)')
        .run(username, password_hash);
      const user = { id: info.lastInsertRowid, username };
      const token = signToken(user.id);
      res.status(201).json({ token, user });
    } catch (e) {
      if (String(e.message).includes('UNIQUE')) {
        return res.status(409).json({ error: 'username already taken' });
      }
      throw e;
    }
  } catch (e) {
    next(e);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const username = requireString(req.body?.username, 'username', { min: 1, max: 64 });
    const password = requireString(req.body?.password, 'password', { min: 1, max: 128 });

    const row = db
      .prepare('SELECT id, username, password_hash FROM users WHERE username = ?')
      .get(username);
    if (!row) {
      return res.status(401).json({ error: 'invalid credentials' });
    }
    const ok = await verifyPassword(password, row.password_hash);
    if (!ok) {
      return res.status(401).json({ error: 'invalid credentials' });
    }
    const token = signToken(row.id);
    res.json({ token, user: { id: row.id, username: row.username } });
  } catch (e) {
    next(e);
  }
});

export default router;
