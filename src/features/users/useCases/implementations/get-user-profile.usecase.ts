import { injectable, inject, LazyServiceIdentifier } from 'inversify';
import { TYPES } from '../../../../app/config/types';
import { User } from '../../../../domain/entities/user.entity';
import { IUserService } from '../../services/interfaces/user-service.interface';
import { GetUserProfileParams, IGetUserProfileUseCase } from '../interfaces/get-user-profile.usecase.interface';
import { ILogger } from '../../../../infrastructure/logging/logger.interface';

@injectable()
export class GetUserProfileUseCase implements IGetUserProfileUseCase {
  constructor(
    @inject(new LazyServiceIdentifier(() => TYPES.UserService)) private userService: IUserService,
    @inject(new LazyServiceIdentifier(() => TYPES.LoggerService)) private logger: ILogger
  ) {}

  async execute(params: GetUserProfileParams): Promise<User> {
    this.logger.info('Fetching user profile', { userId: params.userId });
    
    try {
      const user = await this.userService.getUserById(params.userId);
      
      this.logger.debug('User profile fetched successfully', { userId: params.userId });
      
      return user;
    } catch (error) {
      this.logger.error(`Failed to fetch user profile for ID: ${params.userId}`, error as Error);
      throw error;
    }
  }
} 