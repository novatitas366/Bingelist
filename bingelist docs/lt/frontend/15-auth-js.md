# public/js/auth.js — Prisijungimas, registracija, atsijungimas

**Šaltinio failas:** `public/js/auth.js`  
**Priklauso nuo:** [[14-api-js]]  
**Naudoja:** [[13-app-js]]

---

## Ką šis failas daro

Plonas apvalkalas aplink autentifikacijos API endpoint'us. Siunčia kredencialus serveriui ir sėkmės atveju saugo grąžintą JWT žetoną ir vartotojo objektą `localStorage`.

---

## Funkcijos

### `login(username, password)`
- Kviečia `POST /api/auth/login` su `{ username, password }` užklausos kūne
- Sėkmės atveju: saugo žetoną ir vartotoją `localStorage`
- Išmeta `ApiError` nesėkmės atveju (401 neteisingi kredencialai, 400 tikrinimas)

### `register(username, password)`
- Kviečia `POST /api/auth/register` su ta pačia kūno forma
- Sėkmės atveju: saugo žetoną ir vartotoją
- Išmeta `ApiError` nesėkmės atveju (409 vartotojo vardas užimtas, 400 tikrinimas)

### `logout()`
- Kviečia `clearToken()` kuris pašalina abu raktus iš `localStorage`
- Sinchroninis — jokios tinklo užklausos nereikia (serveris neseka sesijų; JWT yra be būsenos)

---

## Pagrindinės sąvokos

- **Jokio `auth: true`** — prisijungimas ir registracija nesiunčia Authorization antraštės nes vartotojas dar neturi žetono. Tai ir yra šių endpoint'ų tikslas.
- **Be būsenos JWT autentifikacija** — serverio pusės sesijos nėra ką panaikinti. Atsijungimas tiesiog ištrina žetoną iš naršyklės. Žetonas techiškai lieka galiojantis kol baigsis galiojimas (7 dienos), bet naršyklė jo nebesiųs.
- **`request()` iš api.js** — visas tikrasis HTTP darbas vyksta [[14-api-js]]. Šis failas tik organizuoja su autentifikacija susijusius kvietimus.

---

## HTTP užklausa siunčiama `login()` metu

```
POST /api/auth/login HTTP/1.1
Content-Type: application/json

{ "username": "alice", "password": "secret123" }
```

Atsakymas (sėkmė):
```
HTTP/1.1 200 OK
Content-Type: application/json

{ "token": "eyJ...", "user": { "id": 1, "username": "alice" } }
```

---

## Susiję dokumentai

[[14-api-js]] · [[13-app-js]] · [[07-routes-auth]] · [[01-index]]
