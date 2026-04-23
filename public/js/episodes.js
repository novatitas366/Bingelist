import { request } from './api.js';
import { toast } from './toast.js';

const title = document.getElementById('episodesTitle');
const hint = document.getElementById('episodesHint');
const body = document.getElementById('episodesBody');

let currentShow = null;

const STATUS_LABELS = {
  plan_to_watch: 'Plan to watch',
  watching: 'Watching',
  watched: 'Watched',
  dropped: 'Dropped',
};

function stripHtml(html) {
  if (!html) return '';
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || '';
}

function groupBySeason(episodes) {
  const map = new Map();
  for (const ep of episodes) {
    if (!map.has(ep.season)) map.set(ep.season, []);
    map.get(ep.season).push(ep);
  }
  return [...map.entries()].sort((a, b) => a[0] - b[0]);
}

function renderSeason(num, eps, watched, allEps, updateOverall, checkAutoComplete) {
  const sec = document.createElement('div');
  sec.className = 'season';
  if (num === 1) sec.classList.add('open');

  const watchedCount = () => eps.filter((e) => watched.has(e.id)).length;
  const pct = () => eps.length ? (watchedCount() / eps.length) * 100 : 0;
  const isComplete = () => eps.every((e) => watched.has(e.id));

  // --- Season header ---
  const header = document.createElement('button');
  header.className = 'season-header';

  const seasonLabel = document.createElement('span');
  seasonLabel.className = 'season-label';

  const chevron = document.createElement('span');
  chevron.className = 'chevron';
  chevron.textContent = '›';
  seasonLabel.appendChild(chevron);
  seasonLabel.append(`Season ${num}`);
  header.appendChild(seasonLabel);

  const headerRight = document.createElement('div');
  headerRight.className = 'season-header-right';

  const seasonTrack = document.createElement('div');
  seasonTrack.className = 'season-progress-track';
  const seasonFill = document.createElement('div');
  seasonFill.className = 'season-progress-fill';
  seasonFill.style.width = `${pct()}%`;
  seasonTrack.appendChild(seasonFill);

  const countSpan = document.createElement('span');
  countSpan.className = 'count';
  countSpan.textContent = `${watchedCount()} / ${eps.length}`;

  const markAllBtn = document.createElement('button');
  markAllBtn.className = 'btn btn-sm mark-all-btn';
  markAllBtn.textContent = 'Mark all';

  headerRight.appendChild(seasonTrack);
  headerRight.appendChild(countSpan);
  headerRight.appendChild(markAllBtn);
  header.appendChild(headerRight);

  if (isComplete()) header.classList.add('season-complete');
  header.addEventListener('click', () => sec.classList.toggle('open'));
  sec.appendChild(header);

  // --- Update helpers ---
  function updateSeasonHeader() {
    const n = watchedCount();
    countSpan.textContent = `${n} / ${eps.length}`;
    seasonFill.style.width = `${pct()}%`;
    header.classList.toggle('season-complete', isComplete());
  }

  // --- Mark all button ---
  markAllBtn.addEventListener('click', async (e) => {
    e.stopPropagation();
    const unchecked = eps.filter((ep) => !watched.has(ep.id));
    if (!unchecked.length) return;
    markAllBtn.disabled = true;
    try {
      await Promise.all(
        unchecked.map((ep) =>
          request('/episodes', {
            method: 'POST',
            auth: true,
            body: { show_id: currentShow.show_id, episode_id: ep.id },
          })
        )
      );
      for (const ep of unchecked) watched.add(ep.id);
      list.querySelectorAll('.episode').forEach((row) => {
        row.querySelector('input[type="checkbox"]').checked = true;
        row.classList.add('watched');
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

  // --- Episode list ---
  const list = document.createElement('div');
  list.className = 'season-body';

  for (const ep of eps) {
    const row = document.createElement('div');
    row.className = 'episode';

    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.checked = watched.has(ep.id);
    if (cb.checked) row.classList.add('watched');

    cb.addEventListener('change', async () => {
      cb.disabled = true;
      try {
        if (cb.checked) {
          await request('/episodes', {
            method: 'POST',
            auth: true,
            body: { show_id: currentShow.show_id, episode_id: ep.id },
          });
          watched.add(ep.id);
        } else {
          await request(`/episodes/${ep.id}`, { method: 'DELETE', auth: true });
          watched.delete(ep.id);
        }
        row.classList.toggle('watched', cb.checked);
        updateSeasonHeader();
        updateOverall(watched, allEps);
        checkAutoComplete(allEps, watched);
      } catch (e) {
        cb.checked = !cb.checked;
        row.classList.toggle('watched', cb.checked);
        toast(e.message, 'error');
      } finally {
        cb.disabled = false;
      }
    });

    if (ep.image) {
      const thumb = document.createElement('img');
      thumb.className = 'episode-thumb';
      thumb.src = ep.image;
      thumb.alt = '';
      row.appendChild(thumb);
    }

    const info = document.createElement('div');
    info.className = 'episode-info';

    const t = document.createElement('div');
    t.className = 'episode-title';
    t.textContent = `${num}×${String(ep.number ?? '?').padStart(2, '0')} · ${ep.name}`;
    info.appendChild(t);

    const metaParts = [];
    if (ep.airdate) metaParts.push(ep.airdate);
    if (ep.runtime) metaParts.push(`${ep.runtime} min`);
    if (metaParts.length) {
      const meta = document.createElement('div');
      meta.className = 'episode-meta';
      meta.textContent = metaParts.join(' · ');
      info.appendChild(meta);
    }

    const desc = stripHtml(ep.summary);
    if (desc) {
      const descEl = document.createElement('div');
      descEl.className = 'episode-desc';
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

export async function loadEpisodes(item) {
  currentShow = item;
  title.textContent = item.show_name;
  hint.hidden = true;
  body.innerHTML = '<p class="muted">Loading episodes…</p>';

  try {
    const [episodes, watchedIds, seasons] = await Promise.all([
      request(`/shows/${item.show_id}/episodes`),
      request(`/episodes/${item.show_id}`, { auth: true }),
      request(`/shows/${item.show_id}/seasons`).catch(() => []),
    ]);

    if (seasons.length > 0) {
      title.textContent = `${item.show_name} · ${seasons.length} season${seasons.length !== 1 ? 's' : ''}`;
    }

    const watched = new Set(watchedIds);

    body.innerHTML = '';

    // --- Hero header ---
    const hero = document.createElement('div');
    hero.className = 'episodes-hero';

    const poster = document.createElement('div');
    poster.className = 'episodes-poster';
    if (item.show_image) poster.style.backgroundImage = `url("${item.show_image}")`;
    hero.appendChild(poster);

    const heroInfo = document.createElement('div');
    heroInfo.className = 'episodes-hero-info';

    const heroTitle = document.createElement('div');
    heroTitle.className = 'episodes-hero-title';
    heroTitle.textContent = item.show_name;
    heroInfo.appendChild(heroTitle);

    const badge = document.createElement('span');
    if (item.status) {
      badge.className = `status-badge ${item.status}`;
      badge.textContent = STATUS_LABELS[item.status] ?? item.status;
      heroInfo.appendChild(badge);
    }

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

    // --- Shared helpers passed to each season ---
    function updateOverall(w, allEps) {
      const n = allEps.filter((e) => w.has(e.id)).length;
      progressLabel.textContent = `${n} of ${allEps.length} episodes watched`;
      const pct = allEps.length ? (n / allEps.length) * 100 : 0;
      progressFill.style.width = `${pct}%`;
      progressFill.classList.toggle('complete', pct === 100);
    }

    async function checkAutoComplete(allEps, w) {
      const allDone = allEps.every((e) => w.has(e.id));
      if (allDone && currentShow.status !== 'watched') {
        try {
          await request(`/watchlist/${currentShow.id}`, {
            method: 'PATCH',
            auth: true,
            body: { status: 'watched' },
          });
          currentShow.status = 'watched';
          badge.className = `status-badge watched`;
          badge.textContent = STATUS_LABELS['watched'];
          toast('All episodes watched — status set to Watched!', 'success');
        } catch (_) { /* silent */ }
      }
    }

    if (episodes.length === 0) {
      body.insertAdjacentHTML('beforeend', '<p class="muted">No episodes listed.</p>');
      progressLabel.textContent = '0 of 0 episodes watched';
      progressFill.style.width = '0%';
      return;
    }

    // Initial overall progress render
    updateOverall(watched, episodes);

    const seasonGroups = groupBySeason(episodes);
    for (const [num, eps] of seasonGroups) {
      body.appendChild(renderSeason(num, eps, watched, episodes, updateOverall, checkAutoComplete));
    }
  } catch (e) {
    body.innerHTML = `<p class="error">${e.message}</p>`;
  }
}

export function clearEpisodes() {
  currentShow = null;
  title.textContent = 'Episodes';
  hint.hidden = false;
  body.innerHTML = '';
}
