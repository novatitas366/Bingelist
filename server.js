import 'dotenv/config';
import express from 'express';
import https from 'node:https';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import './src/db.js';
import { ValidationError } from './src/validate.js';
import authRoutes from './src/routes/auth.js';
import showsRoutes from './src/routes/shows.js';
import watchlistRoutes from './src/routes/watchlist.js';
import episodesRoutes from './src/routes/episodes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET is not set. Create a .env file from .env.example.');
  process.exit(1);
}

const app = express();
app.use(express.json({ limit: '100kb' }));

app.use('/api/auth', authRoutes);
app.use('/api/shows', showsRoutes);
app.use('/api/watchlist', watchlistRoutes);
app.use('/api/episodes', episodesRoutes);

const publicDir = path.join(__dirname, 'public');
app.use(express.static(publicDir));

app.get(/^\/(?!api\/).*/, (req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

app.use((err, req, res, _next) => {
  if (err instanceof ValidationError) {
    return res.status(400).json({ error: err.message, field: err.field });
  }
  if (err?.status && err.status >= 400 && err.status < 600) {
    return res.status(err.status).json({ error: err.message });
  }
  console.error(err);
  res.status(500).json({ error: 'internal server error' });
});

const port = Number(process.env.PORT) || 3000;
const keyPath = process.env.SSL_KEY;
const certPath = process.env.SSL_CERT;

if (keyPath && certPath) {
  const options = {
    key: fs.readFileSync(keyPath),
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
