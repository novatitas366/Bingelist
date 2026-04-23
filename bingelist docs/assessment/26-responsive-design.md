# Assessment: Responsive Design

**Requirement:** Adapted for at least 3 device types: PC, tablet, smartphone  
**Status: ✅ 4 breakpoints covering all three device categories**

---

## How responsive design works in this app

The CSS in `public/css/styles.css` uses **CSS media queries** (`@media (min-width: Xpx) { ... }`) to change the layout based on screen width. The design is **mobile-first** — the default CSS targets small screens, and rules are progressively added for larger screens.

---

## Breakpoints

### Default — Mobile (< 640px) — Smartphone

- Card grid: **1 column**
- Topbar: brand and tabs **wrap to separate rows** (tabs go below the brand)
- Modal: portrait poster **stacks above** the show details (flex-direction: column)

```css
/* Default (no media query needed — this is the base) */
.grid { grid-template-columns: 1fr; }
.tabs { order: 3; width: 100%; }
```

---

### 640px — Tablet (small)

```css
@media (min-width: 640px) {
  .grid { grid-template-columns: repeat(2, 1fr); }
}
```

Card grid switches to **2 columns**.

---

### 720px — Tablet (larger) / Small desktop

```css
@media (min-width: 720px) {
  .tabs { order: 0; width: auto; flex: 1; }
}
```

Tabs move back **inline** with the brand on the same row (topbar stays single-row).

---

### 1024px — Desktop / PC

```css
@media (min-width: 1024px) {
  .grid { grid-template-columns: repeat(3, 1fr); }
}
```

Card grid switches to **3 columns**.

---

### ≤ 500px — Small phone (modal)

```css
@media (max-width: 500px) {
  .modal-inner { flex-direction: column; }
  .modal-poster { width: 100%; height: 220px; min-width: unset; }
}
```

Show detail modal: poster becomes **full-width banner** above the text instead of a sidebar.

---

## Visual summary

| Screen width | Grid | Topbar tabs | Modal |
|---|---|---|---|
| < 500px | 1 col | Below brand | Poster stacked |
| 500–640px | 1 col | Below brand | Side by side |
| 640–720px | 2 cols | Below brand | Side by side |
| 720–1024px | 2 cols | Inline | Side by side |
| ≥ 1024px | 3 cols | Inline | Side by side |

---

## Additional responsive elements

- All buttons, inputs, and cards use `width: 100%` and percentage-based sizing so they scale naturally
- `flex-wrap: wrap` on `.card-actions` prevents buttons from overflowing on small screens
- `max-width: 1100px` on `.container` centres content on very wide screens
- `max-width: 380px` on `.auth-card` keeps the login form from stretching across the full page

---

## Docs

[[12-styles-css]] · [[11-index-html]] · [[01-index]]
