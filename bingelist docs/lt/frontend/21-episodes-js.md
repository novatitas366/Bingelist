# public/js/episodes.js — Epizodų sekimo rodinys

**Šaltinio failas:** `public/js/episodes.js`  
**Priklauso nuo:** [[14-api-js]], [[16-toast-js]]  
**Naudoja:** [[13-app-js]] (`loadEpisodes()`, `clearEpisodes()`)

---

## Ką šis failas daro

Sudėtingiausias frontend modulis. Kai vartotojas spaudžia "Epizodai" ant watchlist kortelės, šis modulis:
1. Gauna visus epizodus + jau pažiūrėtų ID + sezonų skaičių **lygiagrečiai**
2. Grupuoja epizodus pagal sezoną ir atvaizduoja sulankstomas sekcijas
3. Kiekvienas epizodas turi žymimąjį langelį — pažymėjimas/atpažymėjimas siunčia POST/DELETE į API
4. Automatiškai atnaujina watchlist statusą į "pažiūrėta" kai visi epizodai pažymėti

---

## Pagrindinės sąvokos

- **`Promise.all([...])` — lygiagrečios užklausos** — vietoje laukimo epizodų, tada pažiūrėtų ID, tada sezonų (3 nuoseklūs apvalūs keliai), visos trys užklausos paleidžiamos tuo pačiu metu. Daug greičiau.
- **`new Set(watchedIds)` — O(1) peržvalgos** — JavaScript `Set` tikrina narystę pastoviu laiku. Naudojamas kiekvienam epizodui momentaliai žinoti ar jis pažymėtas neperskaitant masyvo.
- **Bendras keičiamas `watched` Set** — `Set` perduodamas kiekvienam sezono `renderSeason()` kvietimui. Kai vartotojas pažymi langelį, epizodo ID pridedamas į Set, ir visos pagalbinės funkcijos (`updateSeasonHeader`, `updateOverall`) perskaito jį dabartiniams skaičiams gauti.
- **Išjungimas/įjungimas** — žymimieji langeliai išjungiami API užklausos metu dvigubo spaudimo prevencijai, tada įjungiami `finally {}`.
- **Grįžimas klaidai** — jei POST arba DELETE nepavyksta, `cb.checked` apverčiamas atgal į ankstesnę reikšmę kad UI liktų nuoseklus.
- **Automatinis užbaigimas** — `checkAutoComplete()` vykdomas po kiekvieno žymimojo langelio pakeitimo. Jei visi epizodai pažiūrėti ir statusas dar nėra `'watched'`, automatiškai PATCH'uoja watchlist įrašą.

---

## Eksportuojamos funkcijos

### `loadEpisodes(item)`
- `item` = watchlist įrašo objektas iš `watchlist.js`
- Gauna ir atvaizduoja viską tam serialui

### `clearEpisodes()`
- Atnaujina epizodų rodinį į tuščią būseną
- Kviečiama atsijungus kad pasenę duomenys nebūtų matomi po pakartotinio prisijungimo

---

## Daromi API kvietimai

| Kvietimas | Metodas | Endpoint | Aut. |
|---|---|---|---|
| Gauti visus epizodus | GET | `/api/shows/:id/episodes` | Ne |
| Gauti pažiūrėtų ID | GET | `/api/episodes/:show_id` | Taip |
| Gauti sezonus | GET | `/api/shows/:id/seasons` | Ne |
| Pažymėti epizodą | POST | `/api/episodes` | Taip |
| Atpažymėti epizodą | DELETE | `/api/episodes/:id` | Taip |
| Automatinis užbaigimas | PATCH | `/api/watchlist/:id` | Taip |

---

## Šio failo sukuriama UI struktūra

```
#episodesBody
  ├── .episodes-hero          ← plakatas + pavadinimas + bendras progreso strypas
  └── .season × N             ← vienas kiekvienam sezonui, sulankstomas
       ├── .season-header     ← Sezonas N | mini progresė | skaičius | Pažymėti visus
       └── .season-body
            └── .episode × N ← žymimasis langelis | miniatiūra | pavadinimas + data + aprašas
```

---

## Susiję dokumentai

[[14-api-js]] · [[20-watchlist-js]] · [[10-routes-episodes]] · [[08-routes-shows]] · [[01-index]]
