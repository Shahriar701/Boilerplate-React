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

  // Models Feature
  ModelRepository: Symbol.for('ModelRepository'),
  ModelService: Symbol.for('ModelService'),
  GetModelsUseCase: Symbol.for('GetModelsUseCase'),
  GetModelByIdUseCase: Symbol.for('GetModelByIdUseCase'),
  TestModelUseCase: Symbol.for('TestModelUseCase'),
  GetModelTestHistoryUseCase: Symbol.for('GetModelTestHistoryUseCase'),
  GetModelStatusUseCase: Symbol.for('GetModelStatusUseCase'),
  StartModelUseCase: Symbol.for('StartModelUseCase'),
  StopModelUseCase: Symbol.for('StopModelUseCase'),

  // Repositories - for backward compatibility
  IUserRepository: Symbol.for('IUserRepository'),
  IAuthRepository: Symbol.for('IAuthRepository'),
  IModelRepository: Symbol.for('IModelRepository'),

  // Services - for backward compatibility
  IModelService: Symbol.for('IModelService'),

  // Adapters
  IAnalyticsAdapter: Symbol.for('IAnalyticsAdapter'),
}; 