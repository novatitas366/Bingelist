# public/index.html — HTML skeletas

**Šaltinio failas:** `public/index.html`  
**Priklauso nuo:** [[12-styles-css]], [[13-app-js]]  
**Naudoja:** naršyklė (tiekiama Express statinio middleware)

---

## Ką šis failas daro

Vienas HTML puslapis visai programai (Vieno puslapio programa). Visas matomas turinys sukuriamas perjungiant tarp keturių `<section>` elementų naudojant `hidden` atributą. JavaScript moduliai tvarko viską kita.

---

## Pagrindinės sąvokos

- **SPA (Vieno puslapio programa)** — naršyklė įkelia šį vieną HTML failą vieną kartą. JavaScript tada rodo/slepia sekcijas ir daro API kvietimus be pilno puslapio perkrovimo.
- **`hidden` atributas** — standartinis HTML atributas kuris padaro elementą nematomą. `app.js` nustato `el.hidden = true/false` rodiniams perjungti.
- **`data-*` atributai** — pasirinktiniai HTML atributai saugantys duomenis JavaScript'ui. Pavyzdžiai:
  - `data-view="search"` — liepia `app.js` kurį rodinį rodyti kai spaudžiama skirtukas
  - `data-mode="login"` — liepia `app.js` kuris autentifikacijos režimas aktyvus
  - `data-status="watching"` — liepia `watchlist.js` kuris filtras pasirinktas
  - `data-authed-only` — žymi elementus kurie turi būti matomi tik kai prisijungta
- **`type="module"`** — ant `<script>` žymos, įjungia ES `import`/`export` sintaksę naršyklėje. Įkraunamas tik `app.js`; jis importuoja viską kita.

---

## Struktūra

```
<header class="topbar">          ← visada matomas
  ženklas | skirtukai | autentifikacijos sritis

<main class="container">
  <section id="view-auth">       ← prisijungimo/registracijos forma
  <section id="view-search">     ← paieškos forma + rezultatų tinklelis
  <section id="view-watchlist">  ← filtravimo žetonai + watchlist tinklelis
  <section id="view-episodes">   ← sezonų/epizodų sąrašas

<div id="toast">                 ← pranešimų juosta (apačioje)
<div id="modal-backdrop">        ← serialo detalių popup (fiksuotas perdangalas)

<script type="module" src="/js/app.js">
```

---

## Kuris JS failas kontroliuoja kiekvieną sekciją?

| Sekcija | Valdiklis |
|---|---|
| `#view-auth` | [[13-app-js]] (autentifikacijos formos tvarkymas) |
| `#view-search` | [[19-search-js]] |
| `#view-watchlist` | [[20-watchlist-js]] |
| `#view-episodes` | [[21-episodes-js]] |
| `#toast` | [[16-toast-js]] |
| `#modal-backdrop` | [[18-modal-js]] |
| Skirtukai + rodinių perjungimas | [[13-app-js]] |

---

## Susiję dokumentai

[[13-app-js]] · [[12-styles-css]] · [[01-index]]
