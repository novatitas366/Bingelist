// Episodes view — shows all episodes for one show grouped by season.
// Each episode has a checkbox; checking/unchecking sends POST/DELETE to /api/episodes.
// When all episodes are checked, the watchlist status auto-updates to 'watched'.

import { request } from './api.js';
import { toast }   from './toast.js';
import { stripHtml, STATUS_LABELS } from './utils.js';

// DOM references (from index.html #view-episodes)
const title = document.getElementById('episodesTitle');
const hint  = document.getElementById('episodesHint');
const body  = document.getElementById('episodesBody');

// Tracks the currently displayed show (used by markAllBtn and checkAutoComplete)
let currentShow = null;

// Groups a flat episode array into a Map keyed by season number.
// Returns sorted [ [seasonNum, episodesArray], ... ] pairs.
function groupBySeason(episodes) {
  const map = new Map();
  for (const ep of episodes) {
    if (!map.has(ep.season)) map.set(ep.season, []);
    map.get(ep.season).push(ep);
  }
  return [...map.entries()].sort((a, b) => a[0] - b[0]);
}

// Builds one season section (collapsible panel with episode rows).
// Parameters:
//   num             — season number
//   eps             — episodes in this season
//   watched         — Set<episodeId> of already-watched episodes (shared mutable reference)
//   allEps          — all episodes across all seasons (for overall progress)
//   updateOverall   — callback to refresh the hero progress bar
//   checkAutoComplete — callback to auto-set status to 'watched' when all done
function renderSeason(num, eps, watched, allEps, updateOverall, checkAutoComplete) {
  const sec = document.createElement('div');
  sec.className = 'season';
  if (num === 1) sec.classList.add('open'); // Season 1 starts expanded

  // Helper functions that compute live counts from the shared `watched` Set
  const watchedCount = () => eps.filter((ep) => watched.has(ep.id)).length;
  const pct          = () => eps.length ? (watchedCount() / eps.length) * 100 : 0;
  const isComplete   = () => eps.every((ep) => watched.has(ep.id));

  // --- Season header (click to expand/collapse) ---
  const header = document.createElement('button');
  header.className = 'season-header';

  const seasonLabel = document.createElement('span');
  seasonLabel.className = 'season-label';
  const chevron = document.createElement('span');
  chevron.className  = 'chevron';
  chevron.textContent = '›';
  seasonLabel.appendChild(chevron);
  seasonLabel.append(`Season ${num}`);
  header.appendChild(seasonLabel);

  // Right side of header: progress bar + count + "Mark all" button
  const headerRight = document.createElement('div');
  headerRight.className = 'season-header-right';

  const seasonTrack = document.createElement('div');
  seasonTrack.className = 'season-progress-track';
  const seasonFill = document.createElement('div');
  seasonFill.className = 'season-progress-fill';
  seasonFill.style.width = `${pct()}%`; // initial progress
  seasonTrack.appendChild(seasonFill);

  const countSpan = document.createElement('span');
  countSpan.className  = 'count';
  countSpan.textContent = `${watchedCount()} / ${eps.length}`;

  const markAllBtn = document.createElement('button');
  markAllBtn.className  = 'btn btn-sm mark-all-btn';
  markAllBtn.textContent = 'Mark all';

  headerRight.appendChild(seasonTrack);
  headerRight.appendChild(countSpan);
  headerRight.appendChild(markAllBtn);
  header.appendChild(headerRight);

  if (isComplete()) header.classList.add('season-complete');

  // EVENT: click header → toggle the season open/closed
  header.addEventListener('click', () => sec.classList.toggle('open'));
  sec.appendChild(header);

  // Updates the season header's count and progress bar after a checkbox change
  function updateSeasonHeader() {
    const count = watchedCount();
    countSpan.textContent = `${count} / ${eps.length}`;
    seasonFill.style.width = `${pct()}%`;
    header.classList.toggle('season-complete', isComplete());
  }

  // EVENT: "Mark all" button → POST all unwatched episodes in parallel
  markAllBtn.addEventListener('click', async (event) => {
    event.stopPropagation(); // don't also trigger the header collapse

    const unchecked = eps.filter((ep) => !watched.has(ep.id));
    if (!unchecked.length) return; // nothing to do

    markAllBtn.disabled = true;
    try {
      // Promise.all sends all requests concurrently instead of one-by-one
      await Promise.all(
        unchecked.map((ep) =>
          request('/episodes', {
            method: 'POST',
            auth:   true,
            body:   { show_id: currentShow.show_id, episode_id: ep.id },
          })
        )
      );
      // Update the local Set and all checkboxes in this season
      for (const ep of unchecked) watched.add(ep.id);
      list.querySelectorAll('.episode').forEach((episodeRow) => {
        episodeRow.querySelector('input[type="checkbox"]').checked = true;
        episodeRow.classList.add('watched');
      });
      updateSeasonHeader();
      updateOverall(watched, allEps);
      checkAutoComplete(allEps, watched);
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      markAllBtn.disabled = false;
    }
  });

  // --- Episode rows ---
  const list = document.createElement('div');
  list.className = 'season-body';

  for (const ep of eps) {
    const row = document.createElement('div');
    row.className = 'episode';
    if (watched.has(ep.id)) row.classList.add('watched'); // dim if already watched

    // Checkbox reflects the current watched state
    const cb = document.createElement('input');
    cb.type    = 'checkbox';
    cb.checked = watched.has(ep.id);

    // EVENT: checkbox change → POST (mark) or DELETE (unmark)
    cb.addEventListener('change', async () => {
      cb.disabled = true; // prevent rapid clicking while request is in flight
      try {
        if (cb.checked) {
          // Mark as watched: POST /api/episodes
          await request('/episodes', {
            method: 'POST',
            auth:   true,
            body:   { show_id: currentShow.show_id, episode_id: ep.id },
          });
          watched.add(ep.id);
        } else {
          // Unmark: DELETE /api/episodes/:episode_id
          await request(`/episodes/${ep.id}`, { method: 'DELETE', auth: true });
          watched.delete(ep.id);
        }
        row.classList.toggle('watched', cb.checked);
        updateSeasonHeader();
        updateOverall(watched, allEps);
        checkAutoComplete(allEps, watched);
      } catch (error) {
        // Revert the checkbox if the request failed
        cb.checked = !cb.checked;
        row.classList.toggle('watched', cb.checked);
        toast(error.message, 'error');
      } finally {
        cb.disabled = false;
      }
    });

    // Optional thumbnail image
    if (ep.image) {
      const thumb = document.createElement('img');
      thumb.className = 'episode-thumb';
      thumb.src = ep.image;
      thumb.alt = '';
      row.appendChild(thumb);
    }

    // Episode info: "1×03 · Episode Title"
    const info = document.createElement('div');
    info.className = 'episode-info';

    const episodeTitle = document.createElement('div');
    episodeTitle.className  = 'episode-title';
    // padStart(2, '0') formats single-digit numbers as "01", "02", etc.
    episodeTitle.textContent = `${num}×${String(ep.number ?? '?').padStart(2, '0')} · ${ep.name}`;
    info.appendChild(episodeTitle);

    // Air date and runtime
    const metaParts = [];
    if (ep.airdate) metaParts.push(ep.airdate);
    if (ep.runtime) metaParts.push(`${ep.runtime} min`);
    if (metaParts.length) {
      const meta = document.createElement('div');
      meta.className  = 'episode-meta';
      meta.textContent = metaParts.join(' · ');
      info.appendChild(meta);
    }

    // Description (HTML stripped)
    const desc = stripHtml(ep.summary);
    if (desc) {
      const descEl = document.createElement('div');
      descEl.className  = 'episode-desc';
      descEl.textContent = desc;
      info.appendChild(descEl);
    }

    row.appendChild(cb);
    row.appendChild(info);
    list.appendChild(row);
  }

  sec.appendChild(list);
  return sec;
}

// --- Exported functions ---

// Loads the episodes view for the given watchlist item.
// Called from app.js when the user clicks "Episodes" on a watchlist card.
export async function loadEpisodes(item) {
  currentShow   = item;
  title.textContent = item.show_name;
  hint.hidden   = true;
  body.innerHTML = '<p class="muted">Loading episodes…</p>';

  try {
    // Fetch episodes, already-watched IDs, and season metadata IN PARALLEL.
    // Promise.all waits for all three requests to complete before continuing.
    const [episodes, watchedIds, seasons] = await Promise.all([
      request(`/shows/${item.show_id}/episodes`),            // all episodes from TVMaze
      request(`/episodes/${item.show_id}`, { auth: true }),  // which ones this user watched
      request(`/shows/${item.show_id}/seasons`).catch(() => []), // season count (optional)
    ]);

    if (seasons.length > 0) {
      title.textContent = `${item.show_name} · ${seasons.length} season${seasons.length !== 1 ? 's' : ''}`;
    }

    // Use a Set for O(1) lookups when rendering checkboxes
    const watched = new Set(watchedIds);

    body.innerHTML = '';

    // --- Hero header with poster and overall progress bar ---
    const hero = document.createElement('div');
    hero.className = 'episodes-hero';

    const poster = document.createElement('div');
    poster.className = 'episodes-poster';
    if (item.show_image) poster.style.backgroundImage = `url("${item.show_image}")`;
    hero.appendChild(poster);

    const heroInfo = document.createElement('div');
    heroInfo.className = 'episodes-hero-info';

    const heroTitle = document.createElement('div');
    heroTitle.className  = 'episodes-hero-title';
    heroTitle.textContent = item.show_name;
    heroInfo.appendChild(heroTitle);

    // Status badge (e.g. "Watching")
    const badge = document.createElement('span');
    if (item.status) {
      badge.className  = `status-badge ${item.status}`;
      badge.textContent = STATUS_LABELS[item.status] ?? item.status;
      heroInfo.appendChild(badge);
    }

    // Overall progress bar (across all seasons)
    const overallProgress = document.createElement('div');
    overallProgress.className = 'overall-progress';
    const progressLabel = document.createElement('div');
    progressLabel.className = 'progress-label';
    const progressTrack = document.createElement('div');
    progressTrack.className = 'progress-track';
    const progressFill = document.createElement('div');
    progressFill.className = 'progress-fill';
    progressTrack.appendChild(progressFill);
    overallProgress.appendChild(progressLabel);
    overallProgress.appendChild(progressTrack);
    heroInfo.appendChild(overallProgress);
    hero.appendChild(heroInfo);
    body.appendChild(hero);

    // Updates the overall progress bar — called after every checkbox change
    function updateOverall(watchedSet, allEps) {
      const count = allEps.filter((ep) => watchedSet.has(ep.id)).length;
      const pct = allEps.length ? (count / allEps.length) * 100 : 0;
      progressLabel.textContent = `${count} of ${allEps.length} episodes watched`;
      progressFill.style.width  = `${pct}%`;
      progressFill.classList.toggle('complete', pct === 100); // turns green at 100%
    }

    // Automatically updates watchlist status to 'watched' when every episode is checked.
    // PATCH /api/watchlist/:id  with Authorization header.
    async function checkAutoComplete(allEps, watchedSet) {
      const allDone = allEps.every((ep) => watchedSet.has(ep.id));
      if (allDone && currentShow.status !== 'watched') {
        try {
          await request(`/watchlist/${currentShow.id}`, {
            method: 'PATCH',
            auth:   true,
            body:   { status: 'watched' },
          });
          currentShow.status    = 'watched';
          badge.className       = 'status-badge watched';
          badge.textContent     = STATUS_LABELS['watched'];
          toast('All episodes watched — status set to Watched!', 'success');
        } catch (_) { /* silent — not critical if this fails */ }
      }
    }

    if (episodes.length === 0) {
      body.insertAdjacentHTML('beforeend', '<p class="muted">No episodes listed.</p>');
      progressLabel.textContent = '0 of 0 episodes watched';
      progressFill.style.width  = '0%';
      return;
    }

    updateOverall(watched, episodes); // render initial progress

    // Render one collapsible section per season
    const seasonGroups = groupBySeason(episodes);
    for (const [num, eps] of seasonGroups) {
      body.appendChild(renderSeason(num, eps, watched, episodes, updateOverall, checkAutoComplete));
    }
  } catch (error) {
    body.innerHTML = `<p class="error">${error.message}</p>`;
  }
}

// Resets the episodes view back to its empty state (called on logout).
export function clearEpisodes() {
  currentShow   = null;
  title.textContent = 'Episodes';
  hint.hidden   = false;
  body.innerHTML = '';
}
