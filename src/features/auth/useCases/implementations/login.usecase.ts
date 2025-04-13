import { injectable, inject } from 'inversify';
import { TYPES } from '../../../../app/config/types';
import { ILoginUseCase } from '../login.usecase.interface';
import { IAuthService } from '../../services/auth.service.interface';
import { LoginRequest, LoginResponse } from '../../models/auth.dto';

@injectable()
export class LoginUseCase implements ILoginUseCase {
  constructor(
    @inject(TYPES.AuthService) private readonly authService: IAuthService
  ) {}

  async execute(request: LoginRequest): Promise<LoginResponse | null> {
    return this.authService.login(request);
  }
} 