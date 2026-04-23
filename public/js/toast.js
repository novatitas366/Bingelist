// Tiny notification system — displays a brief message at the bottom of the screen.
// Usage: toast('Added!') / toast('Something went wrong', 'error') / toast('Saved', 'success')

const el = document.getElementById('toast'); // the <div id="toast"> in index.html
let timer = null; // holds the auto-hide timeout so we can cancel it

export function toast(message, type = 'info') {
  el.textContent = message;

  // Toggle CSS classes to control colour (see .toast.error / .toast.success in styles.css)
  el.classList.toggle('error',   type === 'error');
  el.classList.toggle('success', type === 'success');

  el.hidden = false; // make the toast visible

  // Cancel any previous timer — prevents an earlier toast from hiding this new one
  clearTimeout(timer);

  // Auto-hide after 2.5 seconds
  timer = setTimeout(() => {
    el.hidden = true;
  }, 2500);
}
