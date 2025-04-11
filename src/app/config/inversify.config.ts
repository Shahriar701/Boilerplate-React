import 'reflect-metadata';
import { Container } from 'inversify';
import { TYPES } from './types';

// HTTP client adapter
import { IHttpClient } from '../../infrastructure/http/interfaces/http-client.interface';
import { AxiosHttpClient } from '../../adapters/api/axios-http-client.adapter';

// Storage adapter
import { IStorageAdapter } from '../../infrastructure/storage/storage.interface';
import { LocalStorageAdapter } from '../../adapters/storage/local-storage.adapter';

// Logger
import { ILogger } from '../../infrastructure/logging/logger.interface';
import { ConsoleLogger } from '../../infrastructure/logging/console-logger';

// User repositories
import { IUserRepository } from '../../features/users/repositories/interfaces/user-repository.interface';
import { UserApiRepository } from '../../features/users/repositories/implementations/user-api.repository';

// User services
import { IUserService } from '../../features/users/services/interfaces/user-service.interface';
import { UserService } from '../../features/users/services/implementations/user.service';

// User use cases
import { IGetUserProfileUseCase } from '../../features/users/useCases/interfaces/get-user-profile.usecase.interface';
import { GetUserProfileUseCase } from '../../features/users/useCases/implementations/get-user-profile.usecase';

// Auth repositories
import { IAuthRepository } from '../../features/auth/repositories/interfaces/auth-repository.interface';
import { AuthApiRepository } from '../../features/auth/repositories/implementations/auth-api.repository';

// Auth services
import { IAuthService } from '../../features/auth/services/interfaces/auth-service.interface';
import { AuthService } from '../../features/auth/services/implementations/auth.service';

// Auth use cases
import { ILoginUseCase } from '../../features/auth/useCases/interfaces/login.usecase.interface';
import { LoginUseCase } from '../../features/auth/useCases/implementations/login.usecase';
import { IRegisterUseCase } from '../../features/auth/useCases/interfaces/register.usecase.interface';
import { RegisterUseCase } from '../../features/auth/useCases/implementations/register.usecase';

const container = new Container();

// Infrastructure and adapters
container.bind<IHttpClient>(TYPES.IHttpClient).to(AxiosHttpClient).inSingletonScope();
container.bind<IStorageAdapter>(TYPES.IStorageAdapter).to(LocalStorageAdapter).inSingletonScope();
container.bind<ILogger>(TYPES.ILogger).to(ConsoleLogger).inSingletonScope();

// Repositories
container.bind<IUserRepository>(TYPES.IUserRepository).to(UserApiRepository).inSingletonScope();
container.bind<IAuthRepository>(TYPES.IAuthRepository).to(AuthApiRepository).inSingletonScope();

// Services
container.bind<IUserService>(TYPES.IUserService).to(UserService).inSingletonScope();
container.bind<IAuthService>(TYPES.IAuthService).to(AuthService).inSingletonScope();

// Use Cases
container.bind<IGetUserProfileUseCase>(TYPES.IGetUserProfileUseCase).to(GetUserProfileUseCase).inRequestScope();
container.bind<ILoginUseCase>(TYPES.ILoginUseCase).to(LoginUseCase).inRequestScope();
container.bind<IRegisterUseCase>(TYPES.IRegisterUseCase).to(RegisterUseCase).inRequestScope();

export { container }; 