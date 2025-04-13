import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInjection } from 'inversify-react';
import { TYPES } from '../../../app/config/types';
import { IRegisterUseCase } from '../useCases/register.usecase.interface';
import { RegisterRequest } from '../models/auth.dto';
import RegisterForm from '../components/RegisterForm';

const RegisterPage: React.FC = () => {
    const registerUseCase = useInjection<IRegisterUseCase>(TYPES.RegisterUseCase);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleRegister = async (data: RegisterRequest): Promise<void> => {
        setIsLoading(true);
        setError(null);

        try {
            console.log('Attempting registration with:', { email: data.email, name: data.name });
            const result = await registerUseCase.execute(data);
            console.log('Registration result:', result);

            if (result) {
                console.log('Registration successful, preparing to navigate');

                // Store a flag in sessionStorage to indicate fresh registration
                sessionStorage.setItem('freshLogin', 'true');

                // Use a slightly longer delay to ensure state is fully updated
                setTimeout(() => {
                    // Force reload to ensure all components have the latest auth state
                    window.location.href = '/profile';
                }, 300);
            } else {
                setError('Registration failed. Please try again.');
            }
        } catch (err) {
            console.error('Registration error details:', err);

            // Enhanced error debugging
            if (err instanceof Error) {
                console.error('Error type: Error object', { message: err.message, stack: err.stack });
                setError(`Registration error: ${err.message}`);
            } else if (typeof err === 'object' && err !== null) {
                console.error('Error type: Object', err);

                if ('message' in err) {
                    setError(`${(err as any).message}`);
                } else if ('response' in err && (err as any).response?.data) {
                    // Handle axios error format
                    const responseData = (err as any).response.data;
                    console.error('API Response data:', responseData);

                    if (responseData.message) {
                        setError(responseData.message);
                    } else if (responseData.success === false) {
                        setError('Registration failed. Please try again.');
                    } else {
                        setError('Registration failed. Please try again.');
                    }
                } else {
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
                <RegisterForm
                    onSubmit={handleRegister}
                    isLoading={isLoading}
                    error={error}
                />
            </div>
        </div>
    );
};

export default RegisterPage; 