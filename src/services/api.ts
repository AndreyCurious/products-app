import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import type {
    AuthResponse,
    LoginCredentials,
    ProductsResponse,
    Product,
    NewProduct,
    RegisterCredentials,
    RegisterResponse,
    RefreshTokenResponse,
} from '../types';

const API_BASE_URL = 'https://dummyjson.com';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

interface QueueItem {
    resolve: (value: unknown) => void;
    reject: (reason?: Error) => void;
}

let isRefreshing = false;

let failedQueue: QueueItem[] = [];

const processQueue = (
    error: Error | null,
    token: string | null = null,
): void => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const accessToken =
        localStorage.getItem('accessToken') ||
        sessionStorage.getItem('accessToken');
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as ExtendedAxiosRequestConfig;

        if (!originalRequest) {
            return Promise.reject(error);
        }

        if (
            error.response?.status !== 401 ||
            originalRequest.url === '/auth/refresh'
        ) {
            return Promise.reject(error);
        }

        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            })
                .then((token) => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return api(originalRequest);
                })
                .catch((err) => Promise.reject(err));
        }

        isRefreshing = true;
        originalRequest._retry = true;

        try {
            const refreshToken =
                localStorage.getItem('refreshToken') ||
                sessionStorage.getItem('refreshToken');

            if (!refreshToken) {
                throw new Error('No refresh token available');
            }

            const response = await axios.post<RefreshTokenResponse>(
                `${API_BASE_URL}/auth/refresh`,
                {
                    refreshToken,
                    expiresInMins: 30,
                },
            );

            const { accessToken, refreshToken: newRefreshToken } =
                response.data;

            const rememberMe = !!localStorage.getItem('refreshToken');
            if (rememberMe) {
                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('refreshToken', newRefreshToken);
            } else {
                sessionStorage.setItem('accessToken', accessToken);
                sessionStorage.setItem('refreshToken', newRefreshToken);
            }

            originalRequest.headers.Authorization = `Bearer ${accessToken}`;

            processQueue(null, accessToken);

            return api(originalRequest);
        } catch (refreshError) {
            const error =
                refreshError instanceof Error
                    ? refreshError
                    : new Error('Refresh token failed');
            processQueue(error, null);

            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            sessionStorage.removeItem('accessToken');
            sessionStorage.removeItem('refreshToken');

            window.location.href = '/login';

            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    },
);

export const authService = {
    login: async (
        credentials: LoginCredentials,
        rememberMe: boolean,
    ): Promise<AuthResponse> => {
        try {
            const response = await api.post<AuthResponse>('/auth/login', {
                ...credentials,
                expiresInMins: 30,
            });

            const data = response.data;

            if (rememberMe) {
                localStorage.setItem('accessToken', data.accessToken);
                localStorage.setItem('refreshToken', data.refreshToken);
                sessionStorage.removeItem('accessToken');
                sessionStorage.removeItem('refreshToken');
            } else {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                sessionStorage.setItem('accessToken', data.accessToken);
                sessionStorage.setItem('refreshToken', data.refreshToken);
            }

            return data;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },

    register: async (
        userData: RegisterCredentials,
    ): Promise<RegisterResponse> => {
        try {
            const response = await api.post<RegisterResponse>('/users/add', {
                username: userData.username,
                password: userData.password,
                email: userData.email,
                firstName: userData.firstName || '',
                lastName: userData.lastName || '',
                age: 25,
                gender: 'male',
                phone: '+1234567890',
                birthDate: '2000-01-01',
            });

            return response.data;
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    },

    refreshToken: async (
        refreshToken: string,
    ): Promise<RefreshTokenResponse> => {
        const response = await api.post<RefreshTokenResponse>('/auth/refresh', {
            refreshToken,
            expiresInMins: 30,
        });
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        sessionStorage.removeItem('accessToken');
        sessionStorage.removeItem('refreshToken');
    },
};

export const productsService = {
    getProducts: async (
        skip: number = 0,
        limit: number = 20,
        query: string = '',
    ): Promise<ProductsResponse> => {
        const response = await api.get<ProductsResponse>(
            `/products/search?skip=${skip}&limit=${limit}&q=${query}`,
        );
        return response.data;
    },

    addProduct: async (product: NewProduct): Promise<Product> => {
        await new Promise((resolve) => setTimeout(resolve, 500));

        return {
            id: Math.floor(Math.random() * 10000),
            title: product.title,
            description: '',
            price: product.price,
            discountPercentage: 0,
            rating: product.rating || 0,
            stock: 100,
            brand: product.brand,
            category: 'new',
            thumbnail: '',
            images: [],
            sku: product.sku || `SKU-${Math.floor(Math.random() * 10000)}`,
        };
    },
};

export default api;
