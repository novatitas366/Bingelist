export class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
  }
}

export function requireString(val, name, { min = 1, max = 10000 } = {}) {
  if (typeof val !== 'string') {
    throw new ValidationError(`${name} must be a string`, name);
  }
  const trimmed = val.trim();
  if (trimmed.length < min) {
    throw new ValidationError(`${name} must be at least ${min} characters`, name);
  }
  if (trimmed.length > max) {
    throw new ValidationError(`${name} must be at most ${max} characters`, name);
  }
  return trimmed;
}

export function optionalString(val, name, opts = {}) {
  if (val === undefined || val === null || val === '') return null;
  return requireString(val, name, opts);
}

export function requireInt(val, name) {
  const n = Number(val);
  if (!Number.isInteger(n)) {
    throw new ValidationError(`${name} must be an integer`, name);
  }
  return n;
}

export function requireEnum(val, name, allowed) {
  if (!allowed.includes(val)) {
    throw new ValidationError(
      `${name} must be one of: ${allowed.join(', ')}`,
      name
    );
  }
  return val;
}

export const WATCHLIST_STATUSES = ['plan_to_watch', 'watching', 'watched', 'dropped'];
