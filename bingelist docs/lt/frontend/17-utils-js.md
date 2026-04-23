# public/js/utils.js — Bendros pagalbinės funkcijos

**Šaltinio failas:** `public/js/utils.js`  
**Priklauso nuo:** niekas  
**Naudoja:** [[19-search-js]], [[20-watchlist-js]], [[21-episodes-js]], [[18-modal-js]]

---

## Ką šis failas daro

Laiko tris dalykus kurie anksčiau buvo kopijuojami tarp kelių failų:
- `stripHtml` — pašalina HTML žymas iš TVMaze santraukų
- `STATUS_LABELS` — žmogui suprantami keturių watchlist statusų pavadinimai
- `buildStatusSelect` — sukuria `<select>` išskleidžiamąjį sąrašą su visais keturiais statusais

---

## Eksportai

### `stripHtml(html)`
TVMaze grąžina serialų/epizodų aprašymus su HTML žymomis (`<p>`, `<b>` ir pan.). Prieš rodant kaip paprastą tekstą, žymas reikia pašalinti.

```js
stripHtml('<p>A <b>chemistry teacher</b> breaks bad.</p>')
// → "A chemistry teacher breaks bad."
```

Naudojama: [[19-search-js]], [[21-episodes-js]], [[18-modal-js]]

### `STATUS_LABELS`
Susieja duomenų bazės statuso reikšmes su žmogui suprantamais pavadinimais.

```js
{
  plan_to_watch: 'Plan to watch',
  watching:      'Watching',
  watched:       'Watched',
  dropped:       'Dropped',
}
```

Naudojama: [[20-watchlist-js]], [[21-episodes-js]]

### `buildStatusSelect(pasirinktaReikšmė = null)`
Sukuria `<select>` elementą su visais keturiais statuso variantais. Perduoti `pasirinktaReikšmė` esamam statusui iš anksto pasirinkti (pvz. watchlist'e). Palikti `null` be išankstinio pasirinkimo (paieškoje).

```js
// Paieškoje — be išankstinio pasirinkimo
const select = buildStatusSelect();

// Watchlist'e — iš anksto pasirinktas esamas statusas
const select = buildStatusSelect(item.status);
```

Naudojama: [[19-search-js]], [[20-watchlist-js]]

---

## Susiję dokumentai

[[19-search-js]] · [[20-watchlist-js]] · [[21-episodes-js]] · [[18-modal-js]] · [[01-index]]
