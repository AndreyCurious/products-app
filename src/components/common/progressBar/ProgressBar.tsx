import type { FC } from 'react';
import './ProgressBar.css';

interface ProgressBarProps {
    isLoading: boolean;
}

const ProgressBar: FC<ProgressBarProps> = ({ isLoading }) => {
    if (!isLoading) return null;

    return (
        <div className="progress-bar-container">
            <div className="progress-bar-fill" />
        </div>
    );
};

export default ProgressBar;
