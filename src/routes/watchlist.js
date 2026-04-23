// CRUD routes for the authenticated user's watchlist.
// Every route in this file requires a valid JWT — enforced by router.use(requireAuth).
//
// GET    /api/watchlist        → list all entries for the logged-in user
// POST   /api/watchlist        → add a show to the watchlist
// PATCH  /api/watchlist/:id    → update status or note of an entry
// DELETE /api/watchlist/:id    → remove an entry

import { Router } from 'express';
import { db, isUniqueViolation } from '../db.js';
import { requireAuth } from '../auth.js';
import {
  requireString,
  optionalString,
  requireInt,
  requireEnum,
  WATCHLIST_STATUSES,
} from '../validate.js';

const router = Router();

// requireAuth runs BEFORE every handler in this router.
// It sets req.userId from the JWT, or responds with 401 and stops the chain.
router.use(requireAuth);

// Shared column list — keeps SELECT queries consistent across handlers.
const FIELDS = 'id, show_id, show_name, show_image, status, note, added_at';

// Prepared statements compiled once at startup for efficiency.
// The ? placeholders are filled at query time — SQLite prevents SQL injection.
const listStmt   = db.prepare(`SELECT ${FIELDS} FROM watchlist WHERE user_id = ? ORDER BY added_at DESC`);
const insertStmt = db.prepare(`INSERT INTO watchlist (user_id, show_id, show_name, show_image, status, note) VALUES (?, ?, ?, ?, ?, ?) RETURNING ${FIELDS}`);
const deleteStmt = db.prepare('DELETE FROM watchlist WHERE id = ? AND user_id = ?');

// --- GET /api/watchlist ---
// Response header: Content-Type: application/json (set by res.json)
// Returns newest entries first (ORDER BY added_at DESC).
router.get('/', (req, res) => {
  res.json(listStmt.all(req.userId)); // req.userId was set by requireAuth
});

// --- POST /api/watchlist ---
// Request body: { show_id, show_name, show_image?, status?, note? }
// Success:  HTTP 201 Created  → the new watchlist row
// Conflict: HTTP 409 Conflict → show already in this user's watchlist
router.post('/', (req, res, next) => {
  try {
    const show_id    = requireInt(req.body?.show_id, 'show_id');
    const show_name  = requireString(req.body?.show_name, 'show_name', { max: 300 });
    const show_image = optionalString(req.body?.show_image, 'show_image', { max: 500 });
    // Default status is 'plan_to_watch' if the client doesn't specify one
    const status     = req.body?.status
      ? requireEnum(req.body.status, 'status', WATCHLIST_STATUSES)
      : 'plan_to_watch';
    const note = optionalString(req.body?.note, 'note', { max: 2000 });

    // RETURNING clause returns the inserted row without a second SELECT round-trip
    const row = insertStmt.get(req.userId, show_id, show_name, show_image, status, note);
    res.status(201).json(row); // 201 = new resource created
  } catch (e) {
    if (isUniqueViolation(e)) return res.status(409).json({ error: 'show already in watchlist' });
    next(e);
  }
});

// --- PATCH /api/watchlist/:id ---
// Partial update — only fields present in the body are changed.
// Path parameter: :id is the watchlist entry ID (not the show ID).
// Request body: { status?, note? } (at least one required)
// Success: HTTP 200 OK → the updated row
// Not found: HTTP 404 (if the entry doesn't exist or belongs to another user)
router.patch('/:id', (req, res, next) => {
  try {
    const id = requireInt(req.params.id, 'id'); // :id from the URL path

    // Build the SET clause dynamically — only update what was actually sent
    const updates = [];
    const values  = [];

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

    // WHERE id = ? AND user_id = ? prevents one user from editing another's entries
    values.push(id, req.userId);
    const row = db
      .prepare(`UPDATE watchlist SET ${updates.join(', ')} WHERE id = ? AND user_id = ? RETURNING ${FIELDS}`)
      .get(...values);

    // RETURNING returns undefined if the WHERE matched no rows
    if (!row) return res.status(404).json({ error: 'watchlist entry not found' });
    res.json(row);
  } catch (e) {
    next(e);
  }
});

// --- DELETE /api/watchlist/:id ---
// Path parameter: :id is the watchlist entry ID.
// Success: HTTP 204 No Content (deleted, no body to return)
// Not found: HTTP 404
router.delete('/:id', (req, res, next) => {
  try {
    const id   = requireInt(req.params.id, 'id');
    const info = deleteStmt.run(id, req.userId);
    // info.changes = number of rows deleted; 0 means the entry wasn't found
    if (info.changes === 0) return res.status(404).json({ error: 'watchlist entry not found' });
    res.status(204).end(); // 204 = success, no response body
  } catch (e) {
    next(e);
  }
});

export default router;
