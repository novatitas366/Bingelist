# public/js/modal.js — Serialo detalių modalas

**Šaltinio failas:** `public/js/modal.js`  
**Priklauso nuo:** [[14-api-js]]  
**Naudoja:** [[19-search-js]], [[20-watchlist-js]]

---

## Ką šis failas daro

Valdo serialo detalių popup'ą (modalinį dialogą). Kai spaudžiamas serialo plakatas ar pavadinimas, `openModal(serialas)` užpildo modalą serialo duomenimis ir padaro jį matomą. Aktoriai gaunami asinchroniškai po modalo atidarymo.

---

## Pagrindinės sąvokos

- **Modalo šablonas** — fiksuotos pozicijos perdangalas blokuojantis sąveiką su puslapiu už jo. Fonas yra tamsus pusiau permatomas sluoksnis; baltas langelis yra pats modalas.
- **`body.style.overflow = 'hidden'`** — neleidžia puslapiui slinkti kol modalas atidarytas.
- **Neblokuojantis aktorių gavimas** — `.then()` naudojamas vietoje `await` kad modalas pasirodytų iš karto. Aktorių duomenys įkraunami po sekundės ar dviejų ir pridedami prie atidaryto modalo.
- **Trys uždarymo gestai** — standartinė prieinama modalo elgsena:
  1. ✕ mygtukas
  2. Spausti tamsų foną
  3. Spausti Escape
- **`e.target === backdrop`** — uždaro tik jei spaustas pats fonas, o ne modalo turinio langelis (kuris yra ant fono viršaus).

---

## `openModal(serialas)` parametras

```js
{
  id,         // TVMaze serialo ID (naudojamas aktorių gavimui)
  name,       // serialo pavadinimas
  image,      // plakato URL arba null
  summary,    // HTML eilutė (pašalinama prieš rodymą)
  premiered,  // "2008-01-20" → rodyti tik metus
  genres,     // eilučių masyvas
  network,    // "AMC" arba null
  status      // "Running" / "Ended" arba null
}
```

`search.js` kortelės jau turi visus šiuos laukus (iš paieškos rezultato). `watchlist.js` kortelės gauna juos pareikalavus su `GET /api/shows/:id` nes watchlist saugo tik `show_id` ir `show_name`.

---

## Daromi API kvietimai

| Kvietimas | Metodas | Endpoint | Aut. |
|---|---|---|---|
| Gauti aktorius | GET | `/api/shows/:id/cast` | Ne |

---

## Eksportuojamos funkcijos

| Funkcija | Naudojimas |
|---|---|
| `openModal(serialas)` | Kviečiama iš search.js ir watchlist.js |
| `closeModal()` | Kviečiama trijų uždarymo tvarkytojų |

---

## Susiję dokumentai

[[14-api-js]] · [[19-search-js]] · [[20-watchlist-js]] · [[08-routes-shows]] · [[01-index]]
