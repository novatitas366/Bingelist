// Entry point for the Watchly server.
// This file wires together middleware, routes, and the HTTP/HTTPS server.
// When Node runs this file, it:
//   1. Reads environment variables from .env
//   2. Opens the database (via the db.js import side-effect)
//   3. Registers all route groups under /api/*
//   4. Serves the React-less SPA from the public/ folder
//   5. Starts listening for connections

import 'dotenv/config';        // loads .env into process.env before anything else reads it
import express from 'express';
import https from 'node:https'; // built-in Node HTTPS module
import http from 'node:http';   // built-in Node HTTP module
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Side-effect import: running db.js creates the database file and all tables
import './src/db.js';
import { ValidationError } from './src/validate.js';
// Each route file exports an Express Router for a specific domain
import authRoutes      from './src/routes/auth.js';
import showsRoutes     from './src/routes/shows.js';
import watchlistRoutes from './src/routes/watchlist.js';

// ES modules don't have __dirname, so we derive it from import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// Fail fast: if the JWT secret is missing we cannot sign or verify any tokens
if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET is not set. Create a .env file from .env.example.');
  process.exit(1);
}

const app = express();

// Parse incoming JSON request bodies (Content-Type: application/json).
// The 100kb limit prevents excessively large payloads.
app.use(express.json({ limit: '100kb' }));

// Mount each Router under its /api/* prefix.
// Requests to /api/auth/** are handled by authRoutes, etc.
app.use('/api/auth',      authRoutes);
app.use('/api/shows',     showsRoutes);
app.use('/api/watchlist', watchlistRoutes);

const publicDir = path.join(__dirname, 'public');

// Serve static files (HTML, CSS, JS, images) from the public/ folder.
// A request for /css/styles.css returns public/css/styles.css directly.
app.use(express.static(publicDir));

// SPA catch-all: any path that isn't /api/* and isn't a static file
// should return index.html so the browser-side router can handle it.
app.get(/^\/(?!api\/).*/, (req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

// Global error handler — Express calls this whenever a route does next(err).
// It must have exactly 4 parameters (err, req, res, next) to be recognised.
app.use((err, req, res, _next) => {
  // ValidationError comes from src/validate.js — bad user input → 400 Bad Request
  if (err instanceof ValidationError) {
    return res.status(400).json({ error: err.message, field: err.field });
  }
  // Some errors (e.g. from TVMaze proxy) already carry a status code
  if (err?.status && err.status >= 400 && err.status < 600) {
    return res.status(err.status).json({ error: err.message });
  }
  // Anything else is an unexpected server bug → 500 Internal Server Error
  console.error(err);
  res.status(500).json({ error: 'internal server error' });
});

const port     = Number(process.env.PORT) || 3000;
const keyPath  = process.env.SSL_KEY;
const certPath = process.env.SSL_CERT;

// Use HTTPS when SSL certificate paths are provided (production).
// Fall back to plain HTTP for local development.
if (keyPath && certPath) {
  const options = {
    key:  fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath),
  };
  https.createServer(options, app).listen(port, () => {
    console.log(`Watchly listening on https://localhost:${port}`);
  });
} else {
  console.warn('SSL_KEY/SSL_CERT not set — running HTTP only');
  http.createServer(app).listen(port, () => {
    console.log(`Watchly listening on http://localhost:${port}`);
  });
}
