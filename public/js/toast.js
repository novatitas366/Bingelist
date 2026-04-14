const el = document.getElementById('toast');
let timer = null;

export function toast(message, type = 'info') {
  el.textContent = message;
  el.classList.toggle('error', type === 'error');
  el.classList.toggle('success', type === 'success');
  el.hidden = false;
  clearTimeout(timer);
  timer = setTimeout(() => {
    el.hidden = true;
  }, 2500);
}
