import {
    LoginRequest,
    LoginResponse,
    RegisterRequest,
    RegisterResponse
} from '../models/auth.dto';

export interface IAuthRepository {
    login(request: LoginRequest): Promise<LoginResponse | null>;
    register(request: RegisterRequest): Promise<RegisterResponse | null>;
    logout(): Promise<boolean>;
} 