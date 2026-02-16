export interface LoginCredentials {
    username: string;
    password: string;
}

export interface AuthResponse {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    gender: string;
    image: string;
    accessToken: string;
    refreshToken: string;
}

export interface RefreshTokenResponse {
    accessToken: string;
    refreshToken: string;
}

export interface AuthState {
    user: AuthResponse | null;
    accessToken: string | null;
    refreshToken: string | null;
    isLoading: boolean;
    error: string | null;
}

export interface Product {
    id: number;
    title: string;
    description: string;
    price: number;
    discountPercentage: number;
    rating: number;
    stock: number;
    brand: string;
    category: string;
    thumbnail: string;
    images: string[];
    sku: string;
}

export interface ProductsResponse {
    products: Product[];
    total: number;
    skip: number;
    limit: number;
}

export interface NewProduct {
    title: string;
    price: number;
    brand: string;
    sku?: string;
    rating?: number;
}

export interface Product {
    id: number;
    title: string;
    description: string;
    price: number;
    discountPercentage: number;
    rating: number;
    stock: number;
    brand: string;
    category: string;
    thumbnail: string;
    images: string[];
}

export interface ProductsResponse {
    products: Product[];
    total: number;
    skip: number;
    limit: number;
}

export interface NewProduct {
    title: string;
    price: number;
    brand: string;
    sku?: string;
    rating?: number;
}

export type SortField = 'title' | 'price' | 'rating' | 'brand';
export type SortOrder = 'asc' | 'desc';

export interface SortConfig {
    field: SortField;
    order: SortOrder;
}

export interface RegisterCredentials {
    username: string;
    password: string;
    email: string;
    firstName?: string;
    lastName?: string;
}

export interface RegisterResponse {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
}
