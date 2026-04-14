import { getToken, getUser } from './api.js';
import { login, register, logout } from './auth.js';
import { initSearch } from './search.js';
import { initWatchlist, refreshWatchlist } from './watchlist.js';
import { loadEpisodes, clearEpisodes } from './episodes.js';
import { toast } from './toast.js';

const views = {
  auth: document.getElementById('view-auth'),
  search: document.getElementById('view-search'),
  watchlist: document.getElementById('view-watchlist'),
  episodes: document.getElementById('view-episodes'),
};

const tabs = document.querySelectorAll('.tab');
const authedEls = document.querySelectorAll('[data-authed-only]');
const currentUserEl = document.getElementById('currentUser');

function showView(name) {
  for (const [k, el] of Object.entries(views)) {
    el.hidden = k !== name;
  }
  tabs.forEach((t) => t.classList.toggle('on', t.dataset.view === name));
}

function setAuthed(authed) {
  authedEls.forEach((el) => (el.hidden = !authed));
  tabs.forEach((t) => { t.disabled = !authed; });
  if (authed) {
    const user = getUser();
    currentUserEl.textContent = user ? `@${user.username}` : '';
    showView('search');
  } else {
    currentUserEl.textContent = '';
    showView('auth');
  }
}

/* --- Auth form --- */

const authForm = document.getElementById('authForm');
const authError = document.getElementById('authError');
const authToggles = document.querySelectorAll('.auth-toggle .toggle');
let authMode = 'login';

authToggles.forEach((t) => {
  t.addEventListener('click', () => {
    authMode = t.dataset.mode;
    authToggles.forEach((b) => b.classList.toggle('on', b === t));
    authForm.querySelector('button[type=submit]').textContent =
      authMode === 'login' ? 'Log in' : 'Sign up';
    authForm.querySelector('input[name=password]').autocomplete =
      authMode === 'login' ? 'current-password' : 'new-password';
    authError.hidden = true;
  });
});

authForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  authError.hidden = true;
  const fd = new FormData(authForm);
  const username = fd.get('username').trim();
  const password = fd.get('password');
  try {
    if (authMode === 'login') {
      await login(username, password);
    } else {
      await register(username, password);
    }
    authForm.reset();
    setAuthed(true);
    await refreshWatchlist();
  } catch (err) {
    authError.textContent = err.message;
    authError.hidden = false;
  }
});

document.getElementById('logoutBtn').addEventListener('click', () => {
  logout();
  clearEpisodes();
  setAuthed(false);
});

/* --- Tabs --- */

tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    const name = tab.dataset.view;
    showView(name);
    if (name === 'watchlist') refreshWatchlist();
  });
});

document.getElementById('backToWatchlist').addEventListener('click', () => {
  showView('watchlist');
  refreshWatchlist();
});

/* --- Init --- */

initSearch();
initWatchlist({
  onViewEpisodes: (item) => {
    showView('episodes');
    loadEpisodes(item);
  },
});

if (getToken()) {
  setAuthed(true);
  refreshWatchlist();
} else {
  setAuthed(false);
}
