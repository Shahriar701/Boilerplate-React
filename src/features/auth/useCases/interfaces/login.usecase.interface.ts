import { LoginCredentials, AuthResponse } from '../../repositories/interfaces/auth-repository.interface';

export interface ILoginUseCase {
    execute(credentials: LoginCredentials): Promise<AuthResponse>;
} 