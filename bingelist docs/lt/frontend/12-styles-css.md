# public/css/styles.css — Stiliai

**Šaltinio failas:** `public/css/styles.css`  
**Priklauso nuo:** niekas  
**Naudoja:** [[11-index-html]]

---

## Ką šis failas daro

Visi programos CSS — išdėstymas, spalvos, tipografija, komponentai, animacijos ir responsive lūžio taškai. Jokio CSS karkaso; viskas pasirinktina.

---

## Pagrindinės sąvokos

- **CSS pasirinktinės savybės (kintamieji)** — apibrėžiamos `:root { --pavadinimas: reikšmė }`, naudojamos bet kur kaip `var(--pavadinimas)`. Pakeičiant `--primary` čia keičiasi violetinis akcentas visur.
- **Flexbox** — naudojamas eilučių/stulpelių išdėstymams visoje programoje (viršutinė juosta, kortelės-kūnas, aktorių-narys ir pan.)
- **CSS Grid** — naudojamas serialų kortelių tinkleliui (`display: grid; grid-template-columns: repeat(N, 1fr)`)
- **`@media` užklausos** — sąlyginis CSS taikomas tik tam tikruose ekrano plotuose. Taip veikia Responsive dizainas.
- **`hidden` atributas** — `[hidden] { display: none }` yra naršyklės numatytoji elgsena; kai kurie elementai naudoja `backdrop:not([hidden]) { display: flex }` kontroliuoti kaip jie atsislepia.
- **CSS animacijos** — `@keyframes fade` ant `.view` ir `@keyframes modal-in` ant `.modal` teikia įėjimo animacijas.
- **BEM-panašus pavadinimas** — blokas (`card`), elementas (`card-body`, `card-title`), modifikatorius (`btn-primary`, `btn-danger`)

---

## Responsive lūžio taškai

| Lūžio taškas | Taikoma | Pakeitimas |
|---|---|---|
| numatyta (< 640px) | tinklelis | 1 stulpelis → **mobilusis** |
| `@media (min-width: 640px)` | tinklelis | 2 stulpeliai → **planšetė** |
| `@media (min-width: 1024px)` | tinklelis | 3 stulpeliai → **stalinis** |
| `@media (min-width: 720px)` | viršutinės juostos skirtukai | apačioje → eilutėje |
| `@media (max-width: 500px)` | modalas | plakatas + turinys šalia → sukrauti |

---

## Pagrindinės sekcijos

| Sekcija | Klasės prefiksas | Ką stilizuoja |
|---|---|---|
| Dizaino žetonai | `:root` | Spalvos, šešėliai, spindulys |
| Viršutinė juosta | `.topbar`, `.brand`, `.tabs`, `.tab` | Navigacijos antraštė |
| Mygtukai | `.btn`, `.btn-primary`, `.btn-danger`, `.btn-ghost`, `.btn-sm` | Visi mygtukai |
| Formos | `input`, `select`, `textarea`, `label` | Visi formos valdikliai |
| Autentifikacijos kortelė | `.auth-card`, `.auth-toggle` | Prisijungimo/registracijos forma |
| Kortelių tinklelis | `.grid`, `.card`, `.card-body` | Serialų kortelės |
| Statuso žetonai | `.status-badge` | Spalvomis koduoti statuso žetonai |
| Filtravimo žetonai | `.chip` | Watchlist filtravimo mygtukai |
| Epizodai | `.season`, `.episode`, `.progress-*` | Epizodų sekimo UI |
| Modalas | `.modal-backdrop`, `.modal`, `.cast-*` | Serialo detalių popup |
| Toast | `.toast` | Pranešimų juosta |

---

## Statuso žetonų spalvos

| Statusas | Spalva | CSS klasės modifikatorius |
|---|---|---|
| plan_to_watch | pilka | (numatytoji) |
| watching | gintaro/geltona | `.status-badge.watching` |
| watched | žalia | `.status-badge.watched` |
| dropped | raudona | `.status-badge.dropped` |

---

## Susiję dokumentai

[[11-index-html]] · [[01-index]]
