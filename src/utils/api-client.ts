import axios from 'axios';

const baseURL = ((import.meta as any).env && (import.meta as any).env.VITE_API_BASE_URL) || 'http://localhost:5000/api';

const api = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const user = localStorage.getItem('api_tool_user');
        if (user) {
            const { token } = JSON.parse(user);
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const authApi = {
    register: (data: { name: string; email: string; password: string }) =>
        api.post('/auth/register', data),
    login: (data: { email: string; password: string }) =>
        api.post('/auth/login', data),
};

export const dataApi = {
    getHistory: () => api.get('/history'),
    addToHistory: (data: any) => api.post('/history', data),
    clearHistory: () => api.delete('/history'),
    getCollections: () => api.get('/collections'),
    createCollection: (data: { name: string }) => api.post('/collections', data),
    deleteCollection: (id: string) => api.delete(`/collections/${id}`),
    addItemToCollection: (collectionId: string, data: any) =>
        api.post(`/collections/${collectionId}/items`, data),
    // Proxy helper - forwards arbitrary requests through backend proxy. Resolve for all statuses so UI can inspect errors.
    proxy: (payload: any) => api.post('/proxy', payload, { validateStatus: () => true }),
};

export const debugApi = {
    echo: (payload: any) => api.post('/debug/echo', payload, { validateStatus: () => true }),
    // Unprotected proxy debug (if you add an unprotected route) — kept for future use
    proxyUnprotected: (payload: any) => api.post('/debug/proxy', payload, { validateStatus: () => true }),
};

export default api;
