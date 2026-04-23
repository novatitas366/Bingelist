// Thin wrapper around the public TVMaze REST API (https://www.tvmaze.com/api).
// All show and episode data in Watchly comes from here — nothing is stored locally.
// TVMaze is free and requires no API key.

const BASE = 'https://api.tvmaze.com';

// Internal helper: fetches BASE + endpoint, throws on non-OK responses.
// Maps TVMaze 404 → our 404, everything else bad → 502 Bad Gateway
// (502 means "our server got a bad response from an upstream service").
async function get(endpoint) {
  const res = await fetch(`${BASE}${endpoint}`);
  if (!res.ok) {
    const err = new Error(`TVmaze request failed: ${res.status}`);
    err.status = res.status === 404 ? 404 : 502;
    throw err;
  }
  return res.json();
}

// Shared shape for a show object — used by both searchShows and getShow.
// Extracting this avoids duplicating the 6 identical fields in both functions.
function formatShowBase(s) {
  return {
    id:        s.id,
    name:      s.name,
    // TVMaze provides two sizes; prefer the larger original
    image:     s.image?.original || s.image?.medium || null,
    summary:   s.summary  || null, // may contain HTML — clients must strip it
    premiered: s.premiered || null,
    genres:    s.genres   || [],
  };
}

// GET /api/shows/search?q=... → calls TVMaze /search/shows?q=...
// Returns an array of simplified show objects.
export async function searchShows(query) {
  // TVMaze wraps each result in { score, show: {...} }
  const data = await get(`/search/shows?q=${encodeURIComponent(query)}`);
  return data.map((entry) => formatShowBase(entry.show));
}

// GET /api/shows/:id → calls TVMaze /shows/:id
// Returns a single show with extra fields (network, status) for the detail modal.
export async function getShow(showId) {
  const s = await get(`/shows/${showId}`);
  return {
    ...formatShowBase(s),
    // A show may air on a traditional network OR a streaming web channel
    network: s.network?.name || s.webChannel?.name || null,
    status:  s.status || null, // e.g. "Running", "Ended"
  };
}

// GET /api/shows/:id/episodes → calls TVMaze /shows/:id/episodes
// Returns all episodes for the show, used by the episodes tracking view.
export async function getEpisodes(showId) {
  const data = await get(`/shows/${showId}/episodes`);
  return data.map((ep) => ({
    id:      ep.id,
    name:    ep.name,
    season:  ep.season,
    number:  ep.number,
    airdate: ep.airdate || null,
    summary: ep.summary || null, // may contain HTML
    runtime: ep.runtime || null,
    image:   ep.image?.medium || null,
  }));
}

// GET /api/shows/:id/cast → calls TVMaze /shows/:id/cast
// Returns only the top 5 cast members for display in the modal.
export async function getShowCast(showId) {
  const data = await get(`/shows/${showId}/cast`);
  return data.slice(0, 5).map((entry) => ({
    name:      entry.person?.name    || null,
    character: entry.character?.name || null,
    image:     entry.person?.image?.medium || null,
  }));
}

// GET /api/shows/:id/seasons → calls TVMaze /shows/:id/seasons
// Returns season metadata (used by the episodes view header).
export async function getShowSeasons(showId) {
  const data = await get(`/shows/${showId}/seasons`);
  return data.map((s) => ({
    number:       s.number,
    episodeCount: s.episodeCount  || null,
    premiereDate: s.premiereDate  || null,
  }));
}
