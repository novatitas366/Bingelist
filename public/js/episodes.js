import { request } from './api.js';
import { toast } from './toast.js';

const title = document.getElementById('episodesTitle');
const hint = document.getElementById('episodesHint');
const body = document.getElementById('episodesBody');

let currentShow = null;

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

function renderSeason(num, eps, watched, allEps) {
  const sec = document.createElement('div');
  sec.className = 'season';
  if (num === 1) sec.classList.add('open');

  const header = document.createElement('button');
  header.className = 'season-header';
  const watchedCount = eps.filter((e) => watched.has(e.id)).length;
  header.innerHTML = `<span>Season ${num}</span><span class="count">${watchedCount} / ${eps.length}</span>`;
  if (eps.every((e) => watched.has(e.id))) header.classList.add('season-complete');
  header.addEventListener('click', () => sec.classList.toggle('open'));
  sec.appendChild(header);

  const list = document.createElement('div');
  list.className = 'season-body';

  for (const ep of eps) {
    const row = document.createElement('div');
    row.className = 'episode';

    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.checked = watched.has(ep.id);
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

        const count = eps.filter((e) => watched.has(e.id)).length;
        header.querySelector('.count').textContent = `${count} / ${eps.length}`;
        header.classList.toggle('season-complete', eps.every((e) => watched.has(e.id)));

        const allDone = allEps.every((e) => watched.has(e.id));
        if (allDone && currentShow.status !== 'watched') {
          try {
            await request(`/watchlist/${currentShow.id}`, {
              method: 'PATCH',
              auth: true,
              body: { status: 'watched' },
            });
            currentShow.status = 'watched';
            toast('All episodes watched — status set to Watched!', 'success');
          } catch (_) { /* silent */ }
        }
      } catch (e) {
        cb.checked = !cb.checked;
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
    if (episodes.length === 0) {
      body.innerHTML = '<p class="muted">No episodes listed.</p>';
      return;
    }
    const seasonGroups = groupBySeason(episodes);
    for (const [num, eps] of seasonGroups) {
      body.appendChild(renderSeason(num, eps, watched, episodes));
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
