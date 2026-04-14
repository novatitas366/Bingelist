const BASE = 'https://api.tvmaze.com';

async function get(path) {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) {
    const err = new Error(`TVmaze request failed: ${res.status}`);
    err.status = res.status === 404 ? 404 : 502;
    throw err;
  }
  return res.json();
}

export async function searchShows(query) {
  const data = await get(`/search/shows?q=${encodeURIComponent(query)}`);
  return data.map((entry) => {
    const s = entry.show;
    return {
      id: s.id,
      name: s.name,
      image: s.image?.original || s.image?.medium || null,
      summary: s.summary || null,
      premiered: s.premiered || null,
      genres: s.genres || [],
    };
  });
}

export async function getShow(showId) {
  const s = await get(`/shows/${showId}`);
  return {
    id: s.id,
    name: s.name,
    image: s.image?.original || s.image?.medium || null,
    summary: s.summary || null,
    premiered: s.premiered || null,
    genres: s.genres || [],
    network: s.network?.name || s.webChannel?.name || null,
    status: s.status || null,
  };
}

export async function getEpisodes(showId) {
  const data = await get(`/shows/${showId}/episodes`);
  return data.map((ep) => ({
    id: ep.id,
    name: ep.name,
    season: ep.season,
    number: ep.number,
    airdate: ep.airdate || null,
    summary: ep.summary || null,
    runtime: ep.runtime || null,
    image: ep.image?.medium || null,
  }));
}

export async function getShowCast(showId) {
  const data = await get(`/shows/${showId}/cast`);
  return data.slice(0, 5).map((entry) => ({
    name: entry.person?.name || null,
    character: entry.character?.name || null,
    image: entry.person?.image?.medium || null,
  }));
}

export async function getShowSeasons(showId) {
  const data = await get(`/shows/${showId}/seasons`);
  return data.map((s) => ({
    number: s.number,
    episodeCount: s.episodeCount || null,
    premiereDate: s.premiereDate || null,
  }));
}
