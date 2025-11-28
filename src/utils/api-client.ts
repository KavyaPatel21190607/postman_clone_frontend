import axios from 'axios';

const api = axios.create({
    baseURL: 'https://postman-clone-backend-2ru3.onrender.com',
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

export default api;

