import { useState, type FC } from 'react';
import { useForm } from 'react-hook-form';
import { authService } from '../../../services/api';
import { useAuthStore } from '../../../store/authStore';
import ErrorMessage from '../../common/errorMessage/ErrorMessage';
import './RegisterModal.css';
import { AxiosError } from 'axios';

interface RegisterModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface RegisterFormData {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
}

const RegisterModal: FC<RegisterModalProps> = ({ isOpen, onClose }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const { login } = useAuthStore();

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm<RegisterFormData>({
        defaultValues: {
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
            firstName: '',
            lastName: '',
        },
    });

    const password = watch('password');

    const validatePassword = (value: string) => {
        if (value.length < 6) {
            return 'Пароль должен содержать минимум 6 символов';
        }
        return true;
    };

    const onSubmit = async (data: RegisterFormData) => {
        setIsLoading(true);
        setError(null);

        try {
            const registerResponse = await authService.register({
                username: data.username,
                password: data.password,
                email: data.email,
                firstName: data.firstName,
                lastName: data.lastName,
            });

            console.log('Registration successful:', registerResponse);

            setSuccess(true);

            setTimeout(async () => {
                try {
                    await login(data.username, data.password, false);
                    onClose();
                    reset();
                } catch (loginError) {
                    console.error('Auto-login failed:', loginError);
                    onClose();
                }
            }, 1500);
        } catch (err: unknown) {
            if (err instanceof AxiosError) {
                console.error('Registration error:', err);
                setError(
                    err.message ||
                        'Ошибка при регистрации. Попробуйте другой логин.',
                );
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        reset();
        setError(null);
        setSuccess(false);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Создание аккаунта</h2>
                    <button className="close-button" onClick={handleClose}>
                        ×
                    </button>
                </div>

                {success ? (
                    <div className="success-message">
                        Аккаунт успешно создан! Выполняется вход...
                    </div>
                ) : (
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="register-form"
                    >
                        <div className="form-row">
                            <div className="form-group">
                                <label
                                    htmlFor="firstName"
                                    className="form-label"
                                >
                                    Имя
                                </label>
                                <input
                                    id="firstName"
                                    type="text"
                                    className={`form-input ${errors.firstName ? 'input-error' : ''}`}
                                    {...register('firstName', {
                                        required: 'Имя обязательно',
                                    })}
                                />
                                {errors.firstName && (
                                    <ErrorMessage
                                        message={errors.firstName.message || ''}
                                    />
                                )}
                            </div>

                            <div className="form-group">
                                <label
                                    htmlFor="lastName"
                                    className="form-label"
                                >
                                    Фамилия
                                </label>
                                <input
                                    id="lastName"
                                    type="text"
                                    className={`form-input ${errors.lastName ? 'input-error' : ''}`}
                                    {...register('lastName', {
                                        required: 'Фамилия обязательна',
                                    })}
                                />
                                {errors.lastName && (
                                    <ErrorMessage
                                        message={errors.lastName.message || ''}
                                    />
                                )}
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="username" className="form-label">
                                Логин *
                            </label>
                            <input
                                id="username"
                                type="text"
                                className={`form-input ${errors.username ? 'input-error' : ''}`}
                                placeholder="john_doe"
                                {...register('username', {
                                    required: 'Логин обязателен',
                                    minLength: {
                                        value: 3,
                                        message:
                                            'Логин должен содержать минимум 3 символа',
                                    },
                                    pattern: {
                                        value: /^[a-zA-Z0-9_]+$/,
                                        message:
                                            'Логин может содержать только буквы, цифры и _',
                                    },
                                })}
                            />
                            {errors.username && (
                                <ErrorMessage
                                    message={errors.username.message || ''}
                                />
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="email" className="form-label">
                                Email *
                            </label>
                            <input
                                id="email"
                                type="email"
                                className={`form-input ${errors.email ? 'input-error' : ''}`}
                                placeholder="john@example.com"
                                {...register('email', {
                                    required: 'Email обязателен',
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: 'Введите корректный email',
                                    },
                                })}
                            />
                            {errors.email && (
                                <ErrorMessage
                                    message={errors.email.message || ''}
                                />
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="password" className="form-label">
                                Пароль *
                            </label>
                            <input
                                id="password"
                                type="password"
                                className={`form-input ${errors.password ? 'input-error' : ''}`}
                                {...register('password', {
                                    required: 'Пароль обязателен',
                                    validate: validatePassword,
                                })}
                            />
                            {errors.password ? (
                                <ErrorMessage
                                    message={errors.password.message || ''}
                                />
                            ) : (
                                <div className="password-requirements">
                                    Минимум 6 символов
                                </div>
                            )}
                        </div>

                        <div className="form-group">
                            <label
                                htmlFor="confirmPassword"
                                className="form-label"
                            >
                                Подтверждение пароля *
                            </label>
                            <input
                                id="confirmPassword"
                                type="password"
                                className={`form-input ${errors.confirmPassword ? 'input-error' : ''}`}
                                {...register('confirmPassword', {
                                    required:
                                        'Подтверждение пароля обязательно',
                                    validate: (value) =>
                                        value === password ||
                                        'Пароли не совпадают',
                                })}
                            />
                            {errors.confirmPassword && (
                                <ErrorMessage
                                    message={
                                        errors.confirmPassword.message || ''
                                    }
                                />
                            )}
                        </div>

                        {error && <div className="form-error">{error}</div>}

                        <div className="modal-actions">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="modal-button secondary"
                                disabled={isLoading}
                            >
                                Отмена
                            </button>
                            <button
                                type="submit"
                                className="modal-button primary"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Создание...' : 'Создать аккаунт'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default RegisterModal;
