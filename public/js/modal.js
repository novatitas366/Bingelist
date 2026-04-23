// Show detail modal — displays metadata and cast for a TV show.
// Opened from search cards and watchlist cards via openModal(showData).
// Three ways to close: the ✕ button, clicking the dark backdrop, or pressing Escape.

import { request } from './api.js';

// DOM references — these elements live in index.html inside #modal-backdrop
const backdrop  = document.getElementById('modal-backdrop');
const closeBtn  = document.getElementById('modalClose');
const posterEl  = document.getElementById('modalPoster');
const titleEl   = document.getElementById('modalTitle');
const metaEl    = document.getElementById('modalMeta');
const summaryEl = document.getElementById('modalSummary');
const castEl    = document.getElementById('modalCast');

// TVMaze summaries contain HTML tags (<b>, <p>, etc.) — strip them before displaying.
function stripHtml(html) {
  if (!html) return '';
  const tmp = document.createElement('div');
  tmp.innerHTML = html; // parse the HTML string into a real DOM node
  return tmp.textContent || ''; // .textContent reads only the text, no tags
}

// Opens the modal and populates it with show data.
// The show object comes from either the search results or the /api/shows/:id endpoint.
export function openModal({ id, name, image, summary, premiered, genres, network, status }) {
  titleEl.textContent = name;
  posterEl.style.backgroundImage = image ? `url("${image}")` : 'none';

  // Build the row of metadata tags (year, status, network, genres)
  const tags = [];
  if (premiered) tags.push(premiered.slice(0, 4)); // just the year
  if (status)    tags.push(status);
  if (network)   tags.push(network);
  if (genres?.length) genres.forEach((g) => tags.push(g));
  // Each tag becomes a <span> styled as a pill badge
  metaEl.innerHTML = tags.map((t) => `<span>${t}</span>`).join('');

  summaryEl.textContent = stripHtml(summary) || 'No description available.';

  // Clear previous cast while the new fetch runs
  castEl.innerHTML = '';

  // Fetch cast asynchronously — the modal opens immediately, cast loads in after.
  // .then() is used instead of await so we don't block the modal from showing.
  if (id) {
    request(`/shows/${id}/cast`).then((cast) => {
      if (!cast || !cast.length) return;

      const section = document.createElement('div');
      section.className = 'cast-section';

      const heading = document.createElement('p');
      heading.className = 'cast-title';
      heading.textContent = 'Cast';
      section.appendChild(heading);

      const list = document.createElement('ul');
      list.className = 'cast-list';

      for (const member of cast) {
        const li = document.createElement('li');
        li.className = 'cast-member';

        // Use <img> if there's a photo, otherwise a plain <div> placeholder
        const imgEl = document.createElement(member.image ? 'img' : 'div');
        imgEl.className = 'cast-img';
        if (member.image) {
          imgEl.src = member.image;
          imgEl.alt = member.name || '';
        }
        li.appendChild(imgEl);

        const info = document.createElement('div');
        info.className = 'cast-info';

        const nameEl = document.createElement('span');
        nameEl.className = 'cast-name';
        nameEl.textContent = member.name || '';
        info.appendChild(nameEl);

        if (member.character) {
          const charEl = document.createElement('span');
          charEl.className = 'cast-char';
          charEl.textContent = member.character;
          info.appendChild(charEl);
        }

        li.appendChild(info);
        list.appendChild(li);
      }

      section.appendChild(list);
      castEl.appendChild(section);
    }).catch(() => {}); // silently ignore cast fetch errors — not critical
  }

  backdrop.hidden = false;
  document.body.style.overflow = 'hidden'; // prevent background page from scrolling
  closeBtn.focus(); // move keyboard focus into the modal for accessibility
}

export function closeModal() {
  backdrop.hidden = true;
  document.body.style.overflow = ''; // restore normal scrolling
}

// --- Three ways to close the modal ---

// 1. The ✕ button
closeBtn.addEventListener('click', closeModal);

// 2. Click the dark backdrop outside the modal box
backdrop.addEventListener('click', (e) => {
  if (e.target === backdrop) closeModal(); // only close if the backdrop itself was clicked, not the modal
});

// 3. Escape key — standard keyboard behaviour for dialogs
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !backdrop.hidden) closeModal();
});
