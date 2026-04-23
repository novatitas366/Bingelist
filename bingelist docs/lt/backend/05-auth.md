# src/auth.js — Autentifikacijos pagalbinės funkcijos

**Šaltinio failas:** `src/auth.js`  
**Priklauso nuo:** `bcrypt`, `jsonwebtoken`, aplinkos kintamasis `JWT_SECRET`  
**Naudoja:** [[07-routes-auth]], [[09-routes-watchlist]], [[10-routes-episodes]]

---

## Ką šis failas daro

Teikia du dalykus:
1. **Slaptažodžių pagalbinės funkcijos** — `hashPassword` ir `verifyPassword` naudojant bcrypt
2. **JWT pagalbinės funkcijos** — `signToken` ir `requireAuth` Express middleware

---

## Pagrindinės sąvokos

### bcrypt
- Slaptažodžių hešavimo algoritmas sukurtas būti lėtas (daug CPU) kad brute-force atakos būtų nepraktiškos.
- `SALT_ROUNDS = 10` — darbo faktorius. Didesnis = lėtesnis bet saugesnis. 10 yra standartinė gamybos reikšmė.
- Niekada nesaugoti paprastų slaptažodžių. Saugoti tik hešą ir lyginti naudojant `bcrypt.compare`.
- Ir `hash` ir `compare` yra asinchroniniai (grąžina Promise) nes atlieka sunkius skaičiavimus.

### JWT (JSON Web Token)
- Savarankiškas žetonas kurį serveris pasirašo ir duoda klientui po prisijungimo.
- Formatas: `antraštė.naudingoji_apkrova.parašas` (trys base64 dalys atskirtos taškais).
- Naudingojoje apkrovoje yra `{ sub: userId }`. `sub` = "subjektas" = kam žetonas priklauso.
- Parašas sukuriamas naudojant `JWT_SECRET`. Tik serveris gali jį patikrinti.
- Žetonai baigia galioti po 7 dienų (`TOKEN_TTL = '7d'`).
- Klientas saugo žetoną `localStorage` ir siunčia jį kiekvienoje autentifikuotoje užklausoje kaip `Authorization: Bearer <žetonas>`.

### requireAuth middleware
- **Express middleware** funkcija: `(req, res, next) => void`.
- Kviečiama automatiškai prieš maršruto tvarkytojus kai registruota su `router.use(requireAuth)`.
- Skaito `Authorization: Bearer <žetonas>` antraštę.
- Tikrina JWT naudojant `jwt.verify` (išmeta jei negalioja/pasibaigęs).
- Nustato `req.userId` iš žetono naudingosios apkrovos kad maršruto tvarkytojai žinotų kas pateikia užklausą.
- Kviečia `next()` sėkmės atveju, arba atsako HTTP 401 nesėkmės atveju (kas sustabdo grandinę).

---

## Eksportuojamos funkcijos

| Funkcija | Parametrai | Grąžina | Kada naudoti |
|---|---|---|---|
| `hashPassword(password)` | paprastas tekstas | `Promise<hešas>` | Registracijos metu |
| `verifyPassword(password, hash)` | paprastas + saugomas hešas | `Promise<boolean>` | Prisijungimo metu |
| `signToken(userId)` | sveikas skaičius | JWT eilutė | Po sėkmingo prisijungimo/registracijos |
| `requireAuth` | — | Express middleware | Apsaugoti maršrutus su `router.use(requireAuth)` |

---

## Authorization antraštės formatas

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

- `Bearer` yra autentifikacijos schemos pavadinimas (OAuth 2.0 standartas)
- Žetonas eina po tarpo

---

## Susiję dokumentai

[[07-routes-auth]] · [[09-routes-watchlist]] · [[10-routes-episodes]] · [[14-api-js]] · [[01-index]]
