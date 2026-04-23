# src/routes/shows.js — Serialų paieškos ir detalių endpointai

**Šaltinio failas:** `src/routes/shows.js`  
**Priklauso nuo:** [[06-tvmaze]], [[04-validate]]  
**Prijungtas prie:** `/api/shows/*`  
**Reikia autentifikacijos:** Ne

---

## Ką šis failas daro

Proxiuoja visus TV serialų duomenis iš TVMaze API. Jokios prieigos prie duomenų bazės, jokios autentifikacijos nereikia. Veikia kaip švarus tarpininkas kad naršyklė nekalbėtų su TVMaze tiesiogiai.

---

## Endpointai

### `GET /api/shows/search?q=:query`
**Parametro tipas: užklausos eilutė** (`?q=reikšmė` URL'e)  
Grąžina atitinkančių serialų masyvą.

```
GET /api/shows/search?q=Breaking+Bad
```

```json
[
  { "id": 169, "name": "Breaking Bad", "image": "...", "summary": "...", ... }
]
```

---

### `GET /api/shows/:id`
**Parametro tipas: kelio parametras** (`:id` įterpta į URL)  
Grąžina pilnas vieno serialo detales įskaitant tinklą ir statusą.

```
GET /api/shows/169
```

---

### `GET /api/shows/:id/cast`
Grąžina 5 pagrindinius aktorius.

```json
[
  { "name": "Bryan Cranston", "character": "Walter White", "image": "..." }
]
```

---

### `GET /api/shows/:id/seasons`
Grąžina sezonų metaduomenis (skaičius, premjeros datos).

---

### `GET /api/shows/:id/episodes`
Grąžina visus serialo epizodus (naudoja epizodų rodinys).

---

## Pavaizduotos HTTP sąvokos

- **GET** — tik skaitymas, be kūno, saugu kartoti
- **Užklausos parametras** — `?q=` naudojamas paieškos/filtravimo reikšmėms
- **Kelio parametras** — `:id` naudojamas konkretaus resurso identifikavimui
- **Maršrutų eilės tvarka svarbi** — `/search` turi būti deklaruotas prieš `/:id` kad Express neinterpretuotų "search" kaip ID. Panašiai `/:id/cast` prieš `/:id`.

---

## Kodėl proxy vietoj tiesioginio TVMaze kreipimosi iš naršyklės?

1. Mes kontroliuojame atsakymo formą (švarūs, nuoseklūs objektai)
2. Galime pridėti talpyklą čia vėliau nekeičiant frontend'o
3. Naršyklė lieka to paties pradžios taško (CORS antraščių nereikia)

---

## Susiję dokumentai

[[06-tvmaze]] · [[02-server]] · [[19-search-js]] · [[18-modal-js]] · [[21-episodes-js]] · [[01-index]]
