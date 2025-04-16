import { injectable, inject } from 'inversify';
import { TYPES } from '../../../../app/config/types';
import { IRegisterUseCase } from '../interfaces/register.usecase.interface';
import { IAuthService } from '../../services/auth.service.interface';
import { RegisterRequest } from '../../models/auth.dto';
import { AuthResponse } from '../../repositories/interfaces/auth-repository.interface';

@injectable()
export class RegisterUseCase implements IRegisterUseCase {
    constructor(
        @inject(TYPES.AuthService)
        private readonly authService: IAuthService
    ) { }

    async execute(request: RegisterRequest): Promise<AuthResponse> {
        const response = await this.authService.register(request);
        if (!response) {
            throw new Error('Registration failed');
        }
        return {
            token: response.token,
            user: {
                id: response.user.id,
                name: response.user.name,
                email: response.user.email
            }
        };
    }
} 