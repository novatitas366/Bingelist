// Opens the SQLite database and creates all tables on first run.
// This file is imported once at startup (from server.js) as a side-effect.
// After this module runs, every other module can import { db } to query the database.

import Database from 'better-sqlite3'; // synchronous SQLite driver for Node
import path from 'node:path';
import fs from 'node:fs';

// Allow the database path to be overridden via environment variable.
// Default: watchly.db in the project root.
const dbPath = process.env.DB_PATH || './watchly.db';

// Create any missing parent directories for the database file.
// mkdirSync with { recursive: true } is a no-op if the directory already exists.
const dir = path.dirname(dbPath);
if (dir !== '.') fs.mkdirSync(dir, { recursive: true });

// Open (or create) the database file.
export const db = new Database(dbPath);

// WAL (Write-Ahead Logging) mode: readers don't block writers and vice versa.
// Better performance for concurrent web requests.
db.pragma('journal_mode = WAL');

// Enforce foreign key constraints (SQLite disables them by default).
// This means deleting a user automatically deletes their watchlist rows (ON DELETE CASCADE).
db.pragma('foreign_keys = ON');

// CREATE TABLE IF NOT EXISTS means this is safe to run on every startup —
// it only creates the tables the first time; subsequent runs do nothing.
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    username      TEXT UNIQUE NOT NULL,           -- must be unique across all users
    password_hash TEXT NOT NULL,                  -- bcrypt hash, never the plain password
    created_at    TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS watchlist (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id    INTEGER NOT NULL,                  -- which user owns this entry
    show_id    INTEGER NOT NULL,                  -- TVMaze show ID
    show_name  TEXT NOT NULL,
    show_image TEXT,                              -- nullable: not all shows have images
    status     TEXT NOT NULL CHECK(status IN ('plan_to_watch','watching','watched','dropped')),
    note       TEXT,                              -- user's personal note, optional
    added_at   TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(user_id, show_id)                      -- a user can only add the same show once
  );

  CREATE TABLE IF NOT EXISTS watched_episodes (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id    INTEGER NOT NULL,
    show_id    INTEGER NOT NULL,                  -- redundant for query efficiency
    episode_id INTEGER NOT NULL,                  -- TVMaze episode ID
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(user_id, episode_id)                   -- can't mark the same episode twice
  );

  -- Indexes speed up the most common queries (filtering by user_id)
  CREATE INDEX IF NOT EXISTS idx_watchlist_user      ON watchlist(user_id);
  CREATE INDEX IF NOT EXISTS idx_watched_user_show   ON watched_episodes(user_id, show_id);
`);

// Helper used by route files to detect a SQLite UNIQUE constraint violation.
// SQLite surfaces constraint errors through the error message string, not a typed error class.
// Usage: if (isUniqueViolation(e)) return res.status(409)...
export function isUniqueViolation(e) {
  return String(e.message).includes('UNIQUE');
}
