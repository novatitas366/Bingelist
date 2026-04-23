// Password hashing and JWT (JSON Web Token) helpers.
// Used by: src/routes/auth.js (sign tokens on login/register)
//          all protected routes via the requireAuth middleware exported here.

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const SALT_ROUNDS = 10; // bcrypt work factor — higher = slower but more secure
const TOKEN_TTL   = '7d'; // tokens expire after 7 days

// Read the JWT signing secret once at module load.
// server.js already exits if JWT_SECRET is missing, so this is always set.
const JWT_SECRET = process.env.JWT_SECRET;

// --- Password helpers ---

// Returns a Promise<string> — bcrypt.hash is async because it's CPU-intensive.
// NEVER store the plain password; store only the hash.
export function hashPassword(password) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

// Returns a Promise<boolean> — compares a plain password against a stored hash.
// Uses a timing-safe comparison internally to prevent timing attacks.
export function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

// --- JWT helpers ---

// Creates a signed JWT containing { sub: userId }.
// "sub" (subject) is the standard JWT claim for "who this token belongs to".
// The client stores this token and sends it on every authenticated request.
export function signToken(userId) {
  return jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: TOKEN_TTL });
}

// --- Express middleware ---

// requireAuth is an Express middleware function: (req, res, next) => void.
// Attach it to a Router or individual route to protect it from unauthenticated access.
//
// The client must send: Authorization: Bearer <token>
// On success: sets req.userId (integer) and calls next() to continue to the route handler.
// On failure: immediately responds with HTTP 401 Unauthorized — next() is NOT called.
export function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';

  // Extract the token from "Bearer <token>"
  const match = header.match(/^Bearer (.+)$/);
  if (!match) {
    return res.status(401).json({ error: 'missing or invalid Authorization header' });
  }

  try {
    // jwt.verify throws if the token is expired, tampered with, or signed with a wrong secret
    const payload = jwt.verify(match[1], JWT_SECRET);

    // payload.sub is the userId we stored in signToken — convert to a real integer
    req.userId = Number(payload.sub);
    if (!Number.isInteger(req.userId)) {
      return res.status(401).json({ error: 'invalid token payload' });
    }

    // Token is valid — pass control to the next middleware or route handler
    next();
  } catch {
    // Covers: TokenExpiredError, JsonWebTokenError, NotBeforeError
    return res.status(401).json({ error: 'invalid or expired token' });
  }
}
