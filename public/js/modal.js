import { request } from './api.js';

const backdrop = document.getElementById('modal-backdrop');
const closeBtn = document.getElementById('modalClose');
const posterEl = document.getElementById('modalPoster');
const titleEl = document.getElementById('modalTitle');
const metaEl = document.getElementById('modalMeta');
const summaryEl = document.getElementById('modalSummary');
const castEl = document.getElementById('modalCast');

function stripHtml(html) {
  if (!html) return '';
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || '';
}

export function openModal({ id, name, image, summary, premiered, genres, network, status }) {
  titleEl.textContent = name;
  posterEl.style.backgroundImage = image ? `url("${image}")` : 'none';

  const tags = [];
  if (premiered) tags.push(premiered.slice(0, 4));
  if (status) tags.push(status);
  if (network) tags.push(network);
  if (genres?.length) genres.forEach((g) => tags.push(g));
  metaEl.innerHTML = tags.map((t) => `<span>${t}</span>`).join('');

  summaryEl.textContent = stripHtml(summary) || 'No description available.';

  castEl.innerHTML = '';
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
    }).catch(() => {});
  }

  backdrop.hidden = false;
  document.body.style.overflow = 'hidden';
  closeBtn.focus();
}

export function closeModal() {
  backdrop.hidden = true;
  document.body.style.overflow = '';
}

closeBtn.addEventListener('click', closeModal);
backdrop.addEventListener('click', (e) => {
  if (e.target === backdrop) closeModal();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !backdrop.hidden) closeModal();
});
