# public/js/app.js — Pagrindinis koordinatorius

**Šaltinio failas:** `public/js/app.js`  
**Priklauso nuo:** [[14-api-js]], [[15-auth-js]], [[19-search-js]], [[20-watchlist-js]], [[21-episodes-js]], [[16-toast-js]]  
**Naudoja:** [[11-index-html]] (įkraunamas tiesiogiai `<script>` žymės)

---

## Ką šis failas daro

Vienintelis įėjimo taškas kurį įkrauna naršyklė. Jis:
1. Sujungia visus modulius kartu
2. Valdo rodinių perjungimą (4 sekcijų rodymas/slėpimas)
3. Tvarko autentifikacijos formą (prisijungimas/registracija/atsijungimas)
4. Atkuria sesiją po puslapio perkrovimo

Viskas šiame faile yra **įvykiais grįsta** — funkcijos vykdomos reaguojant į vartotojo veiksmus (spustelėjimai, formų pateikimai).

---

## Pagrindinės sąvokos

- **Įvykiais grįstas programavimas** — JavaScript naršyklėje nevyksta iš viršaus į apačią po puslapio įkrovimo. Jis prideda įvykių klausytojus ir laukia. Kai vartotojas ką nors daro (spaudžia mygtuką, pateikia formą), vykdomas registruotas atgalinis kvietimas.
- **`async/await`** — naudojamas API kvietimams kurie užtrunka. `await` pristabdo funkciją kol užklausa baigsis, tada tęsia. Likęs puslapis lieka interaktyvus laukiant.
- **`e.preventDefault()`** — sustabdo numatytąją naršyklės elgseną (pvz. formos pateikimas perkrautų puslapį; mes sustabdome tai kad tvarkytume su JS).
- **Modulių importai** — kiekvienas `import { ... } from './failas.js'` jungiasi su kitu moduliu. `app.js` importuoja funkcijas bet nekartoja jų logikos.
- **Sesijos atkūrimas** — kiekvienam puslapio įkrovimui `getToken()` tikrina localStorage. Jei žetonas egzistuoja, programa praleida prisijungimo ekraną.

---

## Funkcijos

### `showView(pavadinimas)`
- Paslepia visas 4 sekcijas, rodo tik pavadinimą atitinkančią
- Paryškina atitinkamą skirtuko mygtuką
- Kviečiama skirtuko spustelėjimu, po prisijungimo, po atsijungimo

### `setAuthed(authed)`
- `true` → įjungti skirtukus, rodyti autentifikacijos sritį, perjungti į paieškos rodinį
- `false` → išjungti skirtukus, slėpti autentifikacijos sritį, perjungti į autentifikacijos rodinį

### Autentifikacijos formos tvarkymas
- Perjungimo mygtukai keičia tarp `'login'` ir `'register'` režimų
- Formos pateikimas kviečia `login()` arba `register()` iš `auth.js`
- Klaidos rodomos eilutėje po forma
- Sėkmės atveju: kviečia `setAuthed(true)` ir `refreshWatchlist()`

---

## Įvykių klausytojų žemėlapis

| Įvykis | Elementas | Veiksmas |
|---|---|---|
| `click` | Prisijungti/Registruotis perjungimas | Perjungti `authMode`, atnaujinti mygtuko tekstą |
| `submit` | `#authForm` | Kviesti `login()` arba `register()` |
| `click` | `#logoutBtn` | Kviesti `logout()`, `clearEpisodes()`, `setAuthed(false)` |
| `click` | `.tab` | Perjungti rodinį, atnaujinti watchlist'ą jei watchlist skirtukas |
| `click` | `#backToWatchlist` | Perjungti į watchlist rodinį |

---

## Paleidimo srautas

```
Puslapis įkraunamas
  → tikrinti localStorage JWT žetonui
  → žetonas rastas?
      TAIP → setAuthed(true) → rodyti paieškos rodinį → refreshWatchlist()
      NE   → setAuthed(false) → rodyti autentifikacijos formą
```

---

## Susiję dokumentai

[[14-api-js]] · [[15-auth-js]] · [[19-search-js]] · [[20-watchlist-js]] · [[21-episodes-js]] · [[11-index-html]] · [[01-index]]
