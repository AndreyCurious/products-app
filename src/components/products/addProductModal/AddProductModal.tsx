import {
    type ChangeEvent,
    type FC,
    type MouseEvent,
    type SubmitEvent,
    useState,
} from 'react';
import './AddProductModal.css';
import type { Product } from '../../../types';

interface AddProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (product: Product) => void;
}

interface FormData {
    name: string;
    price: string;
    vendor: string;
    sku: string;
}

interface FormErrors {
    name?: string;
    price?: string;
    vendor?: string;
    sku?: string;
}

const AddProductModal: FC<AddProductModalProps> = ({
    isOpen,
    onClose,
    onAdd,
}) => {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        price: '',
        vendor: '',
        sku: '',
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Наименование обязательно';
        } else if (formData.name.length < 3) {
            newErrors.name = 'Наименование должно содержать минимум 3 символа';
        }

        if (!formData.price.trim()) {
            newErrors.price = 'Цена обязательна';
        } else {
            const priceNum = Number(formData.price);
            if (isNaN(priceNum) || priceNum <= 0) {
                newErrors.price = 'Цена должна быть положительным числом';
            }
        }

        if (!formData.vendor.trim()) {
            newErrors.vendor = 'Вендор обязателен';
        }

        if (!formData.sku.trim()) {
            newErrors.sku = 'Артикул обязателен';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        if (errors[name as keyof FormErrors]) {
            setErrors((prev) => ({
                ...prev,
                [name]: undefined,
            }));
        }
    };

    const handleSubmit = async (e: SubmitEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        setTimeout(() => {
            const newProduct = {
                id: Date.now(),
                title: formData.name,
                price: Number(formData.price),
                brand: formData.vendor,
                sku: formData.sku,
                rating: 0,
                category: 'new',
                description: '',
                thumbnail: '',
                images: [],
                discountPercentage: 0,
                stock: 100,
            };

            onAdd(newProduct);
            setIsSubmitting(false);

            setFormData({
                name: '',
                price: '',
                vendor: '',
                sku: '',
            });
        }, 500);
    };

    const handleOverlayClick = (e: MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Добавить товар</h2>
                    <button className="close-button" onClick={onClose}>
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="add-product-form">
                    <div className="form-group">
                        <label htmlFor="name" className="form-label">
                            Наименование *
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            className={`form-input ${errors.name ? 'error' : ''}`}
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Введите наименование"
                        />
                        {errors.name && (
                            <div className="error-message">{errors.name}</div>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="price" className="form-label">
                            Цена *
                        </label>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            className={`form-input ${errors.price ? 'error' : ''}`}
                            value={formData.price}
                            onChange={handleChange}
                            placeholder="Введите цену"
                            min="0"
                            step="0.01"
                        />
                        {errors.price && (
                            <div className="error-message">{errors.price}</div>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="vendor" className="form-label">
                            Вендор *
                        </label>
                        <input
                            type="text"
                            id="vendor"
                            name="vendor"
                            className={`form-input ${errors.vendor ? 'error' : ''}`}
                            value={formData.vendor}
                            onChange={handleChange}
                            placeholder="Введите вендора"
                        />
                        {errors.vendor && (
                            <div className="error-message">{errors.vendor}</div>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="sku" className="form-label">
                            Артикул *
                        </label>
                        <input
                            type="text"
                            id="sku"
                            name="sku"
                            className={`form-input ${errors.sku ? 'error' : ''}`}
                            value={formData.sku}
                            onChange={handleChange}
                            placeholder="Введите артикул"
                        />
                        {errors.sku && (
                            <div className="error-message">{errors.sku}</div>
                        )}
                    </div>

                    <div className="modal-actions">
                        <button
                            type="button"
                            onClick={onClose}
                            className="modal-button secondary"
                            disabled={isSubmitting}
                        >
                            Отмена
                        </button>
                        <button
                            type="submit"
                            className="modal-button primary"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Добавление...' : 'Добавить'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProductModal;
