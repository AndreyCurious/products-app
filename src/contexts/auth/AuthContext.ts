import { createContext } from 'react';
import type { AuthResponse } from '../../types';

interface AuthContextType {
    user: AuthResponse | null;
    login: (
        username: string,
        password: string,
        rememberMe: boolean,
    ) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
    error: string | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(
    undefined,
);
