import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const SALT_ROUNDS = 10;
const TOKEN_TTL = '7d';

function secret() {
  const s = process.env.JWT_SECRET;
  if (!s) {
    throw new Error('JWT_SECRET is not set. Refusing to start.');
  }
  return s;
}

export function hashPassword(password) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

export function signToken(userId) {
  return jwt.sign({ sub: userId }, secret(), { expiresIn: TOKEN_TTL });
}

export function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const match = header.match(/^Bearer (.+)$/);
  if (!match) {
    return res.status(401).json({ error: 'missing or invalid Authorization header' });
  }
  try {
    const payload = jwt.verify(match[1], secret());
    req.userId = Number(payload.sub);
    if (!Number.isInteger(req.userId)) {
      return res.status(401).json({ error: 'invalid token payload' });
    }
    next();
  } catch {
    return res.status(401).json({ error: 'invalid or expired token' });
  }
}
