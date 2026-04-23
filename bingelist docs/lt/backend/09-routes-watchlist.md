# src/routes/watchlist.js — Watchlist CRUD endpointai

**Šaltinio failas:** `src/routes/watchlist.js`  
**Priklauso nuo:** [[03-db]], [[05-auth]], [[04-validate]]  
**Prijungtas prie:** `/api/watchlist/*`  
**Reikia autentifikacijos:** Taip — visi maršrutai (vykdoma `router.use(requireAuth)`)

---

## Ką šis failas daro

Pilnas Sukūrimas/Skaitymas/Atnaujinimas/Šalinimas autentifikuoto vartotojo watchlist'ui. `requireAuth` middleware vykdomas prieš kiekvieną tvarkytojo funkciją šiame faile, todėl neautentifikuotos užklausos niekada nepasiekia maršruto logikos.

---

## Endpointai

### `GET /api/watchlist`
Grąžina visus prisijungusio vartotojo watchlist įrašus, naujausius pirma.

**Reikalinga antraštė:** `Authorization: Bearer <žetonas>`

**Atsakymas — HTTP 200:**
```json
[
  {
    "id": 5,
    "show_id": 169,
    "show_name": "Breaking Bad",
    "show_image": "https://...",
    "status": "watching",
    "note": "Iki S3E4",
    "added_at": "2024-01-15 14:30:00"
  }
]
```

---

### `POST /api/watchlist`
Prideda serialą į watchlist'ą.

**Antraštės:** `Authorization: Bearer <žetonas>`, `Content-Type: application/json`  
**Kūnas:**
```json
{
  "show_id": 169,
  "show_name": "Breaking Bad",
  "show_image": "https://...",
  "status": "plan_to_watch"
}
```

**Sėkmė — HTTP 201 Sukurta:** naujas eilutė  
**Klaida — HTTP 409:** serialas jau yra šio vartotojo watchlist'e

---

### `PATCH /api/watchlist/:id`
Dalinai atnaujina watchlist įrašą. Keičiami tik laukai esantys kūne.

**Kelio parametras:** `:id` — watchlist įrašo ID  
**Antraštės:** `Authorization: Bearer <žetonas>`, `Content-Type: application/json`  
**Kūnas (bent vienas laukas):**
```json
{ "status": "watched", "note": "Puiki pabaiga" }
```

**Sėkmė — HTTP 200:** atnaujinta eilutė  
**Klaida — HTTP 404:** įrašas nerastas (arba priklauso kitam vartotojui)  
**Klaida — HTTP 400:** nepateikta jokių galiojančių laukų

---

### `DELETE /api/watchlist/:id`
Pašalina watchlist įrašą.

**Kelio parametras:** `:id`  
**Antraštės:** `Authorization: Bearer <žetonas>`

**Sėkmė — HTTP 204 Nėra turinio** (tuščias kūnas)  
**Klaida — HTTP 404:** įrašas nerastas

---

## Pavaizduotos HTTP sąvokos

- **GET** — skaitymas, be kūno, be šalutinių efektų
- **POST** — kūrimas, grąžina 201 su nauju resursu
- **PATCH** — dalinis atnaujinimas (tik laukai kuriuos siunti); skiriasi nuo PUT (kuris pakeičia visą resursą)
- **DELETE** — šalinimas, grąžina 204 (sėkmė be kūno)
- **Kelio parametras** — `:id` identifikuoja kurį konkretų įrašą atnaujinti/šalinti
- **Authorization antraštė** — `Bearer <žetonas>` kiekvienoje užklausoje; `requireAuth` ją tikrina
- **`AND user_id = ?`** UPDATE/DELETE — neleidžia vienam vartotojui keisti kito vartotojo įrašų

---

## Saugumo pastaba

Kiekviena rašymo užklausa apima `WHERE id = ? AND user_id = ?`. Vartotojo ID ateina iš patikrinto JWT, ne iš užklausos kūno, todėl vartotojas niekada negali atsitiktinai (ar kenkėjiškai) pakeisti kito vartotojo duomenų.

---

## Susiję dokumentai

[[03-db]] · [[05-auth]] · [[04-validate]] · [[20-watchlist-js]] · [[01-index]]
