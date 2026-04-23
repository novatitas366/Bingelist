# Vertinimas: Karkaso Principai

**Reikalavimas:** Laikytis pasirinktos technologijos konvencijų  
**Statusas: ✅ Laikomasi Express ir ES modulių konvencijų visoje programoje**

---

## Backend — Express.js principai

### 1. Router kiekvienai domenui

Express rekomenduoja grupuoti susijusius maršrutus į `Router` egzempliorius. Kiekvienas maršrutų failas eksportuoja vieną Router'į:

```js
// src/routes/watchlist.js
const router = Router();
// visi watchlist maršrutai čia
export default router;

// server.js
app.use('/api/watchlist', watchlistRoutes);
```

**Rezultatas:** visi su watchlist'u susiję endpoint'ai yra viename faile; visi epizodų endpoint'ai kitame; ir t.t.

### 2. Middleware grandinė

Pagrindinis Express šablonas yra middleware funkcijų konvejeris:

```
Užklausa
  → express.json()          (analizuoti kūną)
  → requireAuth()           (tikrinti JWT — tik apsaugotuose router'iuose)
  → maršruto tvarkytojas    (verslo logika)
  → globalus klaidų tvarkytojas (gauti bet kokias išmestas klaidas)
  → Atsakymas
```

`requireAuth` registruojamas su `router.use(requireAuth)` watchlist ir epizodų maršrutų failų viršuje — jis automatiškai vykdomas prieš kiekvieną tų failų tvarkytojo funkciją.

### 3. Klaidų skleidimas su `next(e)`

Express maršrutai kviečia `next(err)` klaidoms persiųsti globaliam klaidų tvarkytojui vietoje eilutės tvarkymo:

```js
} catch (e) {
  next(e); // → pasiekia app.use((err, req, res, _next) => ...) server.js
}
```

### 4. Sinchroninis SQLite su better-sqlite3

`better-sqlite3` yra idiomatiškas SQLite pasirinkimas Express programoms nes jo sinchroninis API atitinka Express užklausos/atsakymo šabloną nepriversiant async/await paprastoms DB užklausoms.

---

## Frontend — ES modulių principai

### 1. Vienas modulis vienai atsakomybei

Kiekvienas JS failas turi vieną atsakomybę:

| Failas | Atsakomybė |
|---|---|
| `api.js` | Tik HTTP + localStorage |
| `auth.js` | Tik autentifikacijos API kvietimai |
| `search.js` | Tik paieškos rodinys |
| `watchlist.js` | Tik watchlist rodinys |
| `episodes.js` | Tik epizodų rodinys |
| `modal.js` | Tik modalinis dialogas |
| `toast.js` | Tik pranešimai |
| `app.js` | Sujungia viską kartu |

### 2. Pavadinti eksportai + aiškūs importai

Funkcijos eksportuojamos pavadinimu ir importuojamos aiškiai:

```js
// watchlist.js
export async function refreshWatchlist() { ... }
export function initWatchlist({ onViewEpisodes }) { ... }

// app.js
import { initWatchlist, refreshWatchlist } from './watchlist.js';
```

Tai daro priklausomybes matomais ir vengia globalių kintamųjų.

### 3. Įvykiais grįsta architektūra

Visi vartotojų sąveikos tvarkomos per įvykių klausytojus. Jokio apklausimo, jokių globalios būsenos mutacijų už įvykių tvarkytojų ribų:

```js
addBtn.addEventListener('click', async () => {
  // viskas kas vyksta kai spaudžiamas Pridėti
});
```

### 4. DOM manipuliacija be karkaso

Laikomasi natyvaus DOM API šablono:
- `document.createElement` elementų kūrimui
- `.appendChild` jų prijungimui
- `.classList.toggle` CSS būsenai
- Niekada `innerHTML` su vartotojo duomenimis (neleidžia XSS)

---

## Kodo organizavimas

```
Bingelist/
  server.js          ← įėjimo taškas
  src/
    db.js            ← duomenų sluoksnis
    auth.js          ← autentifikacijos pagalbinės funkcijos
    validate.js      ← bendri tikrintojai
    tvmaze.js        ← išorinio API apvalkalas
    routes/          ← vienas failas kiekvienam API domenui
  public/
    index.html       ← vienas HTML puslapis
    css/styles.css   ← visi stiliai
    js/              ← vienas failas kiekvienai UI atsakomybei
```

---

## Dokumentai

[[02-server]] · [[07-routes-auth]] · [[09-routes-watchlist]] · [[13-app-js]] · [[14-api-js]] · [[01-index]]
