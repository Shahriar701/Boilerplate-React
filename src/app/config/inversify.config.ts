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
import { AuthMockRepository } from '../../features/auth/repositories/implementations/auth-mock.repository';

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

// Imports for Product Feature
import { IProductRepository } from '../../features/products/repositories/product.repository.interface';
import { ProductApiRepository } from '../../features/products/repositories/implementations/product-api.repository';
import { ProductMockRepository } from '../../features/products/repositories/implementations/product-mock.repository';
import { IProductService } from '../../features/products/services/product.service.interface';
import { ProductService } from '../../features/products/services/implementations/product.service';

// Product use cases
import {
    GetProductsUseCase,
    GetProductByIdUseCase,
    GetSelectedProductsUseCase,
    CreateProductUseCase,
    UpdateProductUseCase,
    DeleteProductUseCase,
    SelectProductUseCase,
    UnselectProductUseCase,
    GetSelectedProductIdsUseCase,
    ClearSelectedProductsUseCase
} from '../../features/products/useCases';

// Create a container instance once
const container = new Container();

// Configure the container
function configureContainer() {
    // Infrastructure
    container.bind<IHttpClient>(TYPES.HttpClient).to(AxiosHttpClientAdapter).inSingletonScope();
    container.bind<IStorageService>(TYPES.StorageService).to(LocalStorageAdapter).inSingletonScope();
    container.bind<ILoggerService>(TYPES.LoggerService).to(ConsoleLoggerService).inSingletonScope();

    // Auth Feature
    // Using the real API repository for authentication
    container.bind<IAuthRepository>(TYPES.AuthRepository).to(AuthApiRepository).inSingletonScope();
    // container.bind<IAuthRepository>(TYPES.AuthRepository).to(AuthMockRepository).inSingletonScope();

    // Repositories
    container.bind<IUserRepository>(TYPES.UserRepository).to(UserApiRepository).inSingletonScope();
    // Using the real API repository for products
    container.bind<IProductRepository>(TYPES.ProductRepository).to(ProductApiRepository).inSingletonScope();
    // Comment out the mock repository
    // container.bind<IProductRepository>(TYPES.ProductRepository).to(ProductMockRepository).inSingletonScope();

    // Services
    container.bind<IUserService>(TYPES.UserService).to(UserService).inSingletonScope();
    container.bind<IAuthService>(TYPES.AuthService).to(AuthService).inSingletonScope();
    container.bind<IProductService>(TYPES.ProductService).to(ProductService).inSingletonScope();

    // User and Auth Use Cases
    container.bind<IGetUserProfileUseCase>(TYPES.GetUserProfileUseCase).to(GetUserProfileUseCase).inRequestScope();
    container.bind<ILoginUseCase>(TYPES.LoginUseCase).to(LoginUseCase).inRequestScope();
    container.bind<IRegisterUseCase>(TYPES.RegisterUseCase).to(RegisterUseCase).inRequestScope();

    // Product Use Cases
    container.bind<GetProductsUseCase>(TYPES.GetProductsUseCase).to(GetProductsUseCase).inRequestScope();
    container.bind<GetProductByIdUseCase>(TYPES.GetProductByIdUseCase).to(GetProductByIdUseCase).inRequestScope();
    container.bind<GetSelectedProductsUseCase>(TYPES.GetSelectedProductsUseCase).to(GetSelectedProductsUseCase).inRequestScope();
    container.bind<CreateProductUseCase>(TYPES.CreateProductUseCase).to(CreateProductUseCase).inRequestScope();
    container.bind<UpdateProductUseCase>(TYPES.UpdateProductUseCase).to(UpdateProductUseCase).inRequestScope();
    container.bind<DeleteProductUseCase>(TYPES.DeleteProductUseCase).to(DeleteProductUseCase).inRequestScope();
    container.bind<SelectProductUseCase>(TYPES.SelectProductUseCase).to(SelectProductUseCase).inRequestScope();
    container.bind<UnselectProductUseCase>(TYPES.UnselectProductUseCase).to(UnselectProductUseCase).inRequestScope();
    container.bind<GetSelectedProductIdsUseCase>(TYPES.GetSelectedProductIdsUseCase).to(GetSelectedProductIdsUseCase).inRequestScope();
    container.bind<ClearSelectedProductsUseCase>(TYPES.ClearSelectedProductsUseCase).to(ClearSelectedProductsUseCase).inRequestScope();

    return container;
}

// Configure the container immediately
configureContainer();

// Export the already configured container
export { container }; 