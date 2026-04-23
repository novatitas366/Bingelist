# Assessment: API Endpoints

**Requirement:** API has at least 5 endpoints ("web services")  
**Status: ✅ 14 endpoints implemented**

---

## All endpoints

| # | Method | Path | Auth | Purpose |
|---|---|---|---|---|
| 1 | POST | `/api/auth/register` | No | Create a new user account |
| 2 | POST | `/api/auth/login` | No | Log in, receive a JWT token |
| 3 | GET | `/api/shows/search?q=` | No | Search TVMaze for shows |
| 4 | GET | `/api/shows/:id` | No | Full show details |
| 5 | GET | `/api/shows/:id/cast` | No | Top 5 cast members |
| 6 | GET | `/api/shows/:id/seasons` | No | Season list |
| 7 | GET | `/api/shows/:id/episodes` | No | All episodes |
| 8 | GET | `/api/watchlist` | **Yes** | List user's saved shows |
| 9 | POST | `/api/watchlist` | **Yes** | Add a show to the list |
| 10 | PATCH | `/api/watchlist/:id` | **Yes** | Update status or note |
| 11 | DELETE | `/api/watchlist/:id` | **Yes** | Remove from list |
| 12 | GET | `/api/episodes/:show_id` | **Yes** | Get watched episode IDs |
| 13 | POST | `/api/episodes` | **Yes** | Mark episode as watched |
| 14 | DELETE | `/api/episodes/:episode_id` | **Yes** | Unmark episode |

---

## Where the code is

- Endpoints 1–2: `src/routes/auth.js`
- Endpoints 3–7: `src/routes/shows.js`
- Endpoints 8–11: `src/routes/watchlist.js`
- Endpoints 12–14: `src/routes/episodes.js`
- All mounted in: `server.js`

---

## Docs

[[07-routes-auth]] · [[08-routes-shows]] · [[09-routes-watchlist]] · [[10-routes-episodes]] · [[02-server]]
