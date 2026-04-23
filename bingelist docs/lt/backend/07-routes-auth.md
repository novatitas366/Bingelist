# src/routes/auth.js — Autentifikacijos endpointai

**Šaltinio failas:** `src/routes/auth.js`  
**Priklauso nuo:** [[03-db]], [[05-auth]], [[04-validate]]  
**Prijungtas prie:** `POST /api/auth/register` ir `POST /api/auth/login`  
**Reikia autentifikacijos:** Ne (taip gauname žetoną)

---

## Ką šis failas daro

Tvarko vartotojo registraciją ir prisijungimą. Sėkmės atveju abu maršrutai grąžina JWT žetoną kurį klientas saugo ir naudoja visose vėlesnėse autentifikuotose užklausose.

---

## Endpointai

### `POST /api/auth/register`

**Užklausa** (HTTP kūnas, Content-Type: application/json):
```json
{ "username": "alice", "password": "secretpass" }
```

**Sėkmė — HTTP 201 Sukurta:**
```json
{
  "token": "eyJ...",
  "user": { "id": 1, "username": "alice" }
}
```

**Klaidos:**
| Statusas | Kūnas | Priežastis |
|---|---|---|
| 400 | `{ error: "...", field: "..." }` | Tikrinimas nepavyko (per trumpas ir pan.) |
| 409 | `{ error: "username already taken" }` | UNIQUE apribojimas ant `users.username` |

---

### `POST /api/auth/login`

**Užklausa:**
```json
{ "username": "alice", "password": "secretpass" }
```

**Sėkmė — HTTP 200 OK:**
```json
{
  "token": "eyJ...",
  "user": { "id": 1, "username": "alice" }
}
```

**Klaidos:**
| Statusas | Kūnas | Priežastis |
|---|---|---|
| 400 | `{ error: "...", field: "..." }` | Tikrinimas nepavyko |
| 401 | `{ error: "invalid credentials" }` | Neteisingas vartotojo vardas ARBA slaptažodis |

> Saugumo pastaba: tas pats pranešimas grąžinamas nesvarbu ar vartotojo vardas neegzistuoja ar slaptažodis neteisingas. Tai neleidžia užpuolikui tikrinti kurie vartotojų vardai egzistuoja.

---

## Srauto diagrama

```
POST /api/auth/register
  → tikrinti vartotojo vardą + slaptažodį
  → bcrypt.hash(slaptažodis)       ← asinchroninis, daug CPU
  → INSERT INTO users
  → signToken(userId)
  → grąžinti 201 { token, user }

POST /api/auth/login
  → tikrinti įvestį
  → SELECT user WHERE username = ?
  → jei nerastas → 401
  → bcrypt.compare(slaptažodis, hešas) ← asinchroninis
  → jei nesutampa → 401
  → signToken(userId)
  → grąžinti 200 { token, user }
```

---

## Pavaizduotos HTTP sąvokos

- **POST** — sukuria naują resursą (vartotojo paskyrą) arba pradeda sesiją
- **HTTP 201 Sukurta** — naujas resursas sukurtas (registracija)
- **HTTP 401 Neautorizuotas** — kredencialai neteisingi arba trūksta
- **HTTP 409 Konfliktas** — resursas jau egzistuoja
- **Užklausos kūnas** — kredencialai yra JSON kūne, ne URL (saugumo sumetimais)

---

## Susiję dokumentai

[[05-auth]] · [[04-validate]] · [[03-db]] · [[15-auth-js]] · [[01-index]]
