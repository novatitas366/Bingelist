import { Router } from 'express';
import { searchShows, getShow, getEpisodes, getShowCast, getShowSeasons } from '../tvmaze.js';
import { requireString, requireInt } from '../validate.js';

const router = Router();

router.get('/search', async (req, res, next) => {
  try {
    const q = requireString(req.query.q, 'q', { min: 1, max: 200 });
    const results = await searchShows(q);
    res.json(results);
  } catch (e) {
    next(e);
  }
});

router.get('/:id/cast', async (req, res, next) => {
  try {
    const id = requireInt(req.params.id, 'id');
    const cast = await getShowCast(id);
    res.json(cast);
  } catch (e) {
    next(e);
  }
});

router.get('/:id/seasons', async (req, res, next) => {
  try {
    const id = requireInt(req.params.id, 'id');
    const seasons = await getShowSeasons(id);
    res.json(seasons);
  } catch (e) {
    next(e);
  }
});

router.get('/:id/episodes', async (req, res, next) => {
  try {
    const id = requireInt(req.params.id, 'id');
    const episodes = await getEpisodes(id);
    res.json(episodes);
  } catch (e) {
    next(e);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const id = requireInt(req.params.id, 'id');
    const show = await getShow(id);
    res.json(show);
  } catch (e) {
    next(e);
  }
});

export default router;
