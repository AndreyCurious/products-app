import {
    useController,
    type UseControllerProps,
    type FieldValues,
} from 'react-hook-form';
import ErrorMessage from '../../common/errorMessage/ErrorMessage';
import './LoginInput.css';
import { useState } from 'react';

interface LoginInputProps<T extends FieldValues> extends UseControllerProps<T> {
    placeholder?: string;
    label: string;
    type: 'text' | 'password';
}

const LoginInput = <T extends FieldValues>(props: LoginInputProps<T>) => {
    const [inputType, setInputType] = useState<'text' | 'password'>(props.type);
    const {
        field: { value, onChange, onBlur, ref },
        fieldState: { error },
    } = useController(props);

    const showClearButton =
        (value && value.length > 0) || props.name === 'password';

    const onClick = () => {
        if (props.name === 'password' && inputType === 'password') {
            setInputType('text');
        }

        if (props.name === 'password' && inputType === 'text') {
            setInputType('password');
        }

        if (props.name === 'username') {
            onChange({ target: { value: '' } });
        }
    };

    return (
        <div className="form-group">
            <label className="form-label" htmlFor={props.name}>
                {props.label}
            </label>

            <div className="input-login-container">
                <input
                    id={props.name}
                    ref={ref}
                    type={inputType}
                    className={`form-input ${error ? 'input-error' : ''}`}
                    placeholder={props.placeholder}
                    value={value || ''}
                    onChange={onChange}
                    onBlur={onBlur}
                />

                {showClearButton && (
                    <button
                        type="button"
                        onClick={onClick}
                        className={`btn-login-input btn-login-input-${props.type === 'password' ? 'password' : 'login'}`}
                        aria-label="Очистить поле"
                        tabIndex={-1}
                    />
                )}
            </div>

            {error && <ErrorMessage message={error.message || ''} />}
        </div>
    );
};

LoginInput.displayName = 'LoginInput';

export default LoginInput;
