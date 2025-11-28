import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5051/api';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
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
    (error) => {
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    getMe: () => api.get('/auth/me'),
};

// Subscription API
export const subscriptionAPI = {
    getPlans: () => api.get('/subscriptions/plans'),
    createCheckout: (data) => api.post('/subscriptions/create-checkout', data),
    getCurrentSubscription: () => api.get('/subscriptions/current'),
    cancelSubscription: () => api.post('/subscriptions/cancel'),
};

// Tickets API
export const ticketsAPI = {
    getAll: (params) => api.get('/tickets', { params }),
    getOne: (id) => api.get(`/tickets/${id}`),
    create: (data) => api.post('/tickets', data),
    update: (id, data) => api.put(`/tickets/${id}`, data),
    delete: (id) => api.delete(`/tickets/${id}`),
};

export default api;