# src/tvmaze.js — TVMaze API apvalkalas

**Šaltinio failas:** `src/tvmaze.js`  
**Priklauso nuo:** integruotas `fetch` (Node 18+)  
**Naudoja:** [[08-routes-shows]]

---

## Ką šis failas daro

Visi serialų ir epizodų duomenys Watchly programoje ateina iš nemokamo viešo TVMaze API. Šis failas apvynioja neapdorotus TVMaze atsakymus į švariais, nuoseklius objektus kuriuos naudoja likusi programa.

Duomenų bazėje nieko nesaugoma — tai gyvas proxy.

---

## Pagrindinės sąvokos

- **Išorinis API** — serveris veikia kaip TVMaze klientas. Naršyklė niekada tiesiogiai nekviečia TVMaze; ji eina per `/api/shows/*` kuris kviečia TVMaze serverio pusėje.
- **fetch** — integruotas HTTP klientas (pasiekiamas Node 18+). Grąžina Promise.
- **502 Blogas vartai** — HTTP statuso kodas "mano serveris gavo blogą atsakymą iš aukščiau esančios paslaugos". Naudojamas čia bet kokiai TVMaze klaidai kuri nėra 404.
- **`formatShowBase`** — privati pagalbinė funkcija kuri ištraukia 6 laukus pasireiškiančius tiek paieškos rezultatuose tiek pilnose serialo detalėse. Vengia kartoti tą patį kodą du kartus.
- **Neprivalomasis grandininis operatorius `?.`** — `s.image?.original` saugiai grąžina `undefined` vietoje klaidos jei `s.image` yra null.

---

## Eksportuojamos funkcijos

| Funkcija | TVMaze endpoint | Naudoja maršrutas |
|---|---|---|
| `searchShows(query)` | `GET /search/shows?q=` | `GET /api/shows/search?q=` |
| `getShow(showId)` | `GET /shows/:id` | `GET /api/shows/:id` |
| `getEpisodes(showId)` | `GET /shows/:id/episodes` | `GET /api/shows/:id/episodes` |
| `getShowCast(showId)` | `GET /shows/:id/cast` | `GET /api/shows/:id/cast` |
| `getShowSeasons(showId)` | `GET /shows/:id/seasons` | `GET /api/shows/:id/seasons` |

---

## Serialo objekto forma (grąžinama searchShows ir getShow)

```js
{
  id:        1234,
  name:      "Breaking Bad",
  image:     "https://...",  // null jei nėra paveikslėlio
  summary:   "<p>...</p>",   // gali turėti HTML žymas — pašalinti prieš rodant
  premiered: "2008-01-20",
  genres:    ["Drama", "Crime"],
  // getShow taip pat apima:
  network:   "AMC",
  status:    "Ended"
}
```

---

## Klaidų tvarkymas

| TVMaze statusas | Ką šis failas išmeta |
|---|---|
| 404 | `err.status = 404` (perduodama klientui) |
| Bet koks kitas ne-OK | `err.status = 502` (aukštesnio lygio klaida) |

---

## Susiję dokumentai

[[08-routes-shows]] · [[02-server]] · [[01-index]]
