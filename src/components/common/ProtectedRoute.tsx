import { Navigate } from 'react-router-dom';
import { useAuthStore, isAuthenticated } from '../../store/authStore';
import LoadingSpinner from './LoadingSpinner';
import type { FC, ReactNode } from 'react';

interface ProtectedRouteProps {
    children: ReactNode;
}

const ProtectedRoute: FC<ProtectedRouteProps> = ({ children }) => {
    const { isLoading } = useAuthStore();
    const authenticated = isAuthenticated();

    if (isLoading) {
        return (
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                }}
            >
                <LoadingSpinner />
            </div>
        );
    }

    if (!authenticated) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
