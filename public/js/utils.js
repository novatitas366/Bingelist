// Shared utilities used across multiple frontend modules.

// Removes HTML tags from TVMaze summary strings before displaying as plain text.
// TVMaze returns summaries like "<p>A chemistry teacher <b>breaks bad</b>.</p>"
export function stripHtml(html) {
  if (!html) return '';
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || '';
}

// Human-readable labels for the four watchlist statuses.
// Used in watchlist.js (card badges + dropdowns) and episodes.js (hero badge).
export const STATUS_LABELS = {
  plan_to_watch: 'Plan to watch',
  watching:      'Watching',
  watched:       'Watched',
  dropped:       'Dropped',
};

// Builds a <select> dropdown with all four status options.
// Pass selectedValue to pre-select the current status (e.g. on the watchlist).
// Used in search.js (no pre-selection) and watchlist.js (pre-selects current status).
export function buildStatusSelect(selectedValue = null) {
  const select = document.createElement('select');
  for (const [v, label] of Object.entries(STATUS_LABELS)) {
    const opt = document.createElement('option');
    opt.value = v;
    opt.textContent = label;
    if (v === selectedValue) opt.selected = true;
    select.appendChild(opt);
  }
  return select;
}
