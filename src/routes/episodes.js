// Routes for tracking which individual episodes the user has watched.
// All routes require a valid JWT — enforced by router.use(requireAuth).
//
// GET    /api/episodes/:show_id     → list watched episode IDs for a show
// POST   /api/episodes              → mark an episode as watched
// DELETE /api/episodes/:episode_id  → unmark an episode

import { Router } from 'express';
import { db } from '../db.js';
import { requireAuth } from '../auth.js';
import { requireInt } from '../validate.js';

const router = Router();
router.use(requireAuth); // protect all routes below with JWT check

// Prepared statements compiled once at startup — faster than re-compiling per request.
const listWatchedStmt   = db.prepare('SELECT episode_id FROM watched_episodes WHERE user_id = ? AND show_id = ?');
const insertWatchedStmt = db.prepare('INSERT OR IGNORE INTO watched_episodes (user_id, show_id, episode_id) VALUES (?, ?, ?)');
const deleteWatchedStmt = db.prepare('DELETE FROM watched_episodes WHERE user_id = ? AND episode_id = ?');

// --- GET /api/episodes/:show_id ---
// Path parameter: :show_id — which show to get watched episodes for.
// Returns a flat array of episode IDs (not full objects) for efficiency.
// The client already has the full episode list from /api/shows/:id/episodes.
router.get('/:show_id', (req, res, next) => {
  try {
    const show_id = requireInt(req.params.show_id, 'show_id');
    const rows = listWatchedStmt.all(req.userId, show_id);
    // .map to unwrap the single-column rows into a plain number array: [123, 456, ...]
    res.json(rows.map((r) => r.episode_id));
  } catch (e) {
    next(e);
  }
});

// --- POST /api/episodes ---
// Request body: { show_id, episode_id }
// Marks one episode as watched for the current user.
// INSERT OR IGNORE makes this idempotent — calling it twice is safe (no error, no duplicate).
// HTTP 201 Created → { show_id, episode_id }
router.post('/', (req, res, next) => {
  try {
    const show_id    = requireInt(req.body?.show_id,    'show_id');
    const episode_id = requireInt(req.body?.episode_id, 'episode_id');
    insertWatchedStmt.run(req.userId, show_id, episode_id);
    res.status(201).json({ show_id, episode_id });
  } catch (e) {
    next(e);
  }
});

// --- DELETE /api/episodes/:episode_id ---
// Path parameter: :episode_id — the TVMaze episode ID to unmark.
// HTTP 204 No Content on success.
// HTTP 404 if the episode wasn't marked as watched.
router.delete('/:episode_id', (req, res, next) => {
  try {
    const episode_id = requireInt(req.params.episode_id, 'episode_id');
    const info = deleteWatchedStmt.run(req.userId, episode_id);
    if (info.changes === 0) return res.status(404).json({ error: 'episode not marked as watched' });
    res.status(204).end();
  } catch (e) {
    next(e);
  }
});

export default router;
