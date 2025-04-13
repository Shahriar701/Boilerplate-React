import { LoginRequest, LoginResponse } from '../models/auth.dto';

export interface ILoginUseCase {
    execute(request: LoginRequest): Promise<LoginResponse | null>;
} 