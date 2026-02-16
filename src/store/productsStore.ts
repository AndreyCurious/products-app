import { create } from 'zustand';
import type { Product, SortConfig, SortField, SortOrder } from '../types';

interface ProductsState {
    products: Product[];
    filteredProducts: Product[];
    searchQuery: string;
    sortConfig: SortConfig;
    isLoading: boolean;
    error: string | null;
    setProducts: (products: Product[]) => void;
    setSortConfig: (field: SortField) => void;
    sortProducts: () => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    setSearchQuery: (searchQuery: string) => void;
    currentPage: number;
    setPage: (currentPage: number) => void;
}

export const useProductsStore = create<ProductsState>((set, get) => ({
    products: [],
    currentPage: 1,
    filteredProducts: [],
    searchQuery: '',
    sortConfig: { field: 'title', order: 'asc' },
    isLoading: false,
    error: null,

    setProducts: (products) => {
        set({ products });
        get().sortProducts();
    },

    setPage: (currentPage) => set({ currentPage }),

    setSearchQuery: (searchQuery) => {
        set({ searchQuery });
    },

    setSortConfig: (field) => {
        const { sortConfig } = get();
        const newOrder: SortOrder =
            sortConfig.field === field && sortConfig.order === 'asc'
                ? 'desc'
                : 'asc';

        set({ sortConfig: { field, order: newOrder } });
        get().sortProducts();
    },

    sortProducts: () => {
        const { products, sortConfig } = get();
        const filtered = [...products];

        filtered.sort((a, b) => {
            const field = sortConfig.field;
            let comparison = 0;

            if (field === 'price') {
                comparison = a.price - b.price;
            } else if (field === 'rating') {
                comparison = a.rating - b.rating;
            } else if (field === 'title') {
                comparison = a.title.localeCompare(b.title);
            } else if (field === 'brand') {
                comparison = a.brand.localeCompare(b.brand);
            }

            return sortConfig.order === 'asc' ? comparison : -comparison;
        });

        set({ filteredProducts: filtered });
    },

    setLoading: (loading) => set({ isLoading: loading }),
    setError: (error) => set({ error }),
}));
