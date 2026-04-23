# server.js — Įėjimo taškas

**Šaltinio failas:** `server.js`  
**Priklauso nuo:** [[03-db]], [[05-auth]], [[04-validate]], [[07-routes-auth]], [[08-routes-shows]], [[09-routes-watchlist]], [[10-routes-episodes]]  
**Naudoja:** niekas (šis yra aukščiausio lygio failas kurį paleidžia Node)

---

## Ką šis failas daro

Tai pirmas failas kurį vykdo Node (`node server.js`). Jis:
1. Įkelia aplinkos kintamuosius iš `.env`
2. Importuoja `src/db.js` kaip šalutinį efektą (sukuria duomenų bazę)
3. Sukuria Express programą ir registruoja visus middleware bei maršrutus
4. Pradeda klausytis HTTP arba HTTPS ryšių

---

## Pagrindinės sąvokos

- **Express programa** — `const app = express()` sukuria žiniatinklio serverį. Middleware ir maršrutai dedami ant jos eilės tvarka.
- **Middleware** — `app.use(...)` registruoja funkcijas kurios vykdomos kiekvienai užklausai prieš maršruto tvarkytojus. Eilės tvarka svarbi.
- **Maršruto prijungimas** — `app.use('/api/auth', authRoutes)` perduoda visas `/api/auth/*` užklausas `authRoutes` Router'iui.
- **SPA catch-all** — `app.get(/^\/(?!api\/).*/, ...)` siunčia `index.html` bet kokiam ne-API keliui, kad naršyklės pusės maršrutizavimas veiktų po atnaujinimo.
- **Globalus klaidų tvarkytojas** — middleware su 4 parametrais `(err, req, res, next)` gauna klaidas išmestas bet kurio maršruto tvarkytojo.
- **HTTP vs HTTPS** — skaito `SSL_KEY`/`SSL_CERT` iš aplinkos; naudoja `https.createServer` jei abu nustatyti, kitaip `http.createServer`.

---

## Užklausos gyvavimo ciklas

```
Naršyklės užklausa
  → express.json() išanalizuoja kūną
  → maršruto tvarkytojas vykdomas (pvz. watchlistRoutes)
    → requireAuth middleware tikrina JWT (jei apsaugotas maršrutas)
    → vykdoma verslo logika
    → res.json() siunčia atsakymą
  → jei tvarkytojas kviečia next(err):
    → globalus klaidų tvarkytojas siunčia 400 / 4xx / 500
```

---

## Čia naudojami HTTP statuso kodai

| Kodas | Reikšmė | Kur |
|---|---|---|
| 400 | Bloga užklausa | ValidationError iš validate.js |
| 4xx/5xx | Praleidžiamas | Klaidos su `.status` savybe (pvz. TVMaze 404) |
| 500 | Vidinė serverio klaida | Netikėtos išimtys |

---

## Skaitomi aplinkos kintamieji

| Kintamasis | Privalomas | Paskirtis |
|---|---|---|
| `JWT_SECRET` | **Taip** | Pasirašo ir tikrina JWT žetonus |
| `PORT` | Ne | Klausymo prievadas (numatyta 3000) |
| `SSL_KEY` | Ne | Kelias iki TLS privataus rakto |
| `SSL_CERT` | Ne | Kelias iki TLS sertifikato |
| `DB_PATH` | Ne | SQLite failo kelias (numatyta `./watchly.db`) |

---

## Susiję dokumentai

[[07-routes-auth]] · [[08-routes-shows]] · [[09-routes-watchlist]] · [[10-routes-episodes]] · [[03-db]] · [[01-index]]
