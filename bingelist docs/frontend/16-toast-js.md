# public/js/toast.js — Notifications

**Source file:** `public/js/toast.js`  
**Depends on:** nothing  
**Used by:** [[19-search-js]], [[20-watchlist-js]], [[21-episodes-js]]

---

## What this file does

Displays a brief text notification at the bottom of the screen. Auto-hides after 2.5 seconds. Any module in the app can call `toast()` without importing anything else.

---

## Usage

```js
import { toast } from './toast.js';

toast('Added "Breaking Bad"');           // default info style
toast('Already in watchlist', 'error');  // red border
toast('Status updated!', 'success');     // green border
```

---

## Key concepts

- **Module-level state** — `el` and `timer` are declared once when the module loads. Every call to `toast()` reuses the same DOM element rather than creating a new one.
- **`clearTimeout(timer)`** — if a toast is already showing and a new one is called, the auto-hide timer is cancelled and restarted. This prevents the first timer from hiding the second toast prematurely.
- **CSS class toggling** — `classList.toggle('error', condition)` adds the class if condition is true, removes it if false. This means the type can switch correctly between calls.

---

## Visual appearance

Defined in `styles.css` under `.toast`:
- Fixed position at the bottom-centre of the screen
- Slides up with a CSS animation on show
- `.toast.error` → red text/border
- `.toast.success` → green text/border
- Default (info) → neutral panel colour

---

## Related docs

[[12-styles-css]] · [[01-index]]
