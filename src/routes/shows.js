// Read-only proxy to the TVMaze API — no database, no authentication required.
// The frontend never calls TVMaze directly; it goes through these routes so
// we control the response shape and can add caching/error handling centrally.
//
// GET /api/shows/search?q=:query    → search by title (query parameter)
// GET /api/shows/:id                → full show details (path parameter)
// GET /api/shows/:id/cast           → top 5 cast members (path parameter)
// GET /api/shows/:id/seasons        → season list (path parameter)
// GET /api/shows/:id/episodes       → all episodes (path parameter)

import { Router } from 'express';
import { searchShows, getShow, getEpisodes, getShowCast, getShowSeasons } from '../tvmaze.js';
import { requireString, requireInt } from '../validate.js';

const router = Router();

// --- GET /api/shows/search?q=:query ---
// Uses a QUERY PARAMETER (?q=) — suitable for search because the value is a filter, not an ID.
// HTTP header used: none (no auth required)
router.get('/search', async (req, res, next) => {
  try {
    // req.query.q is the value of ?q= in the URL
    const q = requireString(req.query.q, 'q', { min: 1, max: 200 });
    res.json(await searchShows(q));
  } catch (e) {
    next(e);
  }
});

// --- GET /api/shows/:id/cast ---
// Uses a PATH PARAMETER (:id) — the show ID is part of the URL resource path.
// Must be declared before /:id to avoid Express matching "cast" as the id value.
router.get('/:id/cast', async (req, res, next) => {
  try {
    const id = requireInt(req.params.id, 'id'); // req.params.id is always a string
    res.json(await getShowCast(id));
  } catch (e) {
    next(e);
  }
});

// --- GET /api/shows/:id/seasons ---
router.get('/:id/seasons', async (req, res, next) => {
  try {
    const id = requireInt(req.params.id, 'id');
    res.json(await getShowSeasons(id));
  } catch (e) {
    next(e);
  }
});

// --- GET /api/shows/:id/episodes ---
router.get('/:id/episodes', async (req, res, next) => {
  try {
    const id = requireInt(req.params.id, 'id');
    res.json(await getEpisodes(id));
  } catch (e) {
    next(e);
  }
});

// --- GET /api/shows/:id ---
// General show lookup — declared LAST so the more specific /:id/cast etc. match first.
router.get('/:id', async (req, res, next) => {
  try {
    const id = requireInt(req.params.id, 'id');
    res.json(await getShow(id));
  } catch (e) {
    next(e);
  }
});

export default router;
