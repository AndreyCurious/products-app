import { useEffect, useState, type FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { productsService } from '../../services/api';
import { useAuthStore } from '../../store/authStore';
import { useProductsStore } from '../../store/productsStore';
import ProductsTable from '../../components/products/productsTable/ProductsTable';
import './ProductsPage.css';
import SearchBar from '../../components/products/searchBar/SearchBar';
import Pagination from '../../components/products/pagination/Pagination';
import { useDebounce } from '../../hooks/useDebounce';
import ProgressBar from '../../components/common/progressBar/ProgressBar';
import AddProductModal from '../../components/products/addProductModal/AddProductModal';
import Toast from '../../components/common/toast/Toast';
import type { Product } from '../../types';

const LIMIT = 20;

const ProductsPage: FC = () => {
    const navigate = useNavigate();
    const { logout } = useAuthStore();

    const {
        filteredProducts,
        searchQuery,
        setProducts,
        setLoading,
        setError,
        currentPage,
        setPage,
    } = useProductsStore();

    const [isPageLoading, setIsPageLoading] = useState(false);
    const [toast, setToast] = useState<{
        message: string;
        type: 'success' | 'error';
    } | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const { localSearch, setLocalSearch } = useDebounce();

    const skip = (currentPage - 1) * LIMIT;

    const { data, isLoading, error, isFetching } = useQuery({
        queryKey: ['products', searchQuery, currentPage],
        queryFn: () => {
            setIsPageLoading(true);

            try {
                return productsService.getProducts(skip, LIMIT, searchQuery);
            } finally {
                setTimeout(() => setIsPageLoading(false), 500);
            }
        },
    });

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handlePageChange = (newPage: number) => {
        console.log(newPage);
        setPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleAddProduct = () => {
        setIsAddModalOpen(true);
    };

    const handleAddProductSubmit = (newProduct: Product) => {
        const currentProducts = useProductsStore.getState().products;

        useProductsStore
            .getState()
            .setProducts([newProduct, ...currentProducts]);

        setIsAddModalOpen(false);

        setToast({
            message: 'Товар успешно добавлен!',
            type: 'success',
        });

        setTimeout(() => {
            setToast(null);
        }, 3000);
    };

    useEffect(() => {
        setLoading(isLoading);
    }, [isLoading, setLoading]);

    useEffect(() => {
        if (data?.products) {
            setProducts(data.products);
        }
    }, [data, setProducts]);

    useEffect(() => {
        if (error) {
            setError(error.message);
        }
    }, [error, setError]);

    return (
        <div className="products-page">
            <ProgressBar isLoading={isLoading || isFetching || isPageLoading} />
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            <header className="products-header">
                <h1>Товары</h1>
                <SearchBar value={localSearch} onChange={setLocalSearch} />
                <button onClick={handleLogout} className="logout-button">
                    Выйти
                </button>
            </header>

            <div className="products-content">
                <div className="products-toolbar">
                    <button onClick={handleAddProduct} className="add-button">
                        + Добавить
                    </button>
                </div>

                <ProductsTable />

                <div className="products-footer">
                    <div className="products-info">
                        Показано 1-{filteredProducts.length} из{' '}
                        {data?.total || 0}
                    </div>
                    <Pagination
                        skip={skip}
                        limit={LIMIT}
                        total={data?.total || 0}
                        onPageChange={handlePageChange}
                        currentPage={currentPage}
                    />
                </div>
            </div>

            <AddProductModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAdd={handleAddProductSubmit}
            />
        </div>
    );
};

export default ProductsPage;
