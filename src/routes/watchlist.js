import { Router } from 'express';
import { db } from '../db.js';
import { requireAuth } from '../auth.js';
import {
  requireString,
  optionalString,
  requireInt,
  requireEnum,
  WATCHLIST_STATUSES,
} from '../validate.js';

const router = Router();
router.use(requireAuth);

router.get('/', (req, res) => {
  const rows = db
    .prepare(
      `SELECT id, show_id, show_name, show_image, status, note, added_at
       FROM watchlist WHERE user_id = ? ORDER BY added_at DESC`
    )
    .all(req.userId);
  res.json(rows);
});

router.post('/', (req, res, next) => {
  try {
    const show_id = requireInt(req.body?.show_id, 'show_id');
    const show_name = requireString(req.body?.show_name, 'show_name', { max: 300 });
    const show_image = optionalString(req.body?.show_image, 'show_image', { max: 500 });
    const status = req.body?.status
      ? requireEnum(req.body.status, 'status', WATCHLIST_STATUSES)
      : 'plan_to_watch';
    const note = optionalString(req.body?.note, 'note', { max: 2000 });

    try {
      const info = db
        .prepare(
          `INSERT INTO watchlist (user_id, show_id, show_name, show_image, status, note)
           VALUES (?, ?, ?, ?, ?, ?)`
        )
        .run(req.userId, show_id, show_name, show_image, status, note);
      const row = db
        .prepare(
          `SELECT id, show_id, show_name, show_image, status, note, added_at
           FROM watchlist WHERE id = ?`
        )
        .get(info.lastInsertRowid);
      res.status(201).json(row);
    } catch (e) {
      if (String(e.message).includes('UNIQUE')) {
        return res.status(409).json({ error: 'show already in watchlist' });
      }
      throw e;
    }
  } catch (e) {
    next(e);
  }
});

router.patch('/:id', (req, res, next) => {
  try {
    const id = requireInt(req.params.id, 'id');

    const updates = [];
    const values = [];

    if (req.body?.status !== undefined) {
      requireEnum(req.body.status, 'status', WATCHLIST_STATUSES);
      updates.push('status = ?');
      values.push(req.body.status);
    }
    if (req.body?.note !== undefined) {
      const note = optionalString(req.body.note, 'note', { max: 2000 });
      updates.push('note = ?');
      values.push(note);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'no updatable fields provided' });
    }

    values.push(id, req.userId);
    const info = db
      .prepare(
        `UPDATE watchlist SET ${updates.join(', ')} WHERE id = ? AND user_id = ?`
      )
      .run(...values);

    if (info.changes === 0) {
      return res.status(404).json({ error: 'watchlist entry not found' });
    }

    const row = db
      .prepare(
        `SELECT id, show_id, show_name, show_image, status, note, added_at
         FROM watchlist WHERE id = ?`
      )
      .get(id);
    res.json(row);
  } catch (e) {
    next(e);
  }
});

router.delete('/:id', (req, res, next) => {
  try {
    const id = requireInt(req.params.id, 'id');
    const info = db
      .prepare('DELETE FROM watchlist WHERE id = ? AND user_id = ?')
      .run(id, req.userId);
    if (info.changes === 0) {
      return res.status(404).json({ error: 'watchlist entry not found' });
    }
    res.status(204).end();
  } catch (e) {
    next(e);
  }
});

export default router;
