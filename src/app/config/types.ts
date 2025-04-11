// Define symbols for dependency injection

// Common types
export const TYPES = {
  // Repositories
  IUserRepository: Symbol.for('IUserRepository'),
  IAuthRepository: Symbol.for('IAuthRepository'),
  IProductRepository: Symbol.for('IProductRepository'),
  
  // Services
  IUserService: Symbol.for('IUserService'),
  IAuthService: Symbol.for('IAuthService'),
  IProductService: Symbol.for('IProductService'),
  
  // Use Cases
  ILoginUseCase: Symbol.for('ILoginUseCase'),
  IRegisterUseCase: Symbol.for('IRegisterUseCase'),
  IGetUserProfileUseCase: Symbol.for('IGetUserProfileUseCase'),
  IUpdateUserProfileUseCase: Symbol.for('IUpdateUserProfileUseCase'),
  IGetProductsUseCase: Symbol.for('IGetProductsUseCase'),
  IGetProductDetailsUseCase: Symbol.for('IGetProductDetailsUseCase'),
  
  // Adapters
  IHttpClient: Symbol.for('IHttpClient'),
  IStorageAdapter: Symbol.for('IStorageAdapter'),
  IAnalyticsAdapter: Symbol.for('IAnalyticsAdapter'),
  
  // Infrastructure
  ILogger: Symbol.for('ILogger'),
}; 