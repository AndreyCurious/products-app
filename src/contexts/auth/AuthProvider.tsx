import { useState, type FC, type ReactNode } from 'react';
import { authService } from '../../services/api';
import type { AuthResponse } from '../../types';
import { AuthContext } from './AuthContext';

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<AuthResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const login = async (
        username: string,
        password: string,
        rememberMe: boolean,
    ) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await authService.login(
                { username, password },
                rememberMe,
            );
            setUser(response);
            if (rememberMe) {
                localStorage.setItem('accessToken', response.accessToken);
                localStorage.setItem('refreshToken', response.refreshToken);
            } else {
                sessionStorage.setItem('accessToken', response.accessToken);
                sessionStorage.setItem('refreshToken', response.refreshToken);
            }
        } catch (err) {
            setError('Неверный логин или пароль');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoading, error }}>
            {children}
        </AuthContext.Provider>
    );
};
