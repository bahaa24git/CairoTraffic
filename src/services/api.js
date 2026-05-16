import axios from 'axios';

const apiBase = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const API_URL = `${apiBase.replace(/\/+$/, '')}/api`;

const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  res => res,
  err => {
    const isAuthRequest = err.config?.url?.startsWith('/auth/');

    if (err.response?.status === 401 && !isAuthRequest) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    return Promise.reject(err);
  }
);

export const authService = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
};

export const usersService = {
  getAll: () => api.get('/users'),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
};

export const roadsService = {
  getAll: (params) => api.get('/roads', { params }),
  getOne: (id) => api.get(`/roads/${id}`),
  create: (data) => api.post('/roads', data),
  update: (id, data) => api.put(`/roads/${id}`, data),
  delete: (id) => api.delete(`/roads/${id}`),
};

export const trafficService = {
  getAll: () => api.get('/traffic-status'),
  create: (data) => api.post('/traffic-status', data),
  update: (id, data) => api.put(`/traffic-status/${id}`, data),
};

export const incidentsService = {
  getAll: (params) => api.get('/incidents', { params }),
  create: (data) => api.post('/incidents', data),
  update: (id, data) => api.put(`/incidents/${id}`, data),
  delete: (id) => api.delete(`/incidents/${id}`),
};

export const camerasService = {
  getAll: () => api.get('/cameras'),
  create: (data) => api.post('/cameras', data),
  update: (id, data) => api.put(`/cameras/${id}`, data),
  delete: (id) => api.delete(`/cameras/${id}`),
};

export const sensorsService = {
  getAll: () => api.get('/sensors'),
  create: (data) => api.post('/sensors', data),
  update: (id, data) => api.put(`/sensors/${id}`, data),
  delete: (id) => api.delete(`/sensors/${id}`),
};

export const reportsService = {
  getSummary: () => api.get('/reports/summary'),
  getCongestion: () => api.get('/reports/congestion'),
  getIncidents: () => api.get('/reports/incidents'),
};

export const newsService = {
  getAll: () => api.get('/news'),
  create: (data) => api.post('/news', data),
  update: (id, data) => api.put(`/news/${id}`, data),
  delete: (id) => api.delete(`/news/${id}`),
};

export const contactService = {
  send: (data) => api.post('/contact', data),
  getAll: () => api.get('/contact'),
};

export default api;
