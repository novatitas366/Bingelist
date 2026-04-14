import { request } from './api.js';
import { toast } from './toast.js';
import { openModal } from './modal.js';

const grid = document.getElementById('watchlistGrid');
const empty = document.getElementById('watchlistEmpty');
const filterBar = document.getElementById('statusFilter');

let items = [];
let currentFilter = 'all';
let onViewEpisodes = null;

const STATUS_LABELS = {
  plan_to_watch: 'Plan to watch',
  watching: 'Watching',
  watched: 'Watched',
  dropped: 'Dropped',
};

function card(item) {
  const el = document.createElement('div');
  el.className = 'card';

  async function showDetails() {
    try {
      const data = await request(`/shows/${item.show_id}`);
      openModal(data);
    } catch (e) {
      toast(e.message, 'error');
    }
  }

  const img = document.createElement('div');
  img.className = 'card-img';
  if (item.show_image) img.style.backgroundImage = `url("${item.show_image}")`;
  img.style.cursor = 'pointer';
  img.title = 'View details';
  img.addEventListener('click', showDetails);
  el.appendChild(img);

  const body = document.createElement('div');
  body.className = 'card-body';

  const title = document.createElement('div');
  title.className = 'card-title';
  title.textContent = item.show_name;
  title.style.cursor = 'pointer';
  title.addEventListener('click', showDetails);
  body.appendChild(title);

  const badge = document.createElement('span');
  badge.className = `status-badge ${item.status}`;
  badge.textContent = STATUS_LABELS[item.status];
  body.appendChild(badge);

  const statusRow = document.createElement('label');
  const statusSelect = document.createElement('select');
  for (const [v, label] of Object.entries(STATUS_LABELS)) {
    const opt = document.createElement('option');
    opt.value = v;
    opt.textContent = label;
    if (v === item.status) opt.selected = true;
    statusSelect.appendChild(opt);
  }
  statusSelect.addEventListener('change', async () => {
    try {
      await request(`/watchlist/${item.id}`, {
        method: 'PATCH',
        auth: true,
        body: { status: statusSelect.value },
      });
      item.status = statusSelect.value;
      badge.className = `status-badge ${item.status}`;
      badge.textContent = STATUS_LABELS[item.status];
      render();
    } catch (e) {
      toast(e.message, 'error');
    }
  });
  statusRow.textContent = 'Status';
  statusRow.appendChild(statusSelect);
  body.appendChild(statusRow);

  const noteLabel = document.createElement('label');
  noteLabel.textContent = 'Note';
  const noteInput = document.createElement('textarea');
  noteInput.rows = 2;
  noteInput.value = item.note || '';
  noteInput.placeholder = 'Add a note…';
  let noteTimer = null;
  noteInput.addEventListener('input', () => {
    clearTimeout(noteTimer);
    noteTimer = setTimeout(async () => {
      try {
        await request(`/watchlist/${item.id}`, {
          method: 'PATCH',
          auth: true,
          body: { note: noteInput.value },
        });
        item.note = noteInput.value;
      } catch (e) {
        toast(e.message, 'error');
      }
    }, 500);
  });
  noteLabel.appendChild(noteInput);
  body.appendChild(noteLabel);

  const actions = document.createElement('div');
  actions.className = 'card-actions';

  const episodesBtn = document.createElement('button');
  episodesBtn.className = 'btn';
  episodesBtn.textContent = 'Episodes';
  episodesBtn.addEventListener('click', () => {
    if (onViewEpisodes) onViewEpisodes(item);
  });

  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'btn btn-danger';
  deleteBtn.textContent = 'Remove';
  deleteBtn.addEventListener('click', async () => {
    if (!confirm(`Remove "${item.show_name}" from your watchlist?`)) return;
    try {
      await request(`/watchlist/${item.id}`, { method: 'DELETE', auth: true });
      items = items.filter((i) => i.id !== item.id);
      render();
      toast('Removed');
    } catch (e) {
      toast(e.message, 'error');
    }
  });

  actions.appendChild(episodesBtn);
  actions.appendChild(deleteBtn);
  body.appendChild(actions);

  el.appendChild(body);
  return el;
}

function render() {
  grid.innerHTML = '';
  const filtered =
    currentFilter === 'all'
      ? items
      : items.filter((i) => i.status === currentFilter);

  if (filtered.length === 0) {
    empty.hidden = false;
    empty.textContent =
      items.length === 0
        ? 'Nothing here yet — add a show from the Search tab.'
        : 'No shows match this filter.';
    return;
  }
  empty.hidden = true;
  for (const item of filtered) grid.appendChild(card(item));
}

export async function refreshWatchlist() {
  try {
    items = await request('/watchlist', { auth: true });
    render();
  } catch (e) {
    toast(e.message, 'error');
  }
}

export function initWatchlist({ onViewEpisodes: cb }) {
  onViewEpisodes = cb;
  filterBar.addEventListener('click', (e) => {
    const btn = e.target.closest('.chip');
    if (!btn) return;
    filterBar.querySelectorAll('.chip').forEach((b) => b.classList.remove('on'));
    btn.classList.add('on');
    currentFilter = btn.dataset.status;
    render();
  });
}
