import type { FC } from 'react';
import './Pagination.css';

interface PaginationProps {
    skip: number;
    limit: number;
    total: number;
    onPageChange: (newSkip: number) => void;
    currentPage: number;
}

const Pagination: FC<PaginationProps> = ({
    limit,
    total,
    onPageChange,
    currentPage,
}) => {
    const totalPages = Math.ceil(total / limit);

    if (totalPages <= 1) {
        return null;
    }

    const handlePrevious = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        console.log(currentPage, totalPages);
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    const getVisiblePages = () => {
        const delta = 2;
        const range = [];
        const rangeWithDots: (number | string)[] = [];
        let l: number;

        for (let i = 1; i <= totalPages; i++) {
            if (
                i === 1 ||
                i === totalPages ||
                (i >= currentPage - delta && i <= currentPage + delta)
            ) {
                range.push(i);
            }
        }

        range.forEach((i) => {
            if (l) {
                if (i - l === 2) {
                    rangeWithDots.push(l + 1);
                } else if (i - l !== 1) {
                    rangeWithDots.push('...');
                }
            }
            rangeWithDots.push(i);
            l = i;
        });

        return rangeWithDots;
    };

    const visiblePages = getVisiblePages();

    console.log(currentPage);
    console.log(totalPages);

    return (
        <div className="pagination">
            <button
                className="pagination-nav-button prev-button"
                onClick={handlePrevious}
                disabled={currentPage === 1}
                aria-label="Предыдущая страница"
            />

            {visiblePages.map((page, index) => {
                if (page === '...') {
                    return (
                        <span key={`dots-${index}`} className="pagination-dots">
                            ...
                        </span>
                    );
                }

                return (
                    <button
                        key={page}
                        className={`pagination-button ${currentPage === page ? 'active' : ''}`}
                        onClick={() => onPageChange(page as number)}
                    >
                        {page}
                    </button>
                );
            })}

            <button
                className="pagination-nav-button next-button"
                onClick={handleNext}
                disabled={currentPage === totalPages}
                aria-label="Следующая страница"
            />
        </div>
    );
};

export default Pagination;
