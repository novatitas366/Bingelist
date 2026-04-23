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
router.get('/search', async (req, res, next) => {
  try {
    const query = requireString(req.query.q, 'q', { min: 1, max: 200 });
    res.json(await searchShows(query));
  } catch (error) {
    next(error);
  }
});

// router.param runs once per request whenever :id appears in a route path.
// Parses and validates the id, then stores it as req.showId for the handlers below.
// This replaces the repeated requireInt(req.params.id) call in every /:id route.
router.param('id', (req, res, next, val) => {
  try {
    req.showId = requireInt(val, 'id');
    next();
  } catch (error) {
    next(error);
  }
});

// All four routes below use req.showId set by router.param above.
// Must be declared before /:id so Express doesn't interpret "cast" etc. as an id.

// --- GET /api/shows/:id/cast ---
router.get('/:id/cast', async (req, res, next) => {
  try { res.json(await getShowCast(req.showId)); } catch (error) { next(error); }
});

// --- GET /api/shows/:id/seasons ---
router.get('/:id/seasons', async (req, res, next) => {
  try { res.json(await getShowSeasons(req.showId)); } catch (error) { next(error); }
});

// --- GET /api/shows/:id/episodes ---
router.get('/:id/episodes', async (req, res, next) => {
  try { res.json(await getEpisodes(req.showId)); } catch (error) { next(error); }
});

// --- GET /api/shows/:id ---
// Declared last so the more specific /:id/cast etc. match first.
router.get('/:id', async (req, res, next) => {
  try { res.json(await getShow(req.showId)); } catch (error) { next(error); }
});

export default router;
