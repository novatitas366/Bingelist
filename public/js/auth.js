import { request, setToken, clearToken, setUser } from './api.js';

export async function login(username, password) {
  const { token, user } = await request('/auth/login', {
    method: 'POST',
    body: { username, password },
  });
  setToken(token);
  setUser(user);
  return user;
}

export async function register(username, password) {
  const { token, user } = await request('/auth/register', {
    method: 'POST',
    body: { username, password },
  });
  setToken(token);
  setUser(user);
  return user;
}

export function logout() {
  clearToken();
}
