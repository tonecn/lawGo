import axios from 'axios';

const request = axios.create({
    baseURL: '/api/',
    timeout: 10000,
});

export type APIResponse<T = any> = {
    statusCode: 200 | 201,
    timestamp: string,
    path: string,
    message: "请求成功",
    code: 0,
    data: T
}

export type APIError = {
    statusCode: number,
    timestamp: string,
    path: string,
    message: string,
    code: number
    data?: any;
}

request.interceptors.request.use(
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

request.interceptors.response.use(
    (response) => {
        return response.data.data;
    },
    (error) => {
        if (error?.response?.status === 401) {
            localStorage.removeItem('token');
        }
        if (error?.response?.data) {
            return Promise.reject(error.response.data);
        }
        return Promise.reject({
            statusCode: 0,
            timestamp: new Date().toISOString(),
            path: error.config?.url || '',
            message: "请求失败，请检查网络连接",
            code: 5000
        });
    }
);

export {
    request,
}