import { inject, injectable } from 'inversify';
import { TYPES } from '../../../../app/config/types';
import { IAuthService } from '../../services/interfaces/auth-service.interface';
import { RegisterCredentials, AuthResponse } from '../../repositories/interfaces/auth-repository.interface';
import { IRegisterUseCase } from '../interfaces/register.usecase.interface';

@injectable()
export class RegisterUseCase implements IRegisterUseCase {
    constructor(
        @inject(TYPES.IAuthService) private authService: IAuthService
    ) { }

    async execute(credentials: RegisterCredentials): Promise<AuthResponse> {
        return this.authService.register(credentials);
    }
} 