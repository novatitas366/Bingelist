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
function formatShowBase(show) {
  return {
    id:        show.id,
    name:      show.name,
    // TVMaze provides two sizes; prefer the larger original
    image:     show.image?.original || show.image?.medium || null,
    summary:   show.summary  || null, // may contain HTML — clients must strip it
    premiered: show.premiered || null,
    genres:    show.genres   || [],
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
  const showData = await get(`/shows/${showId}`);
  return {
    ...formatShowBase(showData),
    // A show may air on a traditional network OR a streaming web channel
    network: showData.network?.name || showData.webChannel?.name || null,
    status:  showData.status || null, // e.g. "Running", "Ended"
  };
}

