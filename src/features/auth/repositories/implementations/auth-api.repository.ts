import { inject, injectable } from 'inversify';
import { TYPES } from '../../../../app/config/types';
import { IHttpClient } from '../../../../infrastructure/http/interfaces/http-client.interface';
import { ILogger } from '../../../../infrastructure/logging/logger.interface';
import { IAuthRepository, LoginCredentials, RegisterCredentials, AuthResponse } from '../interfaces/auth-repository.interface';

@injectable()
export class AuthApiRepository implements IAuthRepository {
    constructor(
        @inject(TYPES.IHttpClient) private httpClient: IHttpClient,
        @inject(TYPES.ILogger) private logger: ILogger
    ) { }

    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        try {
            const response = await this.httpClient.post<AuthResponse>('/auth/login', credentials);
            return response.data;
        } catch (error) {
            this.logger.error('Failed to login:', error);
            throw error;
        }
    }

    async register(credentials: RegisterCredentials): Promise<AuthResponse> {
        try {
            const response = await this.httpClient.post<AuthResponse>('/auth/register', credentials);
            return response.data;
        } catch (error) {
            this.logger.error('Failed to register:', error);
            throw error;
        }
    }

    async logout(): Promise<void> {
        try {
            await this.httpClient.post('/auth/logout', {});
        } catch (error) {
            this.logger.error('Failed to logout:', error);
            throw error;
        }
    }
} 