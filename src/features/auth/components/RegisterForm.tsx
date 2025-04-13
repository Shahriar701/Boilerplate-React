import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RegisterRequest } from '../models/auth.dto';

interface RegisterFormProps {
    onSubmit: (data: RegisterRequest) => Promise<void>;
    isLoading?: boolean;
    error?: string | null;
}

const RegisterForm: React.FC<RegisterFormProps> = ({
    onSubmit,
    isLoading = false,
    error = null
}) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

    const navigate = useNavigate();

    const validate = (): boolean => {
        const errors: Record<string, string> = {};

        if (!name) {
            errors.name = 'Name is required';
        }

        if (!email) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            errors.email = 'Email is invalid';
        }

        if (!password) {
            errors.password = 'Password is required';
        } else if (password.length < 6) {
            errors.password = 'Password must be at least 6 characters';
        }

        if (password !== confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        try {
            await onSubmit({ name, email, password });
        } catch (err) {
            console.error('Registration form submission error:', err);
        }
    };

    return (
        <div className="auth-form-container">
            <h2>Create an Account</h2>
            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={isLoading}
                        className={validationErrors.name ? 'input-error' : ''}
                    />
                    {validationErrors.name && (
                        <div className="error-text">{validationErrors.name}</div>
                    )}
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isLoading}
                        className={validationErrors.email ? 'input-error' : ''}
                    />
                    {validationErrors.email && (
                        <div className="error-text">{validationErrors.email}</div>
                    )}
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isLoading}
                        className={validationErrors.password ? 'input-error' : ''}
                    />
                    {validationErrors.password && (
                        <div className="error-text">{validationErrors.password}</div>
                    )}
                </div>

                <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        disabled={isLoading}
                        className={validationErrors.confirmPassword ? 'input-error' : ''}
                    />
                    {validationErrors.confirmPassword && (
                        <div className="error-text">{validationErrors.confirmPassword}</div>
                    )}
                </div>

                <div className="form-actions">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="btn-primary"
                    >
                        {isLoading ? 'Creating Account...' : 'Register'}
                    </button>
                </div>
            </form>

            <div className="auth-links">
                <p>
                    Already have an account?{' '}
                    <button
                        onClick={() => navigate('/login')}
                        className="link-button"
                        disabled={isLoading}
                    >
                        Login
                    </button>
                </p>
            </div>
        </div>
    );
};

export default RegisterForm; 