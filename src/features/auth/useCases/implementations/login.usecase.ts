import { inject, injectable } from 'inversify';
import { TYPES } from '../../../../app/config/types';
import { IAuthService } from '../../services/interfaces/auth-service.interface';
import { LoginCredentials, AuthResponse } from '../../repositories/interfaces/auth-repository.interface';
import { ILoginUseCase } from '../interfaces/login.usecase.interface';

@injectable()
export class LoginUseCase implements ILoginUseCase {
  constructor(
    @inject(TYPES.IAuthService) private authService: IAuthService
  ) {}

  async execute(credentials: LoginCredentials): Promise<AuthResponse> {
    return this.authService.login(credentials);
  }
} 