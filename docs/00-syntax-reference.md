# Sintaksės žinynas — JavaScript, HTML, CSS

Šis failas paaiškina visą sintaksę naudojamą šiame projekte. Skirtas skaityti prieš kitus docs failus.

---

## JavaScript

### Kintamieji

```js
const x = 5;        // nekintamas (negalima perrašyti)
let y = 10;         // kintamas (galima perrašyti)
// var nenaudojamas — pasenęs, turi blogą scope'ą
```

---

### Funkcijos

```js
// Įprasta funkcija
function greet(name) {
  return 'Labas, ' + name;
}

// Rodyklės funkcija (arrow function) — trumpesnė forma
const greet = (name) => {
  return 'Labas, ' + name;
};

// Jei grąžinama viena reikšmė — galima sutrumpinti
const greet = (name) => 'Labas, ' + name;
```

---

### Template literals (šablonų eilutės)

```js
const name = 'Jonas';
const msg = `Labas, ${name}!`;   // backtick `` vietoj kabučių
// rezultatas: "Labas, Jonas!"

// Veikia su bet kokia išraiška tarp ${ }
const url = `/api/watchlist/${item.id}`;
```

---

### Destruktūrizavimas

```js
// Objekto destruktūrizavimas
const { id, name, status } = item;
// tas pats kaip:
// const id = item.id; const name = item.name; ...

// Masyvo destruktūrizavimas
const [first, second] = ['a', 'b'];

// Su pervadinimu
const { onViewEpisodes: cb } = options;
// cb = options.onViewEpisodes
```

---

### Spread operatorius `...`

```js
const a = [1, 2, 3];
const b = [...a, 4, 5];   // [1, 2, 3, 4, 5] — kopijuoja masyvą

const obj = { x: 1 };
const obj2 = { ...obj, y: 2 };  // { x: 1, y: 2 }
```

---

### Trumpieji loginiai operatoriai

```js
// || — jei kairė pusė "falsy" (null, undefined, 0, ''), naudoja dešinę
const note = item.note || '';         // jei note null → ''

// && — jei kairė pusė "truthy", grąžina dešinę
if (onViewEpisodes) onViewEpisodes(item);
// tas pats kaip: onViewEpisodes && onViewEpisodes(item);

// ?? — tik jei kairė pusė null arba undefined (ne 0 ar '')
const limit = options.limit ?? 10;
```

---

### Objektai

```js
const show = {
  id: 1,
  name: 'Breaking Bad',
  premiered: '2008-01-20',
};

show.name;          // pasiekti lauką su tašku
show['name'];       // pasiekti su laužtiniais skliaustais (kai lauko pavadinimas kintamasis)

// Trumpa forma kai kintamojo pavadinimas = lauko pavadinimas
const name = 'Breaking Bad';
const show = { name };   // tas pats kaip { name: name }
```

---

### Masyvai

```js
const arr = [1, 2, 3];

arr.push(4);                          // prideda į galą
arr.filter(x => x > 1);              // grąžina naują masyvą su sąlygą atitinkančiais elementais
arr.map(x => x * 2);                 // grąžina naują masyvą su pakeistais elementais
arr.find(x => x.id === 5);           // grąžina pirmą atitinkantį elementą
arr.forEach(x => console.log(x));    // iteruoja, nieko negrąžina
arr.includes(2);                     // true/false — ar elementas yra masyve

// For...of — paprasta iteracija
for (const item of arr) {
  console.log(item);
}

// Object.entries — objekto raktai ir reikšmės kaip masyvų poros
for (const [key, value] of Object.entries(STATUS_LABELS)) {
  // key = 'watching', value = 'Watching'
}
```

---

### Set — unikalių reikšmių rinkinys

```js
const watched = new Set([1, 2, 3, 2]);  // { 1, 2, 3 } — dublikatai pašalinami

watched.has(2);    // true — O(1) greitis (greitesnis nei .includes())
watched.add(4);
watched.delete(2);
```

Projekte naudojama `episodes.js` — žiūrėtų epizodų ID saugomi `Set` dėl greito tikrinimo.

---

### Async / Await

```js
// async funkcija visada grąžina Promise
async function fetchData() {
  const response = await fetch('/api/data');   // laukia kol atsakys serveris
  const data = await response.json();          // laukia kol nuskaitys JSON
  return data;
}

// await galima naudoti tik async funkcijoje
// Klaidos gaudymas
async function safe() {
  try {
    const data = await fetchData();
  } catch (e) {
    console.error(e.message);   // catch gauna klaidos objektą
  }
}
```

---

### Promise

```js
// Promise — pažadas, kad duomenys ateityje bus
const p = new Promise((resolve, reject) => {
  // resolve(data) — sėkmė
  // reject(error) — klaida
});

// Promise.all — laukia kol VISI užbaigs, vykdo lygiagrečiai
const [episodes, watched, seasons] = await Promise.all([
  getEpisodes(id),
  getWatched(id),
  getSeasons(id),
]);
// Viskas parsisiųsta vienu metu — greičiau nei vienas po kito
```

---

### ES moduliai (import / export)

```js
// --- faile utils.js ---
export function stripHtml(html) { ... }        // named export
export const STATUS_LABELS = { ... };          // named export
export default function main() { ... }         // default export (vienas per failą)

// --- faile search.js ---
import { stripHtml, STATUS_LABELS } from './utils.js';   // named imports
import main from './utils.js';                            // default import
import express from 'express';                            // iš node_modules
```

---

### Klasės ir klaidos

```js
// Pasirinktinė klaidos klasė
class ValidationError extends Error {
  constructor(message, field) {
    super(message);        // iškviečia Error konstruktorių
    this.field = field;    // prideda papildomą lauką
  }
}

// Naudojimas
throw new ValidationError('Per trumpas', 'username');

// Tikrinimas
if (err instanceof ValidationError) {
  res.status(400).json({ error: err.message });
}
```

---

### Debounce (atidėtas kvietimas)

```js
let timer = null;

input.addEventListener('input', () => {
  clearTimeout(timer);              // atšaukia ankstesnį laikmačio kvietimą
  timer = setTimeout(() => {
    saveNote(input.value);          // vykdo tik po 500ms tylos
  }, 500);
});
// Pvz.: vartotojas rašo "Labas" — tik paskutinė raidė paleidžia išsaugojimą
```

---

### DOM manipuliacija

```js
// Elementų pasiekimas
const el = document.getElementById('searchForm');
const els = document.querySelectorAll('.chip');   // visi elementai su klase

// Elementų kūrimas
const div = document.createElement('div');
div.className = 'card';
div.textContent = 'Tekstas';          // saugus tekstas (ne HTML)
div.innerHTML = '<b>Bold</b>';        // HTML — pavojinga su vartotojo įvestimi!
div.style.color = 'red';
div.dataset.status = 'watching';      // data-status atributas

// Elementų jungimas
parent.appendChild(child);

// Slėpimas / rodymas
el.hidden = true;
el.hidden = false;

// Klasės valdymas
el.classList.add('active');
el.classList.remove('active');
el.classList.toggle('active');
el.classList.contains('active');   // true/false
```

---

### Įvykių klausytojai (Event Listeners)

```js
btn.addEventListener('click', () => {
  console.log('paspaustas');
});

// Formos pateikimas
form.addEventListener('submit', (e) => {
  e.preventDefault();    // neleidžia puslapiui persikrauti (numatyta naršyklės elgsena)
  runSearch(input.value);
});

// Klavišų paspaudimai
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

// Event delegation — vienas klausytojas visiems vaikams
filterBar.addEventListener('click', (e) => {
  const chip = e.target.closest('.chip');  // ieško artimiausio tėvo su klase
  if (!chip) return;
});
```

---

### localStorage

```js
localStorage.setItem('token', 'abc123');    // išsaugo
localStorage.getItem('token');              // skaito → 'abc123'
localStorage.removeItem('token');           // ištrina
// Duomenys išlieka net uždarius naršyklę
```

---

### Fetch API

```js
const res = await fetch('/api/watchlist', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
  body: JSON.stringify({ show_id: 1, status: 'watching' }),
});

if (!res.ok) {
  const err = await res.json();
  throw new Error(err.error);
}

if (res.status === 204) {
  // 204 No Content — nėra body, negalima skaityti .json()
} else {
  const data = await res.json();
}
```

---

## HTML

### Dokumento struktūra

```html
<!DOCTYPE html>                          <!-- nurodo HTML5 versiją -->
<html lang="lt">                         <!-- puslapio kalba -->
<head>
  <meta charset="UTF-8">                 <!-- simbolių kodavimas -->
  <meta name="viewport"
        content="width=device-width, initial-scale=1.0">  <!-- responsive -->
  <title>Watchly</title>
  <link rel="stylesheet" href="/css/styles.css">
</head>
<body>
  <!-- turinys -->
  <script type="module" src="/js/app.js"></script>  <!-- ES moduliai -->
</body>
</html>
```

---

### Dažniausiai naudojami elementai

```html
<!-- Teksto elementai -->
<h1>Antraštė</h1>
<p>Pastraipa</p>
<span>Eilutinis elementas</span>
<div>Blokinis elementas</div>

<!-- Formos -->
<form id="searchForm">
  <input type="text" id="searchInput" placeholder="Ieškoti...">
  <button type="submit">Ieškoti</button>
</form>

<!-- Mygtukai -->
<button class="btn btn-primary">Pridėti</button>
<button class="btn btn-danger">Ištrinti</button>

<!-- Pasirinkimo sąrašas -->
<select>
  <option value="watching">Žiūriu</option>
  <option value="watched" selected>Pažiūrėta</option>
</select>

<!-- Teksto laukas -->
<textarea rows="2" placeholder="Pastaba..."></textarea>

<!-- Žymimasis langelis -->
<input type="checkbox" id="ep1" checked>
<label for="ep1">S01E01</label>
```

---

### Data atributai

```html
<!-- data-* — pasirinktiniai duomenys elementui -->
<button class="chip" data-status="watching">Žiūriu</button>

<!-- JS pusėje -->
<script>
  btn.dataset.status;   // → 'watching'
</script>
```

---

### Specialūs atributai šiame projekte

```html
<!-- hidden — paslepia elementą (JS gali pakeisti el.hidden = false) -->
<section id="view-watchlist" hidden></section>

<!-- data-authed-only — app.js slepia/rodo priklausomai nuo prisijungimo -->
<nav data-authed-only hidden></nav>

<!-- data-view — app.js naudoja skirtis tarp rodinių -->
<button data-view="search">Paieška</button>

<!-- type="module" — įjungia ES modulių sistemą -->
<script type="module" src="/js/app.js"></script>
```

---

### Semantiniai elementai

```html
<header>   <!-- viršutinė juosta -->
<nav>      <!-- navigacija -->
<main>     <!-- pagrindinis turinys -->
<section>  <!-- turinio sekcija -->
<article>  <!-- savarankiškas turinys -->
<footer>   <!-- apatinė juosta -->
```

---

## CSS

### Kintamieji (Custom Properties)

```css
/* Apibrėžiami :root bloke — pasiekiami visame puslapyje */
:root {
  --bg: #0f1117;
  --accent: #7c6af7;
  --radius: 10px;
}

/* Naudojimas */
.card {
  background: var(--bg);
  border-radius: var(--radius);
}
```

---

### Selektoriai

```css
div { }             /* elemento tipas */
.card { }           /* klasė */
#searchForm { }     /* ID */
.card .title { }    /* .title viduje .card */
.btn.primary { }    /* abu klasės tame pačiame elemente */
.btn:hover { }      /* pseudo-klasė — kai pelė virš */
.btn:disabled { }   /* pseudo-klasė — kai išjungtas */
input::placeholder { }  /* pseudo-elementas — placeholder tekstas */
```

---

### Dėžutės modelis (Box Model)

```css
.card {
  width: 300px;
  padding: 16px;       /* vidiniai tarpai (tarp turinio ir krašto) */
  margin: 8px;         /* išoriniai tarpai (tarp elementų) */
  border: 1px solid #333;
  border-radius: 8px;  /* užapvalinti kampai */
}

/* Shorthand — viršus | dešinė | apačia | kairė */
padding: 10px 20px 10px 20px;
/* arba viršus/apačia | kairė/dešinė */
padding: 10px 20px;
```

---

### Flexbox

```css
.container {
  display: flex;
  flex-direction: row;         /* row (numatyta) | column */
  justify-content: space-between;  /* horizontalus išdėstymas */
  align-items: center;         /* vertikalus lygiavimas */
  gap: 12px;                   /* tarpai tarp elementų */
  flex-wrap: wrap;             /* leidžia elementams pereiti į kitą eilutę */
}

.item {
  flex: 1;         /* užima likusią vietą */
  flex-shrink: 0;  /* nesusitraukia kai vietos per mažai */
}
```

---

### Grid

```css
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);  /* 3 vienodo pločio stulpeliai */
  gap: 16px;
}

/* repeat(auto-fill, minmax(220px, 1fr)) — automatinis stulpelių skaičius */
```

---

### Responsive dizainas (@media)

```css
/* Mobile-first: stiliai be @media taikomi visiems ekranams */
.grid {
  grid-template-columns: 1fr;   /* 1 stulpelis */
}

/* Planšetė — nuo 640px */
@media (min-width: 640px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);   /* 2 stulpeliai */
  }
}

/* Staliniai — nuo 1024px */
@media (min-width: 1024px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);   /* 3 stulpeliai */
  }
}

/* Maži ekranai — iki 500px */
@media (max-width: 500px) {
  .modal-inner {
    flex-direction: column;
  }
}
```

---

### Pozicionavimas

```css
.parent {
  position: relative;  /* referencinis taškas absolute vaikams */
}

.child {
  position: absolute;  /* išimamas iš normalaus srauto */
  top: 0;
  right: 0;
}

.overlay {
  position: fixed;     /* fiksuotas ekrane, nejuda slenkant */
  inset: 0;            /* top:0; right:0; bottom:0; left:0 — užpildo visą ekraną */
}
```

---

### Perėjimai (Transitions)

```css
.btn {
  background: var(--accent);
  transition: background 0.2s, transform 0.1s;  /* animuojami pakeitimai */
}

.btn:hover {
  background: #6a59e0;
  transform: translateY(-1px);   /* pakelia 1px aukštyn */
}
```

---

### Overflow ir slinkimas

```css
.summary {
  overflow: hidden;           /* paslepia viršijantį turinį */
  display: -webkit-box;
  -webkit-line-clamp: 3;      /* rodo tik 3 eilutes, po to "..." */
  -webkit-box-orient: vertical;
}

body.modal-open {
  overflow: hidden;   /* blokuoja puslapio slinkimą kai modal atidarytas */
}
```

---

### Z-index (sluoksniai)

```css
.modal-backdrop {
  z-index: 1000;   /* virš visko kito */
}
.toast {
  z-index: 2000;   /* virš modal'o */
}
/* Didesnis skaičius = arčiau vartotojo */
```

---

### CSS vienetai

| Vienetas | Reikšmė |
|---|---|
| `px` | pikseliai — fiksuotas dydis |
| `rem` | santykis su šakninio elemento šriftu (paprastai 16px) |
| `%` | procentas nuo tėvo elemento |
| `vw` / `vh` | procentas nuo ekrano pločio / aukščio |
| `fr` | frakcija laisvos vietos grid'e |
| `1fr` | viena lygių dalių |

---

## Node.js / Express (backend)

### Middleware

```js
// Middleware — funkcija kuri vykdoma prieš route handler'į
// Turi tris parametrus: req, res, next
app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();   // perduoda valdymą kitam middleware arba route'ui
});

// Klaidos middleware — turi keturis parametrus
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});
```

---

### Express Router

```js
import { Router } from 'express';
const router = Router();

// Visi šio router'io route'ai
router.get('/', handler);
router.post('/:id', handler);

// Prijungiamas prie app su prefiksu
app.use('/api/watchlist', router);
// → GET /api/watchlist/, POST /api/watchlist/:id
```

---

### req ir res objektai

```js
router.get('/:id', (req, res) => {
  req.params.id;       // path parametras — /shows/123 → '123'
  req.query.q;         // query parametras — /search?q=breaking → 'breaking'
  req.body.status;     // body (JSON) — reikia express.json() middleware
  req.headers.authorization;  // antraštė

  res.json({ data: 'ok' });        // siunčia JSON
  res.status(201).json({ ... });   // su HTTP statuso kodu
  res.status(204).end();           // be body
  res.sendFile(path);              // siunčia failą
});
```

---

### HTTP statuso kodai

| Kodas | Reikšmė |
|---|---|
| `200` | OK — sėkmė |
| `201` | Created — sukurtas naujas resursas |
| `202` | Accepted — priimta, vykdoma fone |
| `204` | No Content — sėkmė, nėra atsakymo body |
| `400` | Bad Request — bloga užklausa / validacijos klaida |
| `401` | Unauthorized — reikia prisijungti |
| `403` | Forbidden — prisijungęs, bet neturi teisių |
| `404` | Not Found — resursas nerastas |
| `409` | Conflict — jau egzistuoja |
| `500` | Internal Server Error — serverio klaida |

---

### JWT (JSON Web Token)

```
Header.Payload.Signature
eyJhbGc...  .eyJzdWIiOjEsImV4cCI6...  .abc123...
```

```js
// Sukūrimas
const token = jwt.sign(
  { sub: user.id },        // payload — kas prisijungė
  process.env.JWT_SECRET,
  { expiresIn: '7d' }      // galiojimo laikas
);

// Tikrinimas
const payload = jwt.verify(token, process.env.JWT_SECRET);
payload.sub;   // → user.id

// Klientas siunčia:
// Authorization: Bearer eyJhbGc...
```
