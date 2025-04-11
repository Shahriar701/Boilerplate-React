import { User } from '../../../../domain/entities/user.entity';

export interface GetUserProfileParams {
  userId: string;
}

export interface IGetUserProfileUseCase {
  execute(params: GetUserProfileParams): Promise<User>;
} 