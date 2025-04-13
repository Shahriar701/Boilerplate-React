import { RegisterCredentials, AuthResponse } from '../../repositories/interfaces/auth-repository.interface';

export interface IRegisterUseCase {
  execute(credentials: RegisterCredentials): Promise<AuthResponse>;
} 