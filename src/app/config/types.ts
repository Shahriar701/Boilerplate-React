// Define symbols for dependency injection

// Common types
export const TYPES = {
  // Infrastructure
  HttpClient: Symbol.for('HttpClient'),
  StorageService: Symbol.for('StorageService'),
  LoggerService: Symbol.for('LoggerService'),

  // Auth Feature
  AuthRepository: Symbol.for('AuthRepository'),
  AuthService: Symbol.for('AuthService'),
  LoginUseCase: Symbol.for('LoginUseCase'),
  RegisterUseCase: Symbol.for('RegisterUseCase'),
  LogoutUseCase: Symbol.for('LogoutUseCase'),

  // User Feature
  UserRepository: Symbol.for('UserRepository'),
  UserService: Symbol.for('UserService'),
  GetUserProfileUseCase: Symbol.for('GetUserProfileUseCase'),
  UpdateUserProfileUseCase: Symbol.for('UpdateUserProfileUseCase'),

  // Product Feature
  ProductRepository: Symbol.for('ProductRepository'),
  ProductService: Symbol.for('ProductService'),

  // Models Feature
  ModelRepository: Symbol.for('ModelRepository'),
  ModelService: Symbol.for('ModelService'),
  GetModelsUseCase: Symbol.for('GetModelsUseCase'),
  GetModelByIdUseCase: Symbol.for('GetModelByIdUseCase'),
  TestModelUseCase: Symbol.for('TestModelUseCase'),
  GetModelTestHistoryUseCase: Symbol.for('GetModelTestHistoryUseCase'),

  // Product Use Cases
  GetProductsUseCase: Symbol.for('GetProductsUseCase'),
  GetProductByIdUseCase: Symbol.for('GetProductByIdUseCase'),
  GetSelectedProductsUseCase: Symbol.for('GetSelectedProductsUseCase'),
  CreateProductUseCase: Symbol.for('CreateProductUseCase'),
  UpdateProductUseCase: Symbol.for('UpdateProductUseCase'),
  DeleteProductUseCase: Symbol.for('DeleteProductUseCase'),
  SelectProductUseCase: Symbol.for('SelectProductUseCase'),
  UnselectProductUseCase: Symbol.for('UnselectProductUseCase'),
  GetSelectedProductIdsUseCase: Symbol.for('GetSelectedProductIdsUseCase'),
  ClearSelectedProductsUseCase: Symbol.for('ClearSelectedProductsUseCase'),

  // Repositories - for backward compatibility
  IUserRepository: Symbol.for('IUserRepository'),
  IAuthRepository: Symbol.for('IAuthRepository'),
  IProductRepository: Symbol.for('IProductRepository'),
  IModelRepository: Symbol.for('IModelRepository'),

  // Services - for backward compatibility
  IProductService: Symbol.for('IProductService'),
  IModelService: Symbol.for('IModelService'),

  // Use Cases - for backward compatibility
  IGetProductsUseCase: Symbol.for('IGetProductsUseCase'),
  IGetProductDetailsUseCase: Symbol.for('IGetProductDetailsUseCase'),

  // Adapters
  IAnalyticsAdapter: Symbol.for('IAnalyticsAdapter'),
}; 