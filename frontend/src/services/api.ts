import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ecosort_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('ecosort_token');
      localStorage.removeItem('ecosort_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// Auth
export const register = (data: any) => api.post('/auth/register', data);
export const login = (data: any) => api.post('/auth/login', data);
export const getMe = () => api.get('/auth/me');
export const updateSettings = (data: any) => api.put('/auth/settings', data);

// Classification
export const classifyWaste = (formData: FormData) =>
  api.post('/classify/waste', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const getHistory = (params?: any) => api.get('/classify/history', { params });
export const getClassifyStats = () => api.get('/classify/stats');
export const getGuide = () => api.get('/classify/guide');

export default api;
