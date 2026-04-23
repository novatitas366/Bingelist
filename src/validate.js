// Input validation helpers for all route handlers.
//
// Every function either returns the cleaned value or throws a ValidationError.
// The global error handler in server.js catches ValidationError and returns HTTP 400.
// This keeps validation logic out of route handlers and centralised here.

// Custom error class that carries the field name alongside the message.
// The client receives: { error: "...", field: "username" }
// so it can highlight the correct form field.
export class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name  = 'ValidationError';
    this.field = field; // which request field caused the error
  }
}

// Validates that a value is a non-empty string within the given length bounds.
// Returns the trimmed string on success.
// Throws ValidationError if the value is missing, not a string, or out of bounds.
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

// Like requireString but allows null/undefined/empty — returns null in those cases.
// Used for optional fields like show_image and note.
export function optionalString(val, name, opts = {}) {
  if (val === undefined || val === null || val === '') return null;
  return requireString(val, name, opts);
}

// Validates that a value can be converted to a whole number (integer).
// Accepts numeric strings from URL parameters (req.params.id is always a string).
// Returns the integer on success.
export function requireInt(val, name) {
  const num = Number(val);
  if (!Number.isInteger(num)) {
    throw new ValidationError(`${name} must be an integer`, name);
  }
  return num;
}

// Validates that a value is one of the allowed choices.
// Returns the value unchanged on success.
export function requireEnum(val, name, allowed) {
  if (!allowed.includes(val)) {
    throw new ValidationError(
      `${name} must be one of: ${allowed.join(', ')}`,
      name
    );
  }
  return val;
}

// The four valid watchlist statuses — used in routes/watchlist.js and episodes.js.
export const WATCHLIST_STATUSES = ['plan_to_watch', 'watching', 'watched', 'dropped'];
