import { AuthResponse, LoginCredentials, RegisterCredentials } from '../../repositories/interfaces/auth-repository.interface';

export interface IAuthService {
    login(credentials: LoginCredentials): Promise<AuthResponse>;
    register(credentials: RegisterCredentials): Promise<AuthResponse>;
    logout(): Promise<void>;
    isAuthenticated(): boolean;
    getAuthToken(): string | null;
} 