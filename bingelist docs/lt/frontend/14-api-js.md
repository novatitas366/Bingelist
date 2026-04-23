# public/js/api.js — HTTP klientas

**Šaltinio failas:** `public/js/api.js`  
**Priklauso nuo:** naršyklės integruotų funkcijų (`fetch`, `localStorage`)  
**Naudoja:** [[15-auth-js]], [[19-search-js]], [[20-watchlist-js]], [[21-episodes-js]], [[18-modal-js]]

---

## Ką šis failas daro

Kiekvienas API kvietimas programoje eina per `request()` funkciją čia. Ji:
- Prideda teisingas antraštes (`Content-Type`, `Authorization`)
- Tvarko HTTP klaidas išmesdama `ApiError`
- Valdo JWT žetoną `localStorage`

---

## Pagrindinės sąvokos

- **`fetch`** — naršyklės integruotas HTTP klientas. Grąžina `Promise<Response>`.
- **`localStorage`** — naršyklės raktų-reikšmių saugykla išliekanti po puslapio atnaujinimų. Naudojama JWT žetonui saugoti kad vartotojas liktų prisijungęs.
- **Authorization antraštė** — `Authorization: Bearer <žetonas>` yra standartinis JWT siuntimo būdas. `requireAuth` middleware backend'e skaito šią antraštę.
- **HTTP statuso kodai** — `res.ok` yra `true` 200–299, `false` 400+. Mes išmetame klaidą ne-OK atsakymams kad kviečiantieji galėtų ją `catch` gauti.
- **`ApiError`** — pasirinktinė Error poklasė nešanti `.status` (HTTP statuso kodą). Kviečiantieji gali tikrinti `e.status === 409` specifiniams atvejams tvarkyti.

---

## `request(kelias, parametrai)` funkcija

```js
const duomenys = await request('/watchlist', { method: 'GET', auth: true });
const eilutė   = await request('/watchlist', { method: 'POST', auth: true, body: { ... } });
```

| Parametras | Numatytoji | Efektas |
|---|---|---|
| `method` | `'GET'` | HTTP veiksmažodis |
| `body` | undefined | Objektas JSON-koduojamas; prideda `Content-Type: application/json` antraštę |
| `auth` | `false` | Jei true, prideda `Authorization: Bearer <žetonas>` antraštę |

**Grąžina:** išanalizuotus JSON duomenis, arba `null` HTTP 204 (be kūno)  
**Išmeta:** `ApiError` bet kokiam ne-OK atsakymui

---

## localStorage raktai

| Raktas | Saugo |
|---|---|
| `watchly.token` | JWT eilutė (Authorization žetonas) |
| `watchly.user` | JSON-koduotas `{ id, username }` objektas |

---

## `ApiError` klasė

```js
try {
  await request('/watchlist', { method: 'POST', auth: true, body: { ... } });
} catch (e) {
  if (e.status === 409) { /* jau watchlist'e */ }
  else { /* kita klaida */ }
}
```

---

## Susiję dokumentai

[[15-auth-js]] · [[19-search-js]] · [[20-watchlist-js]] · [[21-episodes-js]] · [[05-auth]] · [[01-index]]
