import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

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
