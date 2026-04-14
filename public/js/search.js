import { request } from './api.js';
import { toast } from './toast.js';
import { openModal } from './modal.js';

const form = document.getElementById('searchForm');
const input = document.getElementById('searchInput');
const results = document.getElementById('searchResults');

function stripHtml(html) {
  if (!html) return '';
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || '';
}

function card(show) {
  const el = document.createElement('div');
  el.className = 'card';

  const img = document.createElement('div');
  img.className = 'card-img';
  if (show.image) img.style.backgroundImage = `url("${show.image}")`;
  img.style.cursor = 'pointer';
  img.title = 'View details';
  img.addEventListener('click', () => openModal(show));
  el.appendChild(img);

  const body = document.createElement('div');
  body.className = 'card-body';

  const title = document.createElement('div');
  title.className = 'card-title';
  title.textContent = show.name;
  title.style.cursor = 'pointer';
  title.addEventListener('click', () => openModal(show));
  body.appendChild(title);

  if (show.premiered) {
    const meta = document.createElement('div');
    meta.className = 'muted';
    meta.style.fontSize = '0.8rem';
    meta.textContent = show.premiered.slice(0, 4);
    body.appendChild(meta);
  }

  const summary = document.createElement('div');
  summary.className = 'card-summary';
  summary.textContent = stripHtml(show.summary);
  body.appendChild(summary);

  const actions = document.createElement('div');
  actions.className = 'card-actions';

  const statusSelect = document.createElement('select');
  for (const [v, label] of [
    ['plan_to_watch', 'Plan to watch'],
    ['watching', 'Watching'],
    ['watched', 'Watched'],
    ['dropped', 'Dropped'],
  ]) {
    const opt = document.createElement('option');
    opt.value = v;
    opt.textContent = label;
    statusSelect.appendChild(opt);
  }
  statusSelect.style.flex = '1';

  const addBtn = document.createElement('button');
  addBtn.className = 'btn btn-primary';
  addBtn.textContent = 'Add';
  addBtn.addEventListener('click', async () => {
    addBtn.disabled = true;
    try {
      await request('/watchlist', {
        method: 'POST',
        auth: true,
        body: {
          show_id: show.id,
          show_name: show.name,
          show_image: show.image,
          status: statusSelect.value,
        },
      });
      addBtn.textContent = 'Added ✓';
      toast(`Added "${show.name}"`);
    } catch (e) {
      addBtn.disabled = false;
      if (e.status === 409) {
        addBtn.textContent = 'In list';
        toast('Already in watchlist', 'error');
      } else {
        toast(e.message, 'error');
      }
    }
  });

  actions.appendChild(statusSelect);
  actions.appendChild(addBtn);
  body.appendChild(actions);

  el.appendChild(body);
  return el;
}

async function runSearch(q) {
  results.innerHTML = '<p class="muted">Searching…</p>';
  try {
    const shows = await request(`/shows/search?q=${encodeURIComponent(q)}`);
    results.innerHTML = '';
    if (shows.length === 0) {
      results.innerHTML = '<p class="muted">No results.</p>';
      return;
    }
    for (const show of shows) results.appendChild(card(show));
  } catch (e) {
    results.innerHTML = `<p class="error">${e.message}</p>`;
  }
}

export function initSearch() {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const q = input.value.trim();
    if (q) runSearch(q);
  });
}
