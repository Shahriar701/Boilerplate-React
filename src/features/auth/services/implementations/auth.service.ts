import { injectable, inject } from 'inversify';
import { TYPES } from '../../../../app/config/types';
import { IAuthService } from '../auth.service.interface';
import { IAuthRepository } from '../../repositories/auth.repository.interface';
import { IStorageService } from '../../../../adapters/storage/storage.interface';
import { ILoggerService } from '../../../../infrastructure/logging/logger.interface';
import { 
  LoginRequest, 
  LoginResponse, 
  RegisterRequest, 
  RegisterResponse,
  UserDto 
} from '../../models/auth.dto';

@injectable()
export class AuthService implements IAuthService {
  constructor(
    @inject(TYPES.AuthRepository) private readonly authRepository: IAuthRepository,
    @inject(TYPES.StorageService) private readonly storage: IStorageService,
    @inject(TYPES.LoggerService) private readonly logger: ILoggerService
  ) {}

  async login(request: LoginRequest): Promise<LoginResponse | null> {
    try {
      const response = await this.authRepository.login(request);
      
      if (response) {
        this.storage.set('token', response.token);
        this.storage.set('user', JSON.stringify(response.user));
        this.logger.info('User logged in successfully');
      }
      
      return response;
    } catch (error) {
      this.logger.error('Error during login', error);
      return null;
    }
  }

  async register(request: RegisterRequest): Promise<RegisterResponse | null> {
    try {
      const response = await this.authRepository.register(request);
      
      if (response) {
        this.storage.set('token', response.token);
        this.storage.set('user', JSON.stringify(response.user));
        this.logger.info('User registered successfully');
      }
      
      return response;
    } catch (error) {
      this.logger.error('Error during registration', error);
      return null;
    }
  }

  async logout(): Promise<boolean> {
    try {
      const success = await this.authRepository.logout();
      
      if (success) {
        this.storage.remove('token');
        this.storage.remove('user');
        this.logger.info('User logged out successfully');
      }
      
      return success;
    } catch (error) {
      this.logger.error('Error during logout', error);
      return false;
    }
  }

  getCurrentUser(): UserDto | null {
    try {
      const userJson = this.storage.get('user');
      if (!userJson) return null;
      
      return JSON.parse(userJson) as UserDto;
    } catch (error) {
      this.logger.error('Error getting current user', error);
      return null;
    }
  }

  isAuthenticated(): boolean {
    try {
      return !!this.storage.get('token');
    } catch (error) {
      this.logger.error('Error checking authentication status', error);
      return false;
    }
  }
} 