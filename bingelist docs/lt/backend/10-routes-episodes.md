# src/routes/episodes.js — Epizodų sekimo endpointai

**Šaltinio failas:** `src/routes/episodes.js`  
**Priklauso nuo:** [[03-db]], [[05-auth]], [[04-validate]]  
**Prijungtas prie:** `/api/episodes/*`  
**Reikia autentifikacijos:** Taip — visi maršrutai

---

## Ką šis failas daro

Seka kuriuos atskirus epizodus vartotojas pažymėjo kaip pažiūrėtus. Veikia kartu su watchlist'u — reikia turėti serialą watchlist'e prieš sekant jo epizodus (tvarko frontend, ne čia).

---

## Endpointai

### `GET /api/episodes/:show_id`
Grąžina pažiūrėtų epizodų ID masyvą vienam serialui.

**Kelio parametras:** `:show_id` — TVMaze serialo ID  
**Antraštės:** `Authorization: Bearer <žetonas>`

**Atsakymas — HTTP 200:**
```json
[302, 303, 304, 305]
```
(paprastas sveikųjų skaičių masyvas, ne objektai — efektyvu žymimųjų langelių atvaizdavimui)

---

### `POST /api/episodes`
Pažymi vieną epizodą kaip pažiūrėtą.

**Antraštės:** `Authorization: Bearer <žetonas>`, `Content-Type: application/json`  
**Kūnas:**
```json
{ "show_id": 169, "episode_id": 302 }
```

**Atsakymas — HTTP 201:**
```json
{ "show_id": 169, "episode_id": 302 }
```

Naudoja `INSERT OR IGNORE` — šio dvigubas kvietimas tam pačiam epizodui yra saugus (idempotentiškas).

---

### `DELETE /api/episodes/:episode_id`
Atžymi vieną epizodą.

**Kelio parametras:** `:episode_id` — TVMaze epizodo ID  
**Antraštės:** `Authorization: Bearer <žetonas>`

**Sėkmė — HTTP 204 Nėra turinio**  
**Klaida — HTTP 404:** epizodas nebuvo pažymėtas kaip pažiūrėtas

---

## Pavaizduotos HTTP sąvokos

- **GET** — grąžina ID sąrašą; kelio parametras identifikuoja serialą
- **POST** — sukuria pažiūrėto epizodo įrašą; kūne yra abu ID
- **DELETE** — pašalina įrašą; kelio parametras identifikuoja epizodą
- **Idempotentiškas POST** — `INSERT OR IGNORE` daro POST saugų kviesti kelis kartus be klaidos
- **204 Nėra turinio** — standartinis atsakymas sėkmingam DELETE

---

## Kodėl `show_id` saugomas dubliuotai?

`GET` endpoint'as užklauso `WHERE user_id = ? AND show_id = ?`. Jei `show_id` nebūtų saugomas, užklausa turėtų jungti su kita lentele. Saugojimas čia daro skaitymą greitą su vienu indeksu.

---

## Susiję dokumentai

[[03-db]] · [[05-auth]] · [[21-episodes-js]] · [[09-routes-watchlist]] · [[01-index]]
