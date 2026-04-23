// Main coordinator — the single entry point loaded by index.html.
// Owns: view switching, tab state, the auth form, and wiring all modules together.
// Every other JS module exports functions; this file calls them in response to user events.

import { getToken, getUser }         from './api.js';
import { login, register, logout }   from './auth.js';
import { initSearch }                from './search.js';
import { initWatchlist, refreshWatchlist } from './watchlist.js';
import { loadEpisodes, clearEpisodes }     from './episodes.js';
import { toast }                     from './toast.js';

// Named references to the four <section> elements in index.html
// Each section is hidden/shown by toggling the `hidden` attribute.
const views = {
  auth:      document.getElementById('view-auth'),
  search:    document.getElementById('view-search'),
  watchlist: document.getElementById('view-watchlist'),
  episodes:  document.getElementById('view-episodes'),
};

const tabs          = document.querySelectorAll('.tab');         // the nav tab buttons
const authedEls     = document.querySelectorAll('[data-authed-only]'); // elements only visible when logged in
const currentUserEl = document.getElementById('currentUser');   // username display in the header

// Shows the named view and hides all others.
// Also highlights the matching tab button.
function showView(name) {
  // hide all views, then show only the one we want
  for (const key in views) {
    views[key].hidden = key !== name;
  }
  // highlight the matching tab, un-highlight the rest
  for (const tab of tabs) {
    if (tab.dataset.view === name) {
      tab.classList.add('on');
    } else {
      tab.classList.remove('on');
    }
  }
}

// Updates the UI for authenticated vs unauthenticated state.
// Called after login, register, and logout.
function setAuthed(authed) {
  // Show/hide elements marked with data-authed-only (e.g. the logout button)
  for (const el of authedEls) {
    el.hidden = !authed;
  }
  // Disable nav tabs when logged out — no token means any API call would fail with 401
  for (const tab of tabs) {
    tab.disabled = !authed;
  }

  if (authed) {
    const user = getUser();
    currentUserEl.textContent = user ? `@${user.username}` : '';
    showView('search'); // default view after login
  } else {
    currentUserEl.textContent = '';
    showView('auth'); // send unauthenticated users to the login form
  }
}

// --- Auth form ---

const authForm    = document.getElementById('authForm');
const authError   = document.getElementById('authError');
const authToggles = document.querySelectorAll('.auth-toggle .toggle'); // Login / Sign up buttons
let authMode = 'login'; // tracks whether the form is in login or register mode

// EVENT: clicking Login/Sign up toggle switches the form mode
for (const toggle of authToggles) {
  toggle.addEventListener('click', () => {
    authMode = toggle.dataset.mode; // 'login' or 'register'
    for (const btn of authToggles) {
      if (btn === toggle) {
        btn.classList.add('on');
      } else {
        btn.classList.remove('on');
      }
    }
    const submitBtn = authForm.querySelector('button[type=submit]');
    const passwordInput = authForm.querySelector('input[name=password]');

    if (authMode === 'login') {
      submitBtn.textContent = 'Log in';
      passwordInput.autocomplete = 'current-password';
    } else {
      submitBtn.textContent = 'Sign up';
      passwordInput.autocomplete = 'new-password';
    }
    authError.hidden = true; // clear any previous error
  });
}

// EVENT: form submit → call login() or register() from auth.js
authForm.addEventListener('submit', async (event) => {
  event.preventDefault(); // prevent the browser's default full-page form submission
  authError.hidden = true;
  const fd       = new FormData(authForm);
  const username = fd.get('username').trim();
  const password = fd.get('password');

  try {
    if (authMode === 'login') {
      await login(username, password);    // POST /api/auth/login
    } else {
      await register(username, password); // POST /api/auth/register
    }
    authForm.reset();
    setAuthed(true);
    await refreshWatchlist(); // load the watchlist immediately after login
  } catch (err) {
    authError.textContent = err.message; // display server error message below the form
    authError.hidden = false;
  }
});

// EVENT: logout button click → clear token and show auth form
document.getElementById('logoutBtn').addEventListener('click', () => {
  logout();        // clears JWT from localStorage
  clearEpisodes(); // reset episodes view so stale data isn't shown after re-login
  setAuthed(false);
});

// --- Tab navigation ---

// EVENT: tab click → switch to the clicked view
for (const tab of tabs) {
  tab.addEventListener('click', () => {
    const name = tab.dataset.view;
    showView(name);
    // Always refresh the watchlist when the user navigates to it
    if (name === 'watchlist') refreshWatchlist();
  });
}

// EVENT: "← Back" button in the episodes view → go back to the watchlist
document.getElementById('backToWatchlist').addEventListener('click', () => {
  showView('watchlist');
  refreshWatchlist();
});

// --- Initialise modules ---

// initSearch attaches the search form submit listener
initSearch();

// initWatchlist sets up the filter chips and provides the callback
// that switches to the episodes view when a user clicks "Episodes" on a card
initWatchlist({
  onViewEpisodes: (item) => {
    showView('episodes');
    loadEpisodes(item); // load episode data for the selected show
  },
});

// --- Session re-hydration on page load ---
// If a JWT is already in localStorage (from a previous session), skip the login form.
if (getToken()) {
  setAuthed(true);      // show the authenticated UI immediately
  refreshWatchlist();   // load the user's watchlist in the background
} else {
  setAuthed(false);     // no token → show the auth form
}
