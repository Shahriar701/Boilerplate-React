import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { inject, injectable } from 'inversify';
import { useInjection } from 'inversify-react';
import { TYPES } from '../../../app/config/types';
import { ILoginUseCase } from '../useCases/login.usecase.interface';
import { LoginRequest } from '../models/auth.dto';
import LoginForm from '../components/LoginForm';

const LoginPage: React.FC = () => {
    const loginUseCase = useInjection<ILoginUseCase>(TYPES.LoginUseCase);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleLogin = async (data: LoginRequest): Promise<void> => {
        setIsLoading(true);
        setError(null);

        try {
            console.log('Attempting login with:', { email: data.email });
            const result = await loginUseCase.execute(data);
            console.log('Login result:', result);

            if (result) {
                console.log('Login successful, preparing to navigate');

                // Store a flag in sessionStorage to indicate fresh login
                sessionStorage.setItem('freshLogin', 'true');

                // Use a slightly longer delay to ensure state is fully updated
                setTimeout(() => {
                    // Force reload to ensure all components have the latest auth state
                    window.location.href = '/profile';
                }, 300);
            } else {
                setError('Login failed. Please check your credentials and try again.');
            }
        } catch (err) {
            console.error('Login error details:', err);

            if (err instanceof Error) {
                console.error('Error type: Error object', { message: err.message, stack: err.stack });
                setError(`Login error: ${err.message}`);
            } else if (typeof err === 'object' && err !== null) {
                console.error('Error type: Object', err);

                if ('message' in err) {
                    setError(`${(err as any).message}`);
                } else if ('response' in err && (err as any).response?.data) {
                    const responseData = (err as any).response.data;
                    console.error('API Response data:', responseData);

                    if (responseData.message) {
                        setError(responseData.message);
                    } else if (responseData.success === false) {
                        setError('Authentication failed. Please check your credentials.');
                    } else {
                        setError('Login failed. Please try again.');
                    }
                } else {
                    console.error('Error type: Unknown', { error: err });
                    setError('An unexpected error occurred. Please try again.');
                }
            } else {
                console.error('Error type: Unknown', { error: err });
                setError('An unexpected error occurred. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="page-container">
            <div className="auth-card">
                <LoginForm
                    onSubmit={handleLogin}
                    isLoading={isLoading}
                    error={error}
                />
            </div>
        </div>
    );
};

export default LoginPage; 