import type { FC } from 'react';
import './ErrorMessage.css';

interface ErrorMessageProps {
    message: string;
}

const ErrorMessage: FC<ErrorMessageProps> = ({ message }) => {
    return <div className="error-message">{message}</div>;
};

export default ErrorMessage;
