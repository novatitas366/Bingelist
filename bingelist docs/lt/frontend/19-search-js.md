# public/js/search.js — Paieškos rodinys

**Šaltinio failas:** `public/js/search.js`  
**Priklauso nuo:** [[14-api-js]], [[16-toast-js]], [[18-modal-js]]  
**Naudoja:** [[13-app-js]] (`initSearch()`)

---

## Ką šis failas daro

Tvarko paieškos rodinį: klauso formos pateikimų, kviečia paieškos API ir atvaizduoja serialų korteles. Kiekviena kortelė turi "Pridėti" mygtuką kuris siunčia POST į watchlist'ą.

---

## Pagrindinės sąvokos

- **DOM kūrimas** — visi HTML elementai kuriami su `document.createElement` ir surenkami programiškai. Jokių šablonų eilučių su vartotojo duomenimis, kas neleidžia XSS injekcijai.
- **Įvykių delegavimas vs tiesioginiai klausytojai** — kiekviena kortelė gauna savo `click` klausytoją sukūrimo metu. `addBtn.disabled = true` neleidžia dublikato pateikimų.
- **`e.preventDefault()`** — sustabdo naršyklės natyvų formos pateikimą (kuris perkrautų puslapį).
- **`encodeURIComponent(q)`** — URL-koduoja paieškos terminą kad specialūs simboliai serialų pavadinimuose (pvz. `&`, `+`) nesuardytų užklausos eilutės.
- **409 Konflikto tvarkymas** — kai vartotojas bando pridėti serialą jau esantį jų sąraše, serveris grąžina 409. Frontend rodo "Jau sąraše" vietoje mygtuko įjungimo iš naujo.

---

## Srautas

```
Vartotojas įveda "Breaking Bad" ir spaudžia Ieškoti
  → formos pateikimo įvykis suveikia
  → e.preventDefault() sustabdo puslapio perkrovimą
  → runSearch("Breaking Bad") kviečiamas
    → GET /api/shows/search?q=Breaking%20Bad
    → kiekvienam serialui: card(serialas) sukuria DOM elementą
    → kortelės pridedamos prie #searchResults

Vartotojas spaudžia Pridėti ant kortelės
  → POST /api/watchlist (su Authorization antrašte + JSON kūnu)
  → sėkmė: mygtuko tekstas keičiamas į "Pridėta ✓"
  → 409 klaida: mygtuko tekstas keičiamas į "Jau sąraše"
```

---

## Daromi API kvietimai

| Kvietimas | Metodas | Endpoint | Aut. |
|---|---|---|---|
| Ieškoti serialų | GET | `/api/shows/search?q=:query` | Ne |
| Pridėti į watchlist'ą | POST | `/api/watchlist` | Taip |

---

## `initSearch()` funkcija

Kviečiama vieną kartą iš `app.js` puslapio inicijavimo metu. Prijungia `submit` įvykių klausytoją prie `#searchForm`. Be šio kvietimo, paieškos forma nieko nedarytų.

---

## Susiję dokumentai

[[14-api-js]] · [[18-modal-js]] · [[16-toast-js]] · [[08-routes-shows]] · [[09-routes-watchlist]] · [[01-index]]
