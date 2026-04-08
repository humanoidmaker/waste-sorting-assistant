import { useState, useEffect, useCallback } from 'react';
import { login as apiLogin, register as apiRegister, getMe } from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('ecosort_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('ecosort_token');
    if (token) {
      getMe()
        .then((res) => {
          setUser(res.data);
          localStorage.setItem('ecosort_user', JSON.stringify(res.data));
        })
        .catch(() => {
          localStorage.removeItem('ecosort_token');
          localStorage.removeItem('ecosort_user');
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await apiLogin({ email, password });
    localStorage.setItem('ecosort_token', res.data.access_token);
    localStorage.setItem('ecosort_user', JSON.stringify(res.data.user));
    setUser(res.data.user);
    return res.data;
  }, []);

  const register = useCallback(async (data: any) => {
    const res = await apiRegister(data);
    localStorage.setItem('ecosort_token', res.data.access_token);
    localStorage.setItem('ecosort_user', JSON.stringify(res.data.user));
    setUser(res.data.user);
    return res.data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('ecosort_token');
    localStorage.removeItem('ecosort_user');
    setUser(null);
  }, []);

  return { user, loading, login, register, logout };
}
