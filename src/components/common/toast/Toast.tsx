import { useEffect, type FC } from 'react';
import './Toast.css';

interface ToastProps {
    message: string;
    type?: 'success' | 'error';
    duration?: number;
    onClose: () => void;
}

const Toast: FC<ToastProps> = ({
    message,
    type = 'success',
    duration = 3000,
    onClose,
}) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    return (
        <div className="toast-container">
            <div className={`toast ${type}`}>
                <span>{message}</span>
                <button className="toast-close" onClick={onClose}>
                    ×
                </button>
            </div>
        </div>
    );
};

export default Toast;
