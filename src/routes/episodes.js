import { Router } from 'express';
import { db } from '../db.js';
import { requireAuth } from '../auth.js';
import { requireInt } from '../validate.js';

const router = Router();
router.use(requireAuth);

router.get('/:show_id', (req, res, next) => {
  try {
    const show_id = requireInt(req.params.show_id, 'show_id');
    const rows = db
      .prepare(
        `SELECT episode_id FROM watched_episodes
         WHERE user_id = ? AND show_id = ?`
      )
      .all(req.userId, show_id);
    res.json(rows.map((r) => r.episode_id));
  } catch (e) {
    next(e);
  }
});

router.post('/', (req, res, next) => {
  try {
    const show_id = requireInt(req.body?.show_id, 'show_id');
    const episode_id = requireInt(req.body?.episode_id, 'episode_id');

    db.prepare(
      `INSERT OR IGNORE INTO watched_episodes (user_id, show_id, episode_id)
       VALUES (?, ?, ?)`
    ).run(req.userId, show_id, episode_id);

    res.status(201).json({ show_id, episode_id });
  } catch (e) {
    next(e);
  }
});

router.delete('/:episode_id', (req, res, next) => {
  try {
    const episode_id = requireInt(req.params.episode_id, 'episode_id');
    const info = db
      .prepare(
        `DELETE FROM watched_episodes
         WHERE user_id = ? AND episode_id = ?`
      )
      .run(req.userId, episode_id);
    if (info.changes === 0) {
      return res.status(404).json({ error: 'episode not marked as watched' });
    }
    res.status(204).end();
  } catch (e) {
    next(e);
  }
});

export default router;
