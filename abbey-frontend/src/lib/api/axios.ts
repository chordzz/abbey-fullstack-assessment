

import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";


export const tokenStorage = {
    // setTokens: (accessToken: string, refreshToken: string) => {
    setTokens: (accessToken: string) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('abbey_access_token', accessToken);
            // localStorage.setItem('abbey_refresh_token', refreshToken);
        }
    },

    getAccessToken: (): string | null => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('abbey_access_token');
        }
        return null;
    },

    // getRefreshToken: (): string | null => {
    //     if (typeof window !== 'undefined') {
    //         return localStorage.getItem('abbey_refresh_token');
    //     }
    //     return null;
    // },

    clearTokens: () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('abbey_access_token');
            // localStorage.removeItem('abbey_refresh_token');
        }
    },
};


const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api',
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: true,
});


axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        if (typeof window !== 'undefined') {

            const token = tokenStorage.getAccessToken();

            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }

        if (process.env.NODE_ENV === 'development') {
            console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
        }

        return config;
    },
    (error: AxiosError) => {
        console.error('[Request Error]', error);
        return Promise.reject(error);
    }
)

axiosInstance.interceptors.response.use(

    (response: AxiosResponse) => {
        // Log successful responses in development
        if (process.env.NODE_ENV === 'development') {
            console.log(`[API Response] ${response.status} ${response.config.url}`);
        }
        return response;
    },

    async (error: AxiosError) => {

        // Handle network errors
        if (!error.response) {
            console.error('[Network Error]', error.message);
            return Promise.reject(error);
        }

        const status = error.response.status;

        // Handle 401 Unauthorized - Token refresh logic
        // if (status === 401) {
        //     tokenStorage.clearTokens();
        //     if (typeof window !== 'undefined') {
        //         window.location.href = '/auth/signin';
        //     }
        //     return Promise.reject(error);
        // }

        // Handle 403 Forbidden - Clear auth and redirect
        // if (status === 403) {
        //     console.error('[403 Forbidden] Access denied');
        //     tokenStorage.clearTokens();
            
        //     if (typeof window !== 'undefined') {
        //         window.location.href = '/auth/signin';
        //     }
        //     return Promise.reject(error);
        // }

        // Handle 400 Bad Request
        if (status === 400) {
            console.error('[400 Bad Request]', error.response.data);
        }

        // Handle 404 Not Found
        if (status === 404) {
            console.error('[404 Not Found]', error.config?.url);
        }

        // Handle 500 Internal Server Error
        if (status >= 500) {
            console.error('[Server Error]', status, error.response.data);
        }

        // Log all errors in development
        if (process.env.NODE_ENV === 'development') {
            console.error('[API Error]', {
                status,
                url: error.config?.url,
                data: error.response.data,
            });
        }

        return Promise.reject(error);
    }
);


export default axiosInstance;