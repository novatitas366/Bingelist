# Vertinimas: Saugumas

**Reikalavimas:** Saugus kanalas (HTTPS) + autorizacija + užklausų tikrinimas  
**Statusas: ✅ Visi trys įgyvendinti**

---

## 1. Saugus kanalas — HTTPS

**Reikalavimas:** Šifruotas transportas kad kredencialai ir žetonai negalėtų būti perimti.

**Kaip įgyvendinta** — `server.js`:
```js
const keyPath  = process.env.SSL_KEY;
const certPath = process.env.SSL_CERT;

if (keyPath && certPath) {
  const options = {
    key:  fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath),
  };
  https.createServer(options, app).listen(port, () => {
    console.log(`Watchly listening on https://localhost:${port}`);
  });
}
```

**Įrodymas:** `cert.pem` ir `key.pem` failai egzistuoja projekto šaknyje. Nustatykite `SSL_KEY=./key.pem` ir `SSL_CERT=./cert.pem` `.env` faile kad įjungtumėte HTTPS.

**Railway/gamyboje:** platforma tvarko TLS terminaciją, todėl programa visada veikia per HTTPS.

---

## 2. Autorizacija — JWT (JSON Web Tokens)

**Reikalavimas:** Patikrinti vartotojo tapatybę kiekvienoje apsaugotoje užklausoje.

**Kaip įgyvendinta — žetonų išdavimas** (`src/auth.js`):
```js
export function signToken(userId) {
  return jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: '7d' });
}
```
Po sėkmingo prisijungimo ar registracijos, 7 dienų pasirašytas žetonas grąžinamas klientui.

**Kaip įgyvendinta — žetonų tikrinimas** (`src/auth.js:requireAuth`):
```js
router.use(requireAuth); // watchlist.js ir episodes.js viršuje
```
Kiekvienas apsaugotas maršrutas registruoja `requireAuth` kaip middleware. Jis:
1. Skaito `Authorization: Bearer <žetonas>` antraštę
2. Kviečia `jwt.verify()` — išmeta jei pasibaigęs, suklastotas arba neteisingas raktas
3. Nustato `req.userId` iš žetono naudingosios apkrovos

**Apsaugoti maršrutai:** `/api/watchlist/*` ir `/api/episodes/*`  
**Vieši maršrutai:** `/api/auth/*` ir `/api/shows/*`

---

## 3. Užklausų tikrinimas

**Reikalavimas:** Priimti tik laukiamus duomenis.

**Kaip įgyvendinta** — `src/validate.js` kviečiamas kiekviename maršruto tvarkytojuje:

```js
// Eilutės tikrinimas (tipas + ilgis)
const username = requireString(req.body?.username, 'username', { min: 3, max: 32 });

// Sveikojo skaičiaus tikrinimas (atmeta eilutes, dešimtaines, NaN)
const id = requireInt(req.params.id, 'id');

// Enum tikrinimas (atmeta reikšmes nesančias leidžiamame sąraše)
const status = requireEnum(req.body.status, 'status', WATCHLIST_STATUSES);
```

Jei tikrinimas nepavyksta, išmetama `ValidationError`. Globalus klaidų tvarkytojas `server.js` ją gauna ir atsako **HTTP 400 Bloga užklausa**:
```json
{ "error": "username must be at least 3 characters", "field": "username" }
```

**SQL injekcijos prevencija:** visos duomenų bazės užklausos naudoja **paruoštus teiginius su `?` vietos žymekliais**. Duomenų bazės tvarkyklė tvarko ekranavimą — vartotojo įvestis niekada nesujungiama į SQL eilutes.

**Slaptažodžių saugumas:** slaptažodžiai heširuojami su **bcrypt** (SALT_ROUNDS=10) prieš saugojimą. Paprasti slaptažodžiai niekada nesaugomi.

---

## Saugumo kontrolinis sąrašas

| Grėsmė | Apsauga |
|---|---|
| Pasiklausymas | HTTPS (TLS šifravimas) |
| Suklastotos užklausos | JWT parašo tikrinimas |
| Pasibaigusios sesijos | JWT 7 dienų galiojimas |
| Prieiga prie kitų vartotojų duomenų | `WHERE user_id = ?` naudojant JWT išvestą ID |
| SQL injekcija | Paruošti teiginiai |
| Neteisingos įvestys | `requireString`, `requireInt`, `requireEnum` |
| Paprasti slaptažodžiai | bcrypt heširavimas |
| Per didelės apkrovos | `express.json({ limit: '100kb' })` |

---

## Dokumentai

[[05-auth]] · [[04-validate]] · [[02-server]] · [[07-routes-auth]] · [[09-routes-watchlist]]
