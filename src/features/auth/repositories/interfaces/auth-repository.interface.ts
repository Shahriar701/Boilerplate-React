import { AuthResponseDTO, LoginDTO, RegisterDTO } from '../../models/auth.dto';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface IAuthRepository {
  login(credentials: LoginCredentials): Promise<AuthResponse>;
  register(credentials: RegisterCredentials): Promise<AuthResponse>;
  logout(): Promise<void>;
} 