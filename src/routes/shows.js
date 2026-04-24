// Read-only proxy to the TVMaze API — no database, no authentication required.
// The frontend never calls TVMaze directly; it goes through these routes so
// we control the response shape and can add caching/error handling centrally.
//
// GET /api/shows/search?q=:query    → search by title (query parameter)
// GET /api/shows/:id                → full show details (path parameter)

import { Router } from 'express';
import { searchShows, getShow } from '../tvmaze.js';
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

// --- GET /api/shows/:id ---
router.get('/:id', async (req, res, next) => {
  try { res.json(await getShow(req.showId)); } catch (error) { next(error); }
});

export default router;
