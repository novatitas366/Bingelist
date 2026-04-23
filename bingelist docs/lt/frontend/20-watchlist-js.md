# public/js/watchlist.js — Watchlist rodinys

**Šaltinio failas:** `public/js/watchlist.js`  
**Priklauso nuo:** [[14-api-js]], [[16-toast-js]], [[18-modal-js]]  
**Naudoja:** [[13-app-js]] (`initWatchlist()`, `refreshWatchlist()`)

---

## Ką šis failas daro

Atvaizduoja ir valdo watchlist rodinį. Gauna vartotojo išsaugotus serialus, rodo juos kaip korteles ir tvarko eilutės statusų bei pastabų redagavimą bei šalinimą.

---

## Būsena

```js
let items         = [];      // pilnas sąrašas gautas iš serverio
let currentFilter = 'all';   // aktyvus statuso filtras
let onViewEpisodes = null;   // atgalinis kvietimas perjungti į epizodų rodinį
```

`items` masyvas yra tiesos šaltinis. Po kiekvieno pakeitimo (statuso atnaujinimas, šalinimas) jis atnaujinamas atmintyje ir kviečiamas `render()` tinklelio perstatymui — nereikia papildomos tinklo užklausos.

---

## Pagrindinės sąvokos

- **Atmintyje vykdomas filtravimas** — filtravimo žetonai negauna iš naujo iš serverio. Jie filtruoja `items` masyvą lokaliai ir atvaizduoja iš naujo. Greita ir vengia nereikalingų API kvietimų.
- **Atidėtas išsaugojimas** — pastabų textarea naudoja 500ms laiko limitą. Greitas rašymas nesiunčia PATCH kiekvienam paspaudimui — tik po to kai vartotojas pristoja 500ms.
- **Optimistinis lokalus atnaujinimas** — po sėkmingo statuso PATCH, `item.status` atnaujinamas lokaliai prieš kviečiant `render()`. Tai vengia papildomos `refreshWatchlist()` apvalaus kelio.
- **`e.target.closest('.chip')`** — filtravimo juosta naudoja vieną spustelėjimo klausytoją visai juostai. `closest()` randa paspaustą žetoną net jei spaustas vaikinis elementas.

---

## Eksportuojamos funkcijos

### `refreshWatchlist()`
- `GET /api/watchlist` su Authorization antrašte
- Pakeičia `items` masyvą šviežiais serverio duomenimis
- Kviečia `render()` UI atnaujinimui

### `initWatchlist({ onViewEpisodes })`
- Saugo epizodų rodinio atgalinį kvietimą
- Prijungia filtravimo žetonų spustelėjimo klausytoją
- Kviečiama vieną kartą iš `app.js`

---

## Daromi API kvietimai

| Veiksmas | Metodas | Endpoint | Aut. |
|---|---|---|---|
| Įkrauti sąrašą | GET | `/api/watchlist` | Taip |
| Keisti statusą | PATCH | `/api/watchlist/:id` | Taip |
| Išsaugoti pastabą | PATCH | `/api/watchlist/:id` | Taip |
| Šalinti | DELETE | `/api/watchlist/:id` | Taip |
| Peržiūrėti serialo detales | GET | `/api/shows/:id` | Ne |

---

## Įvykių klausytojų žemėlapis

| Įvykis | Elementas | Veiksmas |
|---|---|---|
| `click` ant plakato/pavadinimo | kortelė | Gauti serialą + atidaryti modalą |
| `change` | statuso `<select>` | PATCH statusas |
| `input` | pastabos `<textarea>` | Atidėtas PATCH pastabos (500ms) |
| `click` | Epizodų mygtukas | Kviesti `onViewEpisodes(item)` atgalinį kvietimą |
| `click` | Šalinti mygtukas | Patvirtinti → DELETE → atvaizduoti iš naujo |
| `click` | filtravimo žetonas | Atnaujinti `currentFilter` → atvaizduoti iš naujo |

---

## Susiję dokumentai

[[14-api-js]] · [[21-episodes-js]] · [[18-modal-js]] · [[09-routes-watchlist]] · [[01-index]]
