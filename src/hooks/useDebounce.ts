import { useState, useEffect } from 'react';
import { useProductsStore } from '../store/productsStore';

export function useDebounce() {
    const { searchQuery, setSearchQuery, setPage } = useProductsStore();
    const [localSearch, setLocalSearch] = useState(searchQuery);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (localSearch !== searchQuery) {
                setSearchQuery(localSearch);
                setPage(1);
            }
        }, 1000);
        return () => clearTimeout(timer);
    }, [localSearch, searchQuery, setPage, setSearchQuery]);

    return { setLocalSearch, localSearch };
}
