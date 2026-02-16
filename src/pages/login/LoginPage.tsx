import { useState, type FC } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import './LoginPage.css';
import LoginInput from '../../components/login/loginInput/LoginInput';
import RegisterModal from '../../components/login/registerModal/RegisterModal';

export interface LoginForm {
    username: string;
    password: string;
    rememberMe: boolean;
}

const LoginPage: FC = () => {
    const navigate = useNavigate();
    const { login, isLoading, error, clearError } = useAuthStore();
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

    const handleOpenRegister = () => {
        setIsRegisterModalOpen(true);
        clearError();
    };

    const { register, handleSubmit, control } = useForm<LoginForm>({
        defaultValues: {
            username: '',
            password: '',
            rememberMe: false,
        },
    });

    const onSubmit = async (data: LoginForm) => {
        console.log(data);
        try {
            await login(data.username, data.password, data.rememberMe);
            navigate('/products');
        } catch (err) {
            console.error(err);
            // Ошибка уже обработана в store
        }
    };

    return (
        <>
            <div className="login-container">
                <div className="border-container">
                    <div className="login-box">
                        <div className="logo-container">
                            <img
                                alt="logo"
                                src="../../assets/Frame 1.svg"
                                width={52}
                            />
                        </div>

                        <h2 className="login-title">Добро пожаловать!</h2>
                        <p className="login-subtitle">
                            Пожалуйста, авторизируйтесь
                        </p>

                        <form
                            className="login-form"
                            onSubmit={handleSubmit(onSubmit)}
                        >
                            <LoginInput<LoginForm>
                                name="username"
                                control={control}
                                rules={{
                                    required: 'Логин обязателен',
                                    minLength: {
                                        value: 3,
                                        message:
                                            'Логин должен содержать минимум 3 символа',
                                    },
                                }}
                                label="Логин"
                                type="text"
                                placeholder="Введите логин"
                            />

                            <LoginInput<LoginForm>
                                name="password"
                                control={control}
                                rules={{
                                    required: 'Пароль обязателен',
                                    minLength: {
                                        value: 4,
                                        message:
                                            'Пароль должен содержать минимум 4 символа',
                                    },
                                }}
                                label="Пароль"
                                type="password"
                                placeholder="Введите пароль"
                            />

                            {error && <div className="form-error">{error}</div>}

                            <label className="remember-checkbox">
                                <input
                                    type="checkbox"
                                    className="checkbox-input"
                                    {...register('rememberMe')}
                                />
                                <span className="checkbox-custom"></span>
                                <span className="checkbox-label">
                                    Запомнить данные
                                </span>
                            </label>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="login-button"
                            >
                                {isLoading ? 'Вход...' : 'Войти'}
                            </button>

                            <div className="divider">
                                <span>или</span>
                            </div>

                            <div className="form-footer">
                                <span className="footer-text">
                                    Нет аккаунта?
                                </span>{' '}
                                <button
                                    type="button"
                                    onClick={() => setIsRegisterModalOpen(true)}
                                    className="footer-link"
                                >
                                    Создать
                                </button>
                            </div>
                        </form>

                        <div className="test-data">
                            <p className="test-data-text">
                                Тестовые данные для входа: логин:{' '}
                                <strong>emilys</strong>, пароль:{' '}
                                <strong>emilyspass</strong>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <RegisterModal
                isOpen={isRegisterModalOpen}
                onClose={handleOpenRegister}
            />
        </>
    );
};

export default LoginPage;
