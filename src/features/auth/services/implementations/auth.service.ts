import { inject, injectable } from 'inversify';
import { TYPES } from '../../../../app/config/types';
import { IStorageAdapter } from '../../../../infrastructure/storage/storage.interface';
import { ILogger } from '../../../../infrastructure/logging/logger.interface';
import { IAuthRepository, LoginCredentials, RegisterCredentials, AuthResponse } from '../../repositories/interfaces/auth-repository.interface';
import { IAuthService } from '../interfaces/auth-service.interface';

@injectable()
export class AuthService implements IAuthService {
    private readonly AUTH_TOKEN_KEY = 'authToken';
    private readonly USER_KEY = 'user';

    constructor(
        @inject(TYPES.IAuthRepository) private authRepository: IAuthRepository,
        @inject(TYPES.IStorageAdapter) private storage: IStorageAdapter,
        @inject(TYPES.ILogger) private logger: ILogger
    ) { }

    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        try {
            const response = await this.authRepository.login(credentials);
            this.storage.set(this.AUTH_TOKEN_KEY, response.token);
            this.storage.set(this.USER_KEY, JSON.stringify(response.user));
            return response;
        } catch (error) {
            this.logger.error('Login failed:', error as Error);
            throw error;
        }
    }

    async register(credentials: RegisterCredentials): Promise<AuthResponse> {
        try {
            const response = await this.authRepository.register(credentials);
            this.storage.set(this.AUTH_TOKEN_KEY, response.token);
            this.storage.set(this.USER_KEY, JSON.stringify(response.user));
            return response;
        } catch (error) {
            this.logger.error('Registration failed:', error as Error);
            throw error;
        }
    }

    async logout(): Promise<void> {
        try {
            await this.authRepository.logout();
            this.storage.remove(this.AUTH_TOKEN_KEY);
            this.storage.remove(this.USER_KEY);
        } catch (error) {
            this.logger.error('Logout failed:', error as Error);
            throw error;
        }
    }

    isAuthenticated(): boolean {
        return !!this.getAuthToken();
    }

    getAuthToken(): string | null {
        return this.storage.get(this.AUTH_TOKEN_KEY);
    }
} 