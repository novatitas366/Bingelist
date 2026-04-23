# src/validate.js — Įvesties tikrinimas

**Šaltinio failas:** `src/validate.js`  
**Priklauso nuo:** niekas  
**Naudoja:** [[07-routes-auth]], [[08-routes-shows]], [[09-routes-watchlist]], [[10-routes-episodes]]

---

## Ką šis failas daro

Teikia mažas tikrinimo funkcijas kiekvienam vartotojo įvesties tipui. Kiekviena funkcija arba **grąžina išvalytą reikšmę** arba **išmeta `ValidationError`**.

Globalus klaidų tvarkytojas `server.js` gauna `ValidationError` ir grąžina **HTTP 400 Bloga užklausa** su lauko pavadinimu, kad frontend žinotų kuris laukas neteisingas.

---

## Pagrindinės sąvokos

- **Tikrinimas prie ribos** — tikrinimas vyksta tik ant gaunamų duomenų (užklausos kūnas, užklausos eilutė, URL parametrai). Duomenimis jau saugomuose duomenų bazėje pasitikima.
- **Greitai nepavykti** — jei bet kuris laukas neteisingas, iš karto išmesti. Nereikia rinkti visų klaidų.
- **ValidationError neša lauko pavadinimą** — atsakymas `{ error: "...", field: "username" }` leidžia frontend'ui paryškinti konkretų sugadintą lauką.

---

## Eksportuojamos funkcijos

### `requireString(val, name, { min, max })`
- Atmeta: ne eilutę, per trumpą, per ilgą
- Grąžina: apkarpytą eilutę
- Pavyzdys: `requireString(req.body.username, 'username', { min: 3, max: 32 })`

### `optionalString(val, name, opts)`
- Tas pats kaip `requireString` bet taip pat priima `null`, `undefined` arba `''` — grąžina `null` toms reikšmėms
- Naudojama laukams kaip `note` ir `show_image` kurie gali nebūti

### `requireInt(val, name)`
- Priima eilutes kaip `"42"` (URL parametrai visada eilutės)
- Atmeta: ne skaitinę, dešimtaines kaip `1.5`
- Grąžina: sveikojo skaičiaus reikšmę
- Pavyzdys: `requireInt(req.params.id, 'id')`

### `requireEnum(val, name, allowed)`
- Atmeta bet kokią reikšmę nesančią `allowed` masyve
- Grąžina: reikšmę nepakeistą
- Pavyzdys: `requireEnum(req.body.status, 'status', WATCHLIST_STATUSES)`

### `WATCHLIST_STATUSES`
- `['plan_to_watch', 'watching', 'watched', 'dropped']`
- Dalinamas tarp routes/watchlist.js ir šio failo — vienas tiesos šaltinis

---

## Klaidos atsakymo forma

```json
{
  "error": "username must be at least 3 characters",
  "field": "username"
}
```

---

## Susiję dokumentai

[[02-server]] · [[07-routes-auth]] · [[09-routes-watchlist]] · [[01-index]]
