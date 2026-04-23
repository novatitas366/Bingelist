# Vertinimas: API Endpointai

**Reikalavimas:** API turi bent 5 endpoint'us ("žiniatinklio paslaugos")  
**Statusas: ✅ Įgyvendinti 14 endpoint'ų**

---

## Visi endpoint'ai

| # | Metodas | Kelias | Aut. | Paskirtis |
|---|---|---|---|---|
| 1 | POST | `/api/auth/register` | Ne | Sukurti naują vartotojo paskyrą |
| 2 | POST | `/api/auth/login` | Ne | Prisijungti, gauti JWT žetoną |
| 3 | GET | `/api/shows/search?q=` | Ne | Ieškoti serialų TVMaze |
| 4 | GET | `/api/shows/:id` | Ne | Pilnos serialo detalės |
| 5 | GET | `/api/shows/:id/cast` | Ne | 5 pagrindiniai aktoriai |
| 6 | GET | `/api/shows/:id/seasons` | Ne | Sezonų sąrašas |
| 7 | GET | `/api/shows/:id/episodes` | Ne | Visi epizodai |
| 8 | GET | `/api/watchlist` | **Taip** | Sąrašas vartotojo išsaugotų serialų |
| 9 | POST | `/api/watchlist` | **Taip** | Pridėti serialą į sąrašą |
| 10 | PATCH | `/api/watchlist/:id` | **Taip** | Atnaujinti statusą arba pastabą |
| 11 | DELETE | `/api/watchlist/:id` | **Taip** | Šalinti iš sąrašo |
| 12 | GET | `/api/episodes/:show_id` | **Taip** | Gauti pažiūrėtų epizodų ID |
| 13 | POST | `/api/episodes` | **Taip** | Pažymėti epizodą kaip pažiūrėtą |
| 14 | DELETE | `/api/episodes/:episode_id` | **Taip** | Atpažymėti epizodą |

---

## Kur kodas yra

- Endpoint'ai 1–2: `src/routes/auth.js`
- Endpoint'ai 3–7: `src/routes/shows.js`
- Endpoint'ai 8–11: `src/routes/watchlist.js`
- Endpoint'ai 12–14: `src/routes/episodes.js`
- Visi prijungti: `server.js`

---

## Dokumentai

[[07-routes-auth]] · [[08-routes-shows]] · [[09-routes-watchlist]] · [[10-routes-episodes]] · [[02-server]]
