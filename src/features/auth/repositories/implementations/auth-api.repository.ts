import { injectable, inject } from 'inversify';
import { TYPES } from '../../../../app/config/types';
import { IAuthRepository } from '../auth.repository.interface';
import { IHttpClient } from '../../../../adapters/api/http-client.interface';
import { ILoggerService } from '../../../../infrastructure/logging/logger.interface';
import {
    LoginRequest,
    LoginResponse,
    RegisterRequest,
    RegisterResponse,
    AuthResponseDTO
} from '../../models/auth.dto';

@injectable()
export class AuthApiRepository implements IAuthRepository {
    constructor(
        @inject(TYPES.HttpClient) private readonly httpClient: IHttpClient,
        @inject(TYPES.LoggerService) private readonly logger: ILoggerService
    ) { }

    async login(request: LoginRequest): Promise<LoginResponse | null> {
        try {
            this.logger.info('Attempting login', { email: request.email });

            // Using the standard login endpoint
            const response = await this.httpClient.post<AuthResponseDTO>('auth/login', request);

            // Transform backend response to our frontend DTO
            const loginResponse: LoginResponse = {
                user: {
                    id: response.user.id,
                    email: response.user.email,
                    name: response.user.name,
                    roles: response.user.roles || []
                },
                token: response.token
            };

            this.logger.info('User logged in successfully');
            return loginResponse;
        } catch (error: any) {
            this.logger.error('Login failed:', error);

            // Handle structured API error response with success:false pattern
            if (error.response?.data) {
                const errorData = error.response.data;
                this.logger.error('Login API error response:', errorData);

                // Check if response follows the success:false format
                if (errorData.success === false && errorData.message) {
                    throw new Error(errorData.message);
                } else if (errorData.message) {
                    throw new Error(errorData.message);
                } else {
                    throw new Error('Login failed: Invalid credentials');
                }
            }

            // For network or other errors
            throw error;
        }
    }

    async register(request: RegisterRequest): Promise<RegisterResponse | null> {
        try {
            this.logger.info('Attempting registration', { email: request.email });
            const response = await this.httpClient.post<AuthResponseDTO>('auth/register', request);

            // Transform backend response to our frontend DTO
            const registerResponse: RegisterResponse = {
                user: {
                    id: response.user.id,
                    email: response.user.email,
                    name: response.user.name,
                    roles: response.user.roles || []
                },
                token: response.token
            };

            this.logger.info('User registered successfully');
            return registerResponse;
        } catch (error: any) {
            this.logger.error('Registration failed:', error);

            // Handle structured API error response with success:false pattern
            if (error.response?.data) {
                const errorData = error.response.data;
                this.logger.error('Registration API error response:', errorData);

                // Check if response follows the success:false format
                if (errorData.success === false && errorData.message) {
                    throw new Error(errorData.message);
                } else if (errorData.message) {
                    throw new Error(errorData.message);
                } else {
                    throw new Error('Registration failed');
                }
            }

            // For network or other errors
            throw error;
        }
    }

    async logout(): Promise<boolean> {
        try {
            // Since the backend doesn't have a logout endpoint, we'll just return true
            // The actual logout functionality will be handled by the AuthService
            // by clearing the token from storage
            this.logger.info('User logged out successfully');
            return true;
        } catch (error) {
            this.logger.error('Failed to logout:', error);
            return false;
        }
    }
} 