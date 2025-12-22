import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
};

export const grievanceAPI = {
  getAllGrievances: () => api.get('/grievances/all'),
  getUserGrievances: () => api.get('/grievances'),
  getGrievanceById: (id) => api.get(`/grievances/${id}`),
  createGrievance: (data) => api.post('/grievances', data),
  updateGrievance: (id, data) => api.put(`/grievances/${id}`, data),
  deleteGrievance: (id) => api.delete(`/grievances/${id}`),
  addComment: (id, data) => api.post(`/grievances/${id}/comment`, data),
};

export const adminAPI = {
  getDashboardStats: () => api.get('/admin/dashboard'),
  getAllUsers: () => api.get('/admin/users'),
  getAllGrievances: (params) => api.get('/admin/grievances', { params }),
  assignGrievance: (data) => api.post('/admin/assign-grievance', data),
  updateUserRole: (data) => api.put('/admin/user-role', data),
};

export default api;
