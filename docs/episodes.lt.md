# episodes.js — paaiškinimas

## Kam skirtas šis failas?

`episodes.js` rodo visus serialo epizodus, sugrupuotus pagal sezonus. Kiekvienas epizodas turi žymimąjį langelį — pažymėjus siunčiama užklausa į serverį. Kai visi epizodai pažymėti, seriale statusas automatiškai pasikeičia į „Žiūrėta".

---

## Importai

```js
import { request } from './api.js';
import { toast }   from './toast.js';
import { stripHtml, STATUS_LABELS } from './utils.js';
```

- `request` — siunčia HTTP užklausas į serverį
- `toast` — rodo trumpus pranešimus ekrane (pvz., klaidas)
- `stripHtml` — pašalina HTML žymes iš epizodo aprašymo
- `STATUS_LABELS` — žodynas, pvz. `{ watched: 'Žiūrėta', ... }`

---

## Kintamieji

```js
const title = document.getElementById('episodesTitle');
const hint  = document.getElementById('episodesHint');
const body  = document.getElementById('episodesBody');

let currentShow = null;
```

- `title`, `hint`, `body` — nuorodos į HTML elementus puslapyje
- `currentShow` — šiuo metu rodomo serialo duomenys (naudojami žymint epizodus)

---

## `groupBySeason(episodes)`

```js
function groupBySeason(episodes) {
  const map = new Map();
  for (const ep of episodes) {
    if (!map.has(ep.season)) map.set(ep.season, []);
    map.get(ep.season).push(ep);
  }
  return [...map.entries()].sort((a, b) => a[0] - b[0]);
}
```

Iš plokščio epizodų sąrašo sudaro grupes pagal sezoną.

**Pavyzdys:**
```
Įvestis:  [{ season: 2, ... }, { season: 1, ... }, { season: 1, ... }]
Išvestis: [ [1, [...]], [2, [...]] ]
```

Grąžina masyvą porų `[sezono numeris, epizodų masyvas]`, surikiuotų nuo 1 sezono.

---

## `renderSeason(num, eps, watched, allEps, updateOverall, checkAutoComplete)`

Sukuria vieną sezono skiltį — sulankstomą bloką su antrašte ir epizodų sąrašu.

### Parametrai

| Parametras | Reikšmė |
|---|---|
| `num` | Sezono numeris |
| `eps` | Šio sezono epizodai |
| `watched` | `Set` su jau žiūrėtų epizodų ID |
| `allEps` | Visi epizodai (visų sezonų) |
| `updateOverall` | Atnaujina bendrą progreso juostą |
| `checkAutoComplete` | Patikrina ar visi epizodai pažymėti |

### Pagalbinės funkcijos

```js
const watchedCount = () => eps.filter((ep) => watched.has(ep.id)).length;
const pct          = () => eps.length ? (watchedCount() / eps.length) * 100 : 0;
const isComplete   = () => eps.every((ep) => watched.has(ep.id));
```

Skaičiuoja žiūrėtus epizodus, procentą ir ar sezonas baigtas — skaičiuojama tiesiai iš `watched` rinkinio kiekvieną kartą iš naujo.

### Sezono antraštė

- Kairėje: rodyklė `›` ir „Season N"
- Dešinėje: progreso juosta, skaitiklis `X / Y`, mygtukas „Mark all"
- Paspaudus antraštę — sezonas suskleidžiamas / išskleidžiamas
- 1 sezonas pradžioje visada atskleistas

### Mygtukas „Mark all"

Paspaudus:
1. Suranda visus nepažymėtus epizodus šiame sezone
2. Siunčia `POST /api/episodes` visiems vienu metu (`Promise.all`)
3. Atnaujina žymimųjų langelių būseną ir progreso juostas

### Epizodų eilutės

Kiekvienam epizodui sukuriama eilutė su:
- **Žymimasis langelis** — pažymėjus siunčia `POST`, atžymėjus — `DELETE`
- **Miniatiūra** (jei yra nuotrauka)
- **Pavadinimas** formatu `1×03 · Epizodo pavadinimas`
- **Meta** — datos ir trukmė (pvz., `2023-04-01 · 45 min`)
- **Aprašymas** — HTML žymės pašalinamos per `stripHtml`

Jei užklausa nepavyksta — langelis grąžinamas į ankstesnę būseną ir rodomas klaidos pranešimas.

---

## `loadEpisodes(item)`

Pagrindinė funkcija, iškviečiama kai vartotojas paspaudžia „Episodes" ant seriale kortelės.

### Veikimo eiga

1. Rodo „Loading episodes…"
2. Vienu metu (`Promise.all`) gauna:
   - Visus epizodus iš TVMaze
   - Šio vartotojo jau žiūrėtus epizodus
   - Sezonų sąrašą (nebūtina — jei nepavyksta, naudojamas tuščias masyvas)
3. Sukuria „hero" bloką su plakatu, pavadinimu, statusu ir bendra progreso juosta
4. Iškviečia `groupBySeason` ir `renderSeason` kiekvienam sezonui
5. Iškviečia `updateOverall` — parodo pradinę pažangą

### `updateOverall(watchedSet, allEps)`

Atnaujina bendrą progreso juostą viršuje. Kai pasiekiama 100% — juosta tampa žalia.

### `checkAutoComplete(allEps, watchedSet)`

Jei visi epizodai pažymėti ir statusas dar nėra „watched":
- Siunčia `PATCH /api/watchlist/:id` su `{ status: 'watched' }`
- Atnaujina ženkliuką puslapyje
- Rodo sėkmės pranešimą

---

## `clearEpisodes()`

Iššaukiama kai vartotojas atsijungia. Išvalo rodinį — grąžina į pradinę tuščią būseną.

---

## Duomenų srautas (apibendrinimas)

```
Paspaudžiamas "Episodes"
        ↓
loadEpisodes(item)
        ↓
Promise.all → gauna epizodus, žiūrėtus, sezonus
        ↓
groupBySeason → sugrupuoja pagal sezoną
        ↓
renderSeason → sukuria HTML kiekvienam sezonui
        ↓
Vartotojas žymi epizodus → POST / DELETE
        ↓
updateOverall + checkAutoComplete
        ↓
(jei viskas pažymėta) → PATCH watchlist statusas → 'watched'
```
