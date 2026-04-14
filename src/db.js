import Database from 'better-sqlite3';
import path from 'node:path';
import fs from 'node:fs';

const dbPath = process.env.DB_PATH || './watchly.db';

const dir = path.dirname(dbPath);
if (dir && dir !== '.' && !fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

export const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS watchlist (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    show_id INTEGER NOT NULL,
    show_name TEXT NOT NULL,
    show_image TEXT,
    status TEXT NOT NULL CHECK(status IN ('plan_to_watch','watching','watched','dropped')),
    note TEXT,
    added_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(user_id, show_id)
  );

  CREATE TABLE IF NOT EXISTS watched_episodes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    show_id INTEGER NOT NULL,
    episode_id INTEGER NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(user_id, episode_id)
  );

  CREATE INDEX IF NOT EXISTS idx_watchlist_user ON watchlist(user_id);
  CREATE INDEX IF NOT EXISTS idx_watched_user_show ON watched_episodes(user_id, show_id);
`);
