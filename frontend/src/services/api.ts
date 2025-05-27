import axios from 'axios';

// 创建axios实例
const api = axios.create({
    baseURL: '/api/v1',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 请求拦截器
api.interceptors.request.use(
    (config) => {
        // 可以在这里添加token等认证信息
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

// 响应拦截器
api.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        // 统一错误处理
        console.error('API Error:', error);
        return Promise.reject(error);
    }
);

// API接口定义
export const dashboardAPI = {
    getOverview: () => api.get('/dashboard/overview'),
    getStats: () => api.get('/dashboard/stats'),
};

export const carbonAPI = {
    getEmissions: () => api.get('/carbon/emissions'),
    getFactors: () => api.get('/carbon/factors'),
};

export const warehouseAPI = {
    getList: () => api.get('/warehouse/list'),
    getMonitoring: () => api.get('/warehouse/monitoring'),
};

export const logisticsAPI = {
    getVehicles: () => api.get('/logistics/vehicles'),
    getRoutes: () => api.get('/logistics/routes'),
};

export default api; 