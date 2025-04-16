import { injectable, inject } from 'inversify';
import { TYPES } from '../../../../app/config/types';
import { ILoginUseCase } from '../interfaces/login.usecase.interface';
import { IAuthService } from '../../services/auth.service.interface';
import { LoginRequest } from '../../models/auth.dto';
import { AuthResponse } from '../../repositories/interfaces/auth-repository.interface';

@injectable()
export class LoginUseCase implements ILoginUseCase {
  constructor(
    @inject(TYPES.AuthService) private readonly authService: IAuthService
  ) {}

  async execute(request: LoginRequest): Promise<AuthResponse> {
    const response = await this.authService.login(request);
    if (!response) {
      throw new Error('Authentication failed');
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