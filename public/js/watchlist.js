// Watchlist view — shows the user's saved shows with status/note editing and removal.
// Exported functions called by app.js:
//   initWatchlist() — set up filter chips
//   refreshWatchlist() — fetch latest data from the server and re-render

import { request } from './api.js';
import { toast }   from './toast.js';
import { STATUS_LABELS, buildStatusSelect } from './utils.js';

// DOM references (from index.html #view-watchlist)
const grid      = document.getElementById('watchlistGrid');
const empty     = document.getElementById('watchlistEmpty');
const filterBar = document.getElementById('statusFilter');

// In-memory state — refreshWatchlist() keeps this up to date
let items         = [];        // full list fetched from the server
let currentFilter = 'all';     // active filter chip value

// Builds a card element for one watchlist entry.
function card(item) {
  const el = document.createElement('div');
  el.className = 'card';

  // --- Poster image ---
  const img = document.createElement('div');
  img.className = 'card-img';
  if (item.show_image) img.style.backgroundImage = `url("${item.show_image}")`;
  el.appendChild(img);

  const body = document.createElement('div');
  body.className = 'card-body';

  // --- Title ---
  const title = document.createElement('div');
  title.className = 'card-title';
  title.textContent = item.show_name;
  body.appendChild(title);

  // --- Status badge (read-only colour indicator) ---
  const badge = document.createElement('span');
  badge.className = `status-badge ${item.status}`;
  badge.textContent = STATUS_LABELS[item.status];
  body.appendChild(badge);

  // --- Status dropdown (editable, pre-selects current status) ---
  const statusRow    = document.createElement('label');
  const statusSelect = buildStatusSelect(item.status);

  // EVENT: dropdown change → PATCH /api/watchlist/:id
  statusSelect.addEventListener('change', async () => {
    try {
      await request(`/watchlist/${item.id}`, {
        method: 'PATCH',
        auth:   true,
        body:   { status: statusSelect.value },
      });
      // Update local state and the badge without a full page re-fetch
      item.status = statusSelect.value;
      badge.className   = `status-badge ${item.status}`;
      badge.textContent = STATUS_LABELS[item.status];
      render(); // re-render so the filter chips hide/show this card correctly
    } catch (error) {
      toast(error.message, 'error');
    }
  });
  statusRow.textContent = 'Status';
  statusRow.appendChild(statusSelect);
  body.appendChild(statusRow);

  // --- Note textarea (editable) ---
  const noteLabel = document.createElement('label');
  noteLabel.textContent = 'Note';
  const noteInput = document.createElement('textarea');
  noteInput.rows        = 2;
  noteInput.value       = item.note || '';
  noteInput.placeholder = 'Add a note…';

  let noteTimer = null; // debounce timer handle

  // EVENT: typing in the textarea → debounced PATCH after 500ms of silence
  // Debounce prevents sending a PATCH on every single keystroke.
  noteInput.addEventListener('input', () => {
    clearTimeout(noteTimer);
    noteTimer = setTimeout(async () => {
      try {
        await request(`/watchlist/${item.id}`, {
          method: 'PATCH',
          auth:   true,
          body:   { note: noteInput.value },
        });
        item.note = noteInput.value; // keep local state in sync
      } catch (error) {
        toast(error.message, 'error');
      }
    }, 500); // wait 500ms after the last keystroke before sending
  });
  noteLabel.appendChild(noteInput);
  body.appendChild(noteLabel);

  // --- Action buttons ---
  const actions = document.createElement('div');
  actions.className = 'card-actions';

  // Remove button — DELETE /api/watchlist/:id after confirmation
  const deleteBtn = document.createElement('button');
  deleteBtn.className   = 'btn btn-danger';
  deleteBtn.textContent = 'Remove';
  deleteBtn.addEventListener('click', async () => {
    // Confirm dialog blocks until the user clicks OK or Cancel
    if (!confirm(`Remove "${item.show_name}" from your watchlist?`)) return;
    try {
      // HTTP DELETE with Authorization header
      await request(`/watchlist/${item.id}`, { method: 'DELETE', auth: true });
      items = items.filter((existingItem) => existingItem.id !== item.id); // remove from in-memory list
      render(); // re-render without the deleted item
      toast('Removed');
    } catch (error) {
      toast(error.message, 'error');
    }
  });

  actions.appendChild(deleteBtn);
  body.appendChild(actions);

  el.appendChild(body);
  return el;
}

// Renders the filtered list of items into the grid.
// Reads from the in-memory `items` array — no network request.
function render() {
  grid.innerHTML = '';
  const filtered =
    currentFilter === 'all'
      ? items
      : items.filter((item) => item.status === currentFilter);

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

// Fetches the watchlist from the server and re-renders.
// GET /api/watchlist with Authorization header.
// Called by app.js on login and when switching to the watchlist tab.
export async function refreshWatchlist() {
  try {
    items = await request('/watchlist', { auth: true });
    render();
  } catch (error) {
    toast(error.message, 'error');
  }
}

export function initWatchlist() {

  // EVENT: click on any filter chip → update filter and re-render
  filterBar.addEventListener('click', (event) => {
    const btn = event.target.closest('.chip'); // works even if a child element was clicked
    if (!btn) return;
    for (const chip of filterBar.querySelectorAll('.chip')) {
      chip.classList.remove('on');
    }
    btn.classList.add('on');
    currentFilter = btn.dataset.status; // 'all' | 'plan_to_watch' | 'watching' | ...
    render();
  });
}
