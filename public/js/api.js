// Central HTTP client for all API communication.
// Every fetch call in the app goes through request() here.
// Also manages the JWT token and user info in localStorage.

const API = '/api'; // base path — requests go to the same origin (no CORS needed)

// Keys used in localStorage to persist the session across page reloads
const TOKEN_KEY = 'watchly.token';
const USER_KEY  = 'watchly.user';

// --- Token and user storage ---
// The JWT is stored in localStorage so it survives page refresh.
// On logout, both keys are removed.

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}
export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}
export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getUser() {
  const raw = localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null; // parse the stored JSON string back to an object
}
export function setUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

// --- Core HTTP helper ---
//
// Usage examples:
//   request('/watchlist', { auth: true })                          → GET with Authorization header
//   request('/watchlist', { method: 'POST', auth: true, body: … }) → POST with JSON body + auth
//
// Options:
//   method  — HTTP verb, defaults to 'GET'
//   body    — object to JSON-encode and send as the request body
//   auth    — if true, attach the stored JWT as "Authorization: Bearer <token>"
export async function request(path, { method = 'GET', body, auth = false } = {}) {
  const headers = {};

  // JSON body: tell the server the request body is JSON
  if (body !== undefined) headers['Content-Type'] = 'application/json';

  // Authorization header: "Bearer <token>" — required by requireAuth middleware
  if (auth) {
    const t = getToken();
    if (!t) throw new ApiError('not authenticated', 401);
    headers['Authorization'] = `Bearer ${t}`;
  }

  const res = await fetch(`${API}${path}`, {
    method,
    headers,
    // JSON.stringify converts the body object to a string; undefined means no body (GET)
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  // HTTP 204 No Content — successful but no body (e.g. after DELETE)
  if (res.status === 204) return null;

  // Try to parse the response body as JSON
  let data = null;
  try {
    data = await res.json();
  } catch {
    // empty or non-JSON body — data stays null
  }

  // Any 4xx or 5xx status → throw so callers can catch and handle errors
  if (!res.ok) {
    throw new ApiError(data?.error || `request failed: ${res.status}`, res.status);
  }

  return data;
}

// Custom error class that carries the HTTP status code alongside the message.
// Callers can check e.status === 409 (conflict), 401 (unauthorized), etc.
export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}
