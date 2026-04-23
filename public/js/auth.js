// Login, register, and logout helpers for the frontend.
// Called by app.js when the user submits the auth form.
// On success, the JWT is stored in localStorage via api.js.

import { request, setToken, clearToken, setUser } from './api.js';

// Sends credentials to the server and stores the returned JWT.
// Note: no { auth: true } — there is no token yet when logging in.
export async function login(username, password) {
  // POST /api/auth/login → { token, user }
  // Content-Type: application/json is set automatically by request() when body is provided
  const { token, user } = await request('/auth/login', {
    method: 'POST',
    body: { username, password }, // request body (JSON)
  });
  setToken(token); // store JWT in localStorage for future requests
  setUser(user);   // store user info so app.js can display the username
  return user;
}

// Same flow as login — the server creates the account and immediately returns a token.
export async function register(username, password) {
  // POST /api/auth/register → { token, user }
  const { token, user } = await request('/auth/register', {
    method: 'POST',
    body: { username, password },
  });
  setToken(token);
  setUser(user);
  return user;
}

// Clears the stored token and user — the next page load will show the auth form.
export function logout() {
  clearToken();
}
