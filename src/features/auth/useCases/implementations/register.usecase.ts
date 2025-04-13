import { injectable, inject } from 'inversify';
import { TYPES } from '../../../../app/config/types';
import { IRegisterUseCase } from '../register.usecase.interface';
import { IAuthService } from '../../services/auth.service.interface';
import { RegisterRequest, RegisterResponse } from '../../models/auth.dto';

@injectable()
export class RegisterUseCase implements IRegisterUseCase {
    constructor(
        @inject(TYPES.AuthService)
        private readonly authService: IAuthService
    ) { }

    async execute(request: RegisterRequest): Promise<RegisterResponse | null> {
        return this.authService.register(request);
    }
} 