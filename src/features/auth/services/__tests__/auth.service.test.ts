import { AuthService } from '../implementations/auth.service';
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

describe('AuthService', () => {
  let authService: AuthService;
  let mockAuthRepository: jest.Mocked<IAuthRepository>;
  let mockStorageService: jest.Mocked<IStorageService>;
  let mockLoggerService: jest.Mocked<ILoggerService>;

  const mockUser: UserDto = {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
    roles: ['user']
  };

  const mockToken = 'test-token';

  beforeEach(() => {
    mockAuthRepository = {
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn()
    };

    mockStorageService = {
      get: jest.fn(),
      set: jest.fn(),
      remove: jest.fn(),
      clear: jest.fn()
    };

    mockLoggerService = {
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn()
    };

    authService = new AuthService(
      mockAuthRepository,
      mockStorageService,
      mockLoggerService
    );
  });

  describe('login', () => {
    it('should call repository.login and store token on successful login', async () => {
      // Arrange
      const loginRequest: LoginRequest = {
        email: 'test@example.com',
        password: 'password123'
      };

      const mockResponse: LoginResponse = {
        user: mockUser,
        token: mockToken
      };

      mockAuthRepository.login.mockResolvedValueOnce(mockResponse);

      // Act
      const result = await authService.login(loginRequest);

      // Assert
      expect(mockAuthRepository.login).toHaveBeenCalledWith(loginRequest);
      expect(mockStorageService.set).toHaveBeenCalledWith('token', mockToken);
      expect(mockStorageService.set).toHaveBeenCalledWith('user', JSON.stringify(mockUser));
      expect(result).toEqual(mockResponse);
    });

    it('should return null and not store anything on failed login', async () => {
      // Arrange
      const loginRequest: LoginRequest = {
        email: 'test@example.com',
        password: 'wrong-password'
      };

      mockAuthRepository.login.mockResolvedValueOnce(null);

      // Act
      const result = await authService.login(loginRequest);

      // Assert
      expect(mockAuthRepository.login).toHaveBeenCalledWith(loginRequest);
      expect(mockStorageService.set).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });

  describe('register', () => {
    it('should call repository.register and store token on successful registration', async () => {
      // Arrange
      const registerRequest: RegisterRequest = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User'
      };

      const mockResponse: RegisterResponse = {
        user: mockUser,
        token: mockToken
      };

      mockAuthRepository.register.mockResolvedValueOnce(mockResponse);

      // Act
      const result = await authService.register(registerRequest);

      // Assert
      expect(mockAuthRepository.register).toHaveBeenCalledWith(registerRequest);
      expect(mockStorageService.set).toHaveBeenCalledWith('token', mockToken);
      expect(mockStorageService.set).toHaveBeenCalledWith('user', JSON.stringify(mockUser));
      expect(result).toEqual(mockResponse);
    });

    it('should return null and not store anything on failed registration', async () => {
      // Arrange
      const registerRequest: RegisterRequest = {
        email: 'existing@example.com',
        password: 'password123',
        name: 'Test User'
      };

      mockAuthRepository.register.mockResolvedValueOnce(null);

      // Act
      const result = await authService.register(registerRequest);

      // Assert
      expect(mockAuthRepository.register).toHaveBeenCalledWith(registerRequest);
      expect(mockStorageService.set).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });

  describe('logout', () => {
    it('should call repository.logout and clear storage on successful logout', async () => {
      // Arrange
      mockAuthRepository.logout.mockResolvedValueOnce(true);

      // Act
      const result = await authService.logout();

      // Assert
      expect(mockAuthRepository.logout).toHaveBeenCalled();
      expect(mockStorageService.remove).toHaveBeenCalledWith('token');
      expect(mockStorageService.remove).toHaveBeenCalledWith('user');
      expect(result).toBe(true);
    });

    it('should not clear storage if repository.logout fails', async () => {
      // Arrange
      mockAuthRepository.logout.mockResolvedValueOnce(false);

      // Act
      const result = await authService.logout();

      // Assert
      expect(mockAuthRepository.logout).toHaveBeenCalled();
      expect(mockStorageService.remove).not.toHaveBeenCalled();
      expect(result).toBe(false);
    });
  });

  describe('getCurrentUser', () => {
    it('should return user from storage if available', () => {
      // Arrange
      mockStorageService.get.mockReturnValueOnce(JSON.stringify(mockUser));

      // Act
      const result = authService.getCurrentUser();

      // Assert
      expect(mockStorageService.get).toHaveBeenCalledWith('user');
      expect(result).toEqual(mockUser);
    });

    it('should return null if no user in storage', () => {
      // Arrange
      mockStorageService.get.mockReturnValueOnce(null);

      // Act
      const result = authService.getCurrentUser();

      // Assert
      expect(mockStorageService.get).toHaveBeenCalledWith('user');
      expect(result).toBeNull();
    });
  });

  describe('isAuthenticated', () => {
    it('should return true if token exists in storage', () => {
      // Arrange
      mockStorageService.get.mockReturnValueOnce(mockToken);

      // Act
      const result = authService.isAuthenticated();

      // Assert
      expect(mockStorageService.get).toHaveBeenCalledWith('token');
      expect(result).toBe(true);
    });

    it('should return false if no token in storage', () => {
      // Arrange
      mockStorageService.get.mockReturnValueOnce(null);

      // Act
      const result = authService.isAuthenticated();

      // Assert
      expect(mockStorageService.get).toHaveBeenCalledWith('token');
      expect(result).toBe(false);
    });
  });
}); 