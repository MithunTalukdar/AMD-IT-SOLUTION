import { createContext, useContext, useEffect, useState } from 'react';
import client from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('amd_user');
    return raw ? JSON.parse(raw) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('amd_token'));
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    const { data } = await client.post('/api/auth/login', { email, password });
    const t = data.data.token;
    const u = data.data.user;
    localStorage.setItem('amd_token', t);
    localStorage.setItem('amd_user', JSON.stringify(u));
    setToken(t);
    setUser(u);
    return u;
  };

  const register = async (payload) => {
    const { data } = await client.post('/api/auth/register', payload);
    const t = data.data.token;
    const u = data.data.user;
    localStorage.setItem('amd_token', t);
    localStorage.setItem('amd_user', JSON.stringify(u));
    setToken(t);
    setUser(u);
    return u;
  };

  const logout = () => {
    localStorage.removeItem('amd_token');
    localStorage.removeItem('amd_user');
    setToken(null);
    setUser(null);
  };

  const fetchMe = async () => {
    if (!token) return;
    try {
      const { data } = await client.get('/api/auth/me');
      setUser(data.data);
      localStorage.setItem('amd_user', JSON.stringify(data.data));
    } catch {}
  };

  useEffect(() => { if (token) fetchMe(); }, []);

  const value = { user, token, loading, login, register, logout, setUser, setToken, isAdmin: user?.role === 'admin', isTechnician: user?.role === 'technician', isCustomer: user?.role === 'customer' || !user?.role };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
