import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { authService } from '../services/api';
import type { AuthState } from '../types';

interface AuthStore extends AuthState {
    login: (
        username: string,
        password: string,
        rememberMe: boolean,
    ) => Promise<void>;
    logout: () => void;
    clearError: () => void;
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            user: null,
            accessToken: null,
            refreshToken: null,
            isLoading: false,
            error: null,

            login: async (
                username: string,
                password: string,
                rememberMe: boolean,
            ) => {
                set({ isLoading: true, error: null });

                try {
                    const response = await authService.login(
                        { username, password },
                        rememberMe,
                    );

                    set({
                        user: response,
                        isLoading: false,
                        error: null,
                    });
                } catch (error) {
                    let errorMessage = 'Ошибка авторизации';

                    if (error instanceof Error) {
                        errorMessage = error.message;

                        const axiosError = error as {
                            response?: { status?: number };
                        };
                        const status = axiosError.response?.status;

                        if (status === 400 || status === 401) {
                            errorMessage = 'Неверный логин или пароль';
                        }
                    }

                    set({
                        error: errorMessage,
                        isLoading: false,
                    });

                    throw new Error(errorMessage);
                }
            },

            logout: () => {
                authService.logout();
                set({
                    user: null,
                    accessToken: null,
                    refreshToken: null,
                    error: null,
                });
            },

            clearError: () => {
                set({ error: null });
            },
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => localStorage),

            partialize: (state) => ({
                user: state.user,
                accessToken: state.accessToken,
                refreshToken: state.refreshToken,
            }),
        },
    ),
);

export const isAuthenticated = (): boolean => {
    const accessToken =
        localStorage.getItem('accessToken') ||
        sessionStorage.getItem('accessToken');

    const refreshToken =
        localStorage.getItem('refreshToken') ||
        sessionStorage.getItem('refreshToken');

    return !!(accessToken || refreshToken);
};

export const hasRefreshToken = (): boolean => {
    const storageRefreshToken =
        localStorage.getItem('refreshToken') ||
        sessionStorage.getItem('refreshToken');

    return !!storageRefreshToken;
};
