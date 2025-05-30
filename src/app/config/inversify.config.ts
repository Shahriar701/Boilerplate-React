import 'reflect-metadata';
import { Container } from 'inversify';
import { TYPES } from './types';

// Infrastructure
import { IHttpClient } from '../../adapters/api/http-client.interface';
import { AxiosHttpClientAdapter } from '../../adapters/api/axios-http-client.adapter';
import { IStorageService } from '../../adapters/storage/storage.interface';
import { LocalStorageAdapter } from '../../adapters/storage/local-storage.adapter';
import { ILoggerService } from '../../infrastructure/logging/logger.interface';
import { ConsoleLoggerService } from '../../infrastructure/logging/console-logger.service';

// Auth Feature
import { IAuthRepository } from '../../features/auth/repositories/auth.repository.interface';
import { AuthApiRepository } from '../../features/auth/repositories/implementations/auth-api.repository';

// User repositories
import { IUserRepository } from '../../features/users/repositories/interfaces/user-repository.interface';
import { UserApiRepository } from '../../features/users/repositories/implementations/user-api.repository';

// User services
import { IUserService } from '../../features/users/services/interfaces/user-service.interface';
import { UserService } from '../../features/users/services/implementations/user.service';

// User use cases
import { IGetUserProfileUseCase } from '../../features/users/useCases/interfaces/get-user-profile.usecase.interface';
import { GetUserProfileUseCase } from '../../features/users/useCases/implementations/get-user-profile.usecase';

// Auth services
import { IAuthService } from '../../features/auth/services/auth.service.interface';
import { AuthService } from '../../features/auth/services/implementations/auth.service';

// Auth use cases
import { ILoginUseCase } from '../../features/auth/useCases/interfaces/login.usecase.interface';
import { LoginUseCase } from '../../features/auth/useCases/implementations/login.usecase';
import { IRegisterUseCase } from '../../features/auth/useCases/interfaces/register.usecase.interface';
import { RegisterUseCase } from '../../features/auth/useCases/implementations/register.usecase';

// Imports for Model Feature
import { IModelRepository } from '../../features/models/repositories/model.repository.interface';
import { ModelHybridRepository } from '../../features/models/repositories/implementations/model-hybrid.repository';
import { IModelService } from '../../features/models/services/model.service.interface';
import { ModelService } from '../../features/models/services/implementations/model.service';

// Model use cases
import {
    IGetModelsUseCase,
    IGetModelByIdUseCase,
    ITestModelUseCase,
    IGetModelTestHistoryUseCase,
    IGetModelStatusUseCase,
    IStartModelUseCase,
    IStopModelUseCase,
    GetModelsUseCase,
    GetModelByIdUseCase,
    TestModelUseCase,
    GetModelTestHistoryUseCase,
    GetModelStatusUseCase,
    StartModelUseCase,
    StopModelUseCase
} from '../../features/models/useCases';

// Model types

const container = new Container();

// Infrastructure
container.bind<IHttpClient>(TYPES.HttpClient).to(AxiosHttpClientAdapter).inSingletonScope();
container.bind<IStorageService>(TYPES.StorageService).to(LocalStorageAdapter).inSingletonScope();
container.bind<ILoggerService>(TYPES.LoggerService).to(ConsoleLoggerService).inSingletonScope();

// Auth Feature
container.bind<IAuthRepository>(TYPES.AuthRepository).to(AuthApiRepository).inSingletonScope();

// Repositories
container.bind<IUserRepository>(TYPES.UserRepository).to(UserApiRepository).inSingletonScope();

// Models Repository
container.bind<IModelRepository>(TYPES.ModelRepository).to(ModelHybridRepository).inSingletonScope();

// Services
container.bind<IUserService>(TYPES.UserService).to(UserService).inSingletonScope();
container.bind<IAuthService>(TYPES.AuthService).to(AuthService).inSingletonScope();
container.bind<IModelService>(TYPES.ModelService).to(ModelService).inSingletonScope();

// User and Auth Use Cases
container.bind<IGetUserProfileUseCase>(TYPES.GetUserProfileUseCase).to(GetUserProfileUseCase).inRequestScope();
container.bind<ILoginUseCase>(TYPES.LoginUseCase).to(LoginUseCase).inRequestScope();
container.bind<IRegisterUseCase>(TYPES.RegisterUseCase).to(RegisterUseCase).inRequestScope();

// Model Use Cases
container.bind<IGetModelsUseCase>(TYPES.GetModelsUseCase).to(GetModelsUseCase).inRequestScope();
container.bind<IGetModelByIdUseCase>(TYPES.GetModelByIdUseCase).to(GetModelByIdUseCase).inRequestScope();
container.bind<ITestModelUseCase>(TYPES.TestModelUseCase).to(TestModelUseCase).inRequestScope();
container.bind<IGetModelTestHistoryUseCase>(TYPES.GetModelTestHistoryUseCase).to(GetModelTestHistoryUseCase).inRequestScope();
container.bind<IGetModelStatusUseCase>(TYPES.GetModelStatusUseCase).to(GetModelStatusUseCase).inRequestScope();
container.bind<IStartModelUseCase>(TYPES.StartModelUseCase).to(StartModelUseCase).inRequestScope();
container.bind<IStopModelUseCase>(TYPES.StopModelUseCase).to(StopModelUseCase).inRequestScope();

export { container }; 