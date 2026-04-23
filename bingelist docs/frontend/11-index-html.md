# public/index.html — HTML skeleton

**Source file:** `public/index.html`  
**Depends on:** [[12-styles-css]], [[13-app-js]]  
**Used by:** browser (served by Express static middleware)

---

## What this file does

The single HTML page for the whole app (Single Page Application). All visible content is built by switching between four `<section>` elements using the `hidden` attribute. JavaScript modules handle everything else.

---

## Key concepts

- **SPA (Single Page Application)** — the browser loads this one HTML file once. JavaScript then shows/hides sections and makes API calls without full page reloads.
- **`hidden` attribute** — a standard HTML attribute that makes an element invisible. `app.js` sets `el.hidden = true/false` to switch views.
- **`data-*` attributes** — custom HTML attributes that store data for JavaScript. Examples:
  - `data-view="search"` — tells `app.js` which view to show when a tab is clicked
  - `data-mode="login"` — tells `app.js` which auth mode is active
  - `data-status="watching"` — tells `watchlist.js` which filter is selected
  - `data-authed-only` — marks elements that should only be visible when logged in
- **`type="module"`** — on the `<script>` tag, enables ES `import`/`export` syntax in the browser. Only `app.js` is loaded; it imports everything else.

---

## Structure

```
<header class="topbar">          ← always visible
  brand | tabs | auth area

<main class="container">
  <section id="view-auth">       ← login/register form
  <section id="view-search">     ← search form + results grid
  <section id="view-watchlist">  ← filter chips + watchlist grid
  <section id="view-episodes">   ← season/episode list

<div id="toast">                 ← notification bar (bottom)
<div id="modal-backdrop">        ← show detail popup (fixed overlay)

<script type="module" src="/js/app.js">
```

---

## Which JS file controls each section?

| Section | Controller |
|---|---|
| `#view-auth` | [[13-app-js]] (auth form handling) |
| `#view-search` | [[19-search-js]] |
| `#view-watchlist` | [[20-watchlist-js]] |
| `#view-episodes` | [[21-episodes-js]] |
| `#toast` | [[16-toast-js]] |
| `#modal-backdrop` | [[18-modal-js]] |
| Tabs + view switching | [[13-app-js]] |

---

## Related docs

[[13-app-js]] · [[12-styles-css]] · [[01-index]]
