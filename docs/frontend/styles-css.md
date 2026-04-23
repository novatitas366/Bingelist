# public/css/styles.css — Styling

**Source file:** `public/css/styles.css`  
**Depends on:** nothing  
**Used by:** [[index-html]]

---

## What this file does

All CSS for the app — layout, colours, typography, components, animations, and responsive breakpoints. No CSS framework; everything is custom.

---

## Key concepts

- **CSS Custom Properties (variables)** — defined in `:root { --name: value }`, used anywhere as `var(--name)`. Changing `--primary` here changes the purple accent everywhere.
- **Flexbox** — used for row/column layouts throughout (topbar, card-body, cast-member, etc.)
- **CSS Grid** — used for the show card grid (`display: grid; grid-template-columns: repeat(N, 1fr)`)
- **`@media` queries** — conditional CSS applied only at certain screen widths. This is how Responsive Design works.
- **`hidden` attribute** — `[hidden] { display: none }` is a browser default; some elements use `backdrop:not([hidden]) { display: flex }` to control how they un-hide.
- **CSS animations** — `@keyframes fade` on `.view` and `@keyframes modal-in` on `.modal` provide entrance animations.
- **BEM-like naming** — block (`card`), element (`card-body`, `card-title`), modifier (`btn-primary`, `btn-danger`)

---

## Responsive breakpoints

| Breakpoint | Applies to | Change |
|---|---|---|
| default (< 640px) | grid | 1 column → **mobile** |
| `@media (min-width: 640px)` | grid | 2 columns → **tablet** |
| `@media (min-width: 1024px)` | grid | 3 columns → **desktop** |
| `@media (min-width: 720px)` | topbar tabs | wrap below → inline |
| `@media (max-width: 500px)` | modal | poster + content side-by-side → stacked |

---

## Major sections

| Section | Class prefix | What it styles |
|---|---|---|
| Design tokens | `:root` | Colours, shadows, radius |
| Topbar | `.topbar`, `.brand`, `.tabs`, `.tab` | Navigation header |
| Buttons | `.btn`, `.btn-primary`, `.btn-danger`, `.btn-ghost`, `.btn-sm` | All buttons |
| Forms | `input`, `select`, `textarea`, `label` | All form controls |
| Auth card | `.auth-card`, `.auth-toggle` | Login/register form |
| Card grid | `.grid`, `.card`, `.card-body` | Show cards |
| Status badges | `.status-badge` | Colour-coded status pills |
| Filter chips | `.chip` | Watchlist filter buttons |
| Episodes | `.season`, `.episode`, `.progress-*` | Episode tracking UI |
| Modal | `.modal-backdrop`, `.modal`, `.cast-*` | Show detail popup |
| Toast | `.toast` | Notification bar |

---

## Status badge colours

| Status | Colour | CSS class modifier |
|---|---|---|
| plan_to_watch | muted grey | (default) |
| watching | amber/yellow | `.status-badge.watching` |
| watched | green | `.status-badge.watched` |
| dropped | red | `.status-badge.dropped` |

---

## Related docs

[[index-html]] · [[index]]
