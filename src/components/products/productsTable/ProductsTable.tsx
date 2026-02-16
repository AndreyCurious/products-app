import {
    useState,
    useRef,
    useEffect,
    useMemo,
    type FC,
    type ChangeEvent,
    type MouseEvent as ReactMouseEvent,
} from 'react';
import type { Product, SortField } from '../../../types';
import { useProductsStore } from '../../../store/productsStore';
import './ProductsTable.css';

// я бы использовал tanstack table и добавил виртуализацию + динамическую пагинацию, но в макете простая реализация таблицы, поэтому сделал сам

const ProductsTable: FC = () => {
    const {
        filteredProducts: products,
        sortConfig,
        currentPage,
        error,
        isLoading,
        setSortConfig,
    } = useProductsStore();

    const [selectedByPage, setSelectedByPage] = useState<
        Record<number, Set<number>>
    >({});
    const [activeActionMenu, setActiveActionMenu] = useState<number | null>(
        null,
    );
    const selectAllCheckbox = useRef<HTMLInputElement>(null);
    const actionMenuRef = useRef<HTMLDivElement>(null);

    const handleSort = (field: SortField) => {
        setSortConfig(field);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                actionMenuRef.current &&
                !actionMenuRef.current.contains(event.target as Node)
            ) {
                setActiveActionMenu(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const currentSelected = useMemo(
        () => selectedByPage[currentPage] || new Set<number>(),
        [selectedByPage, currentPage],
    );

    useEffect(() => {
        if (selectAllCheckbox.current) {
            if (products.length === 0) {
                selectAllCheckbox.current.checked = false;
                selectAllCheckbox.current.indeterminate = false;
            } else if (currentSelected.size === products.length) {
                selectAllCheckbox.current.checked = true;
                selectAllCheckbox.current.indeterminate = false;
            } else if (currentSelected.size > 0) {
                selectAllCheckbox.current.checked = false;
                selectAllCheckbox.current.indeterminate = true;
            } else {
                selectAllCheckbox.current.checked = false;
                selectAllCheckbox.current.indeterminate = false;
            }
        }
    }, [currentSelected, products]);

    const getSortIcon = (field: SortField) => {
        if (sortConfig.field !== field) return '↕️';
        return sortConfig.order === 'asc' ? '↑' : '↓';
    };

    const getSortClass = (field: SortField) => {
        let className = 'sortable';
        if (sortConfig.field === field) {
            className += ' active';
            className += sortConfig.order === 'asc' ? ' asc' : ' desc';
        }
        return className;
    };

    const getRatingClass = (rating: number) => {
        if (rating >= 4) return 'rating-high';
        if (rating >= 3) return 'rating-medium';
        return 'rating-low';
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('ru-RU', {
            style: 'currency',
            currency: 'RUB',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(price);
    };

    const handleSelectAll = (e: ChangeEvent<HTMLInputElement>) => {
        const newSelectedByPage = { ...selectedByPage };

        if (e.target.checked) {
            newSelectedByPage[currentPage] = new Set(products.map((p) => p.id));
        } else {
            newSelectedByPage[currentPage] = new Set();
        }

        setSelectedByPage(newSelectedByPage);
    };

    const handleSelectProduct = (productId: number, checked: boolean) => {
        const newSelectedByPage = { ...selectedByPage };
        const currentSelected = new Set(selectedByPage[currentPage] || []);

        if (checked) {
            currentSelected.add(productId);
        } else {
            currentSelected.delete(productId);
        }

        newSelectedByPage[currentPage] = currentSelected;
        setSelectedByPage(newSelectedByPage);
    };

    const handleActionClick = (productId: number, e: ReactMouseEvent) => {
        e.stopPropagation();
        setActiveActionMenu(activeActionMenu === productId ? null : productId);
    };

    const handleEdit = (product: Product) => {
        console.log('Edit product:', product);
        setActiveActionMenu(null);
        alert(`Редактировать товар: ${product.title}`);
    };

    const handleDelete = (product: Product) => {
        console.log('Delete product:', product);
        setActiveActionMenu(null);
        alert(`Удалить товар: ${product.title}`);
    };

    const handleDuplicate = (product: Product) => {
        console.log('Duplicate product:', product);
        setActiveActionMenu(null);
        alert(`Копировать товар: ${product.title}`);
    };

    if (isLoading) {
        return (
            <div className="products-table-container">
                <table className="products-table">
                    <tbody>
                        <tr>
                            <td colSpan={8} className="loading-cell">
                                Загрузка товаров...
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }

    if (error) {
        return (
            <div className="products-table-container">
                <table className="products-table">
                    <tbody>
                        <tr>
                            <td colSpan={8} className="error-cell">
                                Ошибка: {error}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }

    return (
        <div className="products-table-container">
            <table className="products-table">
                <thead>
                    <tr>
                        <th style={{ width: '40px' }}>
                            <input
                                type="checkbox"
                                className="checkbox"
                                ref={selectAllCheckbox}
                                onChange={handleSelectAll}
                            />
                        </th>
                        <th style={{ width: '50px' }}></th>
                        <th
                            className={getSortClass('title')}
                            onClick={() => handleSort('title')}
                        >
                            Наименование
                            <span className="sort-icon">
                                {getSortIcon('title')}
                            </span>
                        </th>
                        <th
                            className={getSortClass('brand')}
                            onClick={() => handleSort('brand')}
                        >
                            Вендор
                            <span className="sort-icon">
                                {getSortIcon('brand')}
                            </span>
                        </th>
                        <th>Артикул</th>
                        <th
                            className={getSortClass('rating')}
                            onClick={() => handleSort('rating')}
                        >
                            Оценка
                            <span className="sort-icon">
                                {getSortIcon('rating')}
                            </span>
                        </th>
                        <th
                            className={getSortClass('price')}
                            onClick={() => handleSort('price')}
                        >
                            Цена, ₽
                            <span className="sort-icon">
                                {getSortIcon('price')}
                            </span>
                        </th>
                        <th style={{ width: '60px' }}></th>
                    </tr>
                </thead>
                <tbody>
                    {products.length === 0 ? (
                        <tr>
                            <td colSpan={8} className="empty-cell">
                                Товары не найдены
                            </td>
                        </tr>
                    ) : (
                        products.map((product) => (
                            <tr
                                key={product.id}
                                className={
                                    currentSelected.has(product.id)
                                        ? 'selected'
                                        : ''
                                }
                            >
                                <td>
                                    <input
                                        type="checkbox"
                                        className="checkbox"
                                        checked={currentSelected.has(
                                            product.id,
                                        )}
                                        onChange={(e) =>
                                            handleSelectProduct(
                                                product.id,
                                                e.target.checked,
                                            )
                                        }
                                    />
                                </td>
                                <td>
                                    <img
                                        src={product.thumbnail}
                                        alt={product.title}
                                        className="product-thumbnail"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src =
                                                'https://via.placeholder.com/40';
                                        }}
                                    />
                                </td>
                                <td>
                                    <div className="product-info">
                                        <span className="product-title">
                                            {product.title}
                                        </span>
                                        <span className="product-category">
                                            {product.category}
                                        </span>
                                    </div>
                                </td>
                                <td>
                                    <span className="vendor">
                                        {product.brand}
                                    </span>
                                </td>
                                <td>
                                    <span className="sku">{product.sku}</span>
                                </td>
                                <td>
                                    <span
                                        className={getRatingClass(
                                            product.rating,
                                        )}
                                    >
                                        {product.rating.toFixed(1)}/5
                                    </span>
                                </td>
                                <td>
                                    <span className="price">
                                        {formatPrice(product.price)}
                                    </span>
                                </td>
                                <td>
                                    <div
                                        className="action-menu-container"
                                        ref={actionMenuRef}
                                    >
                                        <button
                                            className="action-button"
                                            onClick={(e) =>
                                                handleActionClick(product.id, e)
                                            }
                                        >
                                            ⋮
                                        </button>
                                        {activeActionMenu === product.id && (
                                            <div className="action-dropdown">
                                                <button
                                                    onClick={() =>
                                                        handleEdit(product)
                                                    }
                                                >
                                                    ✏️ Редактировать
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleDuplicate(product)
                                                    }
                                                >
                                                    📋 Копировать
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleDelete(product)
                                                    }
                                                >
                                                    🗑️ Удалить
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ProductsTable;
