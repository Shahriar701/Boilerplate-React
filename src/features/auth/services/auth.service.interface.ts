import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  UserDto
} from '../models/auth.dto';

export interface IAuthService {
  register(request: RegisterRequest): Promise<RegisterResponse | null>;
  login(request: LoginRequest): Promise<LoginResponse | null>;
  logout(): Promise<boolean>;
  getCurrentUser(): UserDto | null;
  isAuthenticated(): boolean;
} 