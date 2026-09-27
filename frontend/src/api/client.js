import axios from 'axios';

// Accept both `http://host:5000` and `http://host:5000/api` env formats.
// All call sites use the `/api/...` prefix, so normalize the base to the origin.
function normalizeBase(raw) {
  const fallback = 'http://localhost:5000';
  let base = (raw || fallback).trim().replace(/\/+$/, '');
  if (!base) return fallback;
  if (!/^https?:\/\//i.test(base)) base = `https://${base}`;
  // Strip a trailing `/api` (and any `/api/...` suffix) to avoid `/api/api/...`
  base = base.replace(/\/api(\/.*)?$/i, '');
  return base.replace(/\/+$/, '') || fallback;
}

const API = normalizeBase(import.meta.env.VITE_API_URL);

const client = axios.create({
  baseURL: API,
  headers: { 'Content-Type': 'application/json' },
});

client.interceptors.request.use(cfg => {
  const token = localStorage.getItem('amd_token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

client.interceptors.response.use(
  r => r,
  err => {
    if (err.response?.status === 401) {
      // optionally auto-logout — keep token for now to allow manual re-login
    }
    return Promise.reject(err);
  }
);

export default client;
export const API_URL = API;
