# Security & Responsive Design

---

## SECURITY

### 1. HTTPS — šifruotas kanalas

**Failas:** `server.js` (eilutės 54–67)

```js
const keyPath  = process.env.SSL_KEY;
const certPath = process.env.SSL_CERT;

if (keyPath && certPath) {
  https.createServer({ key: fs.readFileSync(keyPath), cert: fs.readFileSync(certPath) }, app)
    .listen(port);
}
```

- `cert.pem` ir `key.pem` failai yra projekte
- Kai nustatyti `SSL_KEY` ir `SSL_CERT` kintamieji — serveris startuoja su HTTPS
- Visi duomenys (token, slaptažodis) keliauja šifruotu kanalu

---

### 2. Autorizacija — JWT (JSON Web Token)

**Token kūrimas:** `src/auth.js` — `signToken(userId)`

```js
const JWT_SECRET = process.env.JWT_SECRET;

export function signToken(userId) {
  return jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: '7d' });
}
```

- Po sėkmingo login/register serveris grąžina pasirašytą JWT tokeną
- Tokenas galioja 7 dienas
- `sub` (subject) lauke saugomas `userId`

**Token tikrinimas:** `src/auth.js` — `requireAuth` middleware

```js
export function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const match  = header.match(/^Bearer (.+)$/);
  if (!match) return res.status(401).json({ error: 'missing or invalid Authorization header' });

  const payload = jwt.verify(match[1], JWT_SECRET);
  req.userId = Number(payload.sub);
  next();
}
```

- Kiekvienoje apsaugotoje užklausoje tikrinamas `Authorization: Bearer <token>` header'is
- Jei tokenas negalioja arba pasibaigė — grąžinama `401 Unauthorized`
- Sėkmingai patikrinus — `req.userId` nustatomas iš tokeno (ne iš body!)

**Apsaugotos trąsos:** `src/routes/watchlist.js` ir `src/routes/episodes.js`

```js
router.use(requireAuth); // vykdoma prieš KIEKVIENĄ handler'į šiame faile
```

**Tokeno siuntimas iš frontend:** `public/js/api.js`

```js
if (auth) {
  headers['Authorization'] = `Bearer ${getToken()}`;
}
```

---

### 3. Slaptažodžių saugojimas — bcrypt

**Failas:** `src/auth.js`

```js
const SALT_ROUNDS = 10;

export function hashPassword(password) {
  return bcrypt.hash(password, SALT_ROUNDS);  // grąžina hash, ne slaptažodį
}
export function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);      // timing-safe palyginimas
}
```

- Duomenų bazėje saugomas tik `password_hash` — niekada plain-text slaptažodis
- `bcrypt.compare` naudoja timing-safe algoritmą (apsauga nuo timing atakų)

---

### 4. Užklausų validavimas

**Failas:** `src/validate.js`

```js
const username = requireString(req.body?.username, 'username', { min: 3, max: 32 });
const id       = requireInt(req.params.id, 'id');
const status   = requireEnum(req.body.status, 'status', WATCHLIST_STATUSES);
```

- Kiekvienas route handler'is validuoja visus gautus duomenis prieš naudodamas juos
- Jei validacija nepavyksta — išmetama `ValidationError`, serveris grąžina `400 Bad Request`
- Duomenų bazės užklausos naudoja `?` placeholder'ius (apsauga nuo SQL injection)

---

### 5. Duomenų izoliacija tarp vartotojų

**Failas:** `src/routes/watchlist.js`

```js
// WHERE id = ? AND user_id = ? — vartotojas negali pakeisti kito vartotojo įrašų
const row = db.prepare(`UPDATE watchlist SET ... WHERE id = ? AND user_id = ?`).get(...values);
```

- `user_id` imamas iš JWT tokeno (`req.userId`), o ne iš request body
- Vienas vartotojas negali perskaityti, pakeisti ar ištrinti kito vartotojo duomenų

---

## RESPONSIVE DESIGN

**Failas:** `public/css/styles.css`

Dizainas naudoja **mobile-first** principą — numatytasis CSS skirtas mažiems ekranams, o `@media` taisyklės prideda pakeitimus didesniems.

---

### Breakpoint 1 — Mobilusis telefonas (< 640px, numatytasis)

```css
/* Vienas stulpelis */
.grid { grid-template-columns: 1fr; }

/* Navigacijos mygtukai atsiduria po logotipu */
.tabs { order: 3; width: 100%; }
```

- Kortelių tinklelis: **1 stulpelis**
- Navigacijos skirtukai: po logotipu atskiroje eilutėje

---

### Breakpoint 2 — Planšetė (≥ 640px)

```css
@media (min-width: 640px) {
  .grid { grid-template-columns: repeat(2, 1fr); }
}
```

- Kortelių tinklelis: **2 stulpeliai**

---

### Breakpoint 3 — Kompiuteris (≥ 1024px)

```css
@media (min-width: 1024px) {
  .grid { grid-template-columns: repeat(3, 1fr); }
}
```

- Kortelių tinklelis: **3 stulpeliai**

---

### Papildomas breakpoint — Topbar (≥ 720px)

```css
@media (min-width: 720px) {
  .tabs { order: 0; width: auto; flex: 1; }
}
```

- Navigacijos skirtukai grįžta į **vieną eilutę** su logotipu

---

### Papildomas breakpoint — Modalas (≤ 500px)

```css
@media (max-width: 500px) {
  .modal-inner { flex-direction: column; }
  .modal-poster { width: 100%; height: 220px; }
}
```

- Modaliniame lange plakatas **virsta horizontalia juosta** virš teksto (vietoj šono stulpelio)

---

### Suvestinė

| Ekrano plotis | Tinklelis | Topbar | Modalas |
|---|---|---|---|
| < 500px | 1 stulpelis | Tabs žemiau | Plakatas viršuje |
| 500–640px | 1 stulpelis | Tabs žemiau | Greta |
| 640–720px | 2 stulpeliai | Tabs žemiau | Greta |
| 720–1024px | 2 stulpeliai | Inline | Greta |
| ≥ 1024px | 3 stulpeliai | Inline | Greta |

---

## Susiję failai

[[25-security]] · [[26-responsive-design]] · [[05-auth]] · [[12-styles-css]] · [[02-server]]
