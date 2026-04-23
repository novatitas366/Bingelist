// Search view — lets the user search for TV shows and add them to their watchlist.
// Calls GET /api/shows/search?q=... and POST /api/watchlist.
// initSearch() is called once from app.js to attach the form listener.

import { request } from './api.js';
import { toast }   from './toast.js';
import { openModal } from './modal.js';
import { stripHtml, buildStatusSelect } from './utils.js';

// DOM references for the search section (see index.html #view-search)
const form    = document.getElementById('searchForm');
const input   = document.getElementById('searchInput');
const results = document.getElementById('searchResults');

// Builds and returns a single show card element.
// All DOM is created programmatically (no HTML template strings) to avoid XSS risks.
function card(show) {
  const el = document.createElement('div');
  el.className = 'card';

  // --- Show poster image ---
  const img = document.createElement('div');
  img.className = 'card-img';
  if (show.image) img.style.backgroundImage = `url("${show.image}")`;
  img.style.cursor = 'pointer';
  img.title = 'View details';
  img.addEventListener('click', () => openModal(show)); // EVENT: click → open modal
  el.appendChild(img);

  const body = document.createElement('div');
  body.className = 'card-body';

  // --- Show title (also clickable to open modal) ---
  const title = document.createElement('div');
  title.className = 'card-title';
  title.textContent = show.name;
  title.style.cursor = 'pointer';
  title.addEventListener('click', () => openModal(show)); // EVENT: click → open modal
  body.appendChild(title);

  // --- Premiere year (optional) ---
  if (show.premiered) {
    const meta = document.createElement('div');
    meta.className = 'muted';
    meta.style.fontSize = '0.8rem';
    meta.textContent = show.premiered.slice(0, 4); // "2008-01-20" → "2008"
    body.appendChild(meta);
  }

  // --- Summary text (HTML stripped) ---
  const summary = document.createElement('div');
  summary.className = 'card-summary';
  summary.textContent = stripHtml(show.summary);
  body.appendChild(summary);

  // --- Action row: status selector + Add button ---
  const actions = document.createElement('div');
  actions.className = 'card-actions';

  // Dropdown for choosing the initial watchlist status (no pre-selection)
  const statusSelect = buildStatusSelect();
  statusSelect.style.flex = '1';

  // Add button — sends a POST request with the Authorization header
  const addBtn = document.createElement('button');
  addBtn.className = 'btn btn-primary';
  addBtn.textContent = 'Add';

  // EVENT: button click → POST /api/watchlist
  addBtn.addEventListener('click', async () => {
    addBtn.disabled = true; // prevent double-submission while request is in flight

    try {
      // HTTP POST with JSON body and Authorization header (auth: true)
      await request('/watchlist', {
        method: 'POST',
        auth: true, // sends "Authorization: Bearer <token>"
        body: {
          show_id:    show.id,
          show_name:  show.name,
          show_image: show.image,
          status:     statusSelect.value, // selected dropdown value
        },
      });
      addBtn.textContent = 'Added ✓'; // visual confirmation — button stays disabled
      toast(`Added "${show.name}"`);
    } catch (error) {
      addBtn.disabled = false;
      if (error.status === 409) {
        // HTTP 409 Conflict = show is already in this user's watchlist
        addBtn.textContent = 'In list';
        toast('Already in watchlist', 'error');
      } else {
        toast(error.message, 'error');
      }
    }
  });

  actions.appendChild(statusSelect);
  actions.appendChild(addBtn);
  body.appendChild(actions);

  el.appendChild(body);
  return el;
}

// Calls the search API and renders results into the grid.
async function runSearch(query) {
  results.innerHTML = '<p class="muted">Searching…</p>';
  try {
    // GET /api/shows/search?q=... — query parameter in the URL
    const shows = await request(`/shows/search?q=${encodeURIComponent(query)}`);
    results.innerHTML = '';
    if (shows.length === 0) {
      results.innerHTML = '<p class="muted">No results.</p>';
      return;
    }
    for (const show of shows) results.appendChild(card(show));
  } catch (error) {
    results.innerHTML = `<p class="error">${error.message}</p>`;
  }
}

// Attaches the form submit listener — called once from app.js on page load.
// EVENT-DRIVEN: the search only runs when the user submits the form.
export function initSearch() {
  form.addEventListener('submit', (event) => {
    event.preventDefault(); // stop the browser from reloading the page (default form behaviour)
    const query = input.value.trim();
    if (query) runSearch(query);
  });
}
