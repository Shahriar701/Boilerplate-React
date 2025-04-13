import { AuthApiRepository } from '../auth-api.repository';
import { IHttpClient } from '../../../../../adapters/api/http-client.interface';
import { LoginRequest, LoginResponse } from '../../../models/auth.dto';
import { ILoggerService } from '../../../../../infrastructure/logging/logger.interface';

describe('AuthApiRepository', () => {
    let authRepository: AuthApiRepository;
    let mockHttpClient: jest.Mocked<IHttpClient>;
    let mockLogger: jest.Mocked<ILoggerService>;

    beforeEach(() => {
        mockHttpClient = {
            get: jest.fn(),
            post: jest.fn(),
            put: jest.fn(),
            delete: jest.fn(),
        };

        mockLogger = {
            info: jest.fn(),
            error: jest.fn(),
            debug: jest.fn(),
            warn: jest.fn(),
        };

        authRepository = new AuthApiRepository(mockHttpClient, mockLogger);
    });

    describe('login', () => {
        it('should call httpClient.post with correct parameters and return data on success', async () => {
            // Arrange
            const loginRequest: LoginRequest = {
                email: 'test@example.com',
                password: 'password123'
            };

            const mockResponse: LoginResponse = {
                user: {
                    id: '1',
                    email: 'test@example.com',
                    name: 'Test User',
                    roles: ['user']
                },
                token: 'test-token'
            };

            mockHttpClient.post.mockResolvedValueOnce(mockResponse);

            // Act
            const result = await authRepository.login(loginRequest);

            // Assert
            expect(mockHttpClient.post).toHaveBeenCalledWith('/auth/login', loginRequest);
            expect(result).toEqual(mockResponse);
            expect(mockLogger.info).toHaveBeenCalledWith('User logged in successfully');
        });

        it('should handle errors and return null', async () => {
            // Arrange
            const loginRequest: LoginRequest = {
                email: 'test@example.com',
                password: 'invalid-password'
            };

            mockHttpClient.post.mockRejectedValueOnce(new Error('Invalid credentials'));

            // Act
            const result = await authRepository.login(loginRequest);

            // Assert
            expect(mockHttpClient.post).toHaveBeenCalledWith('/auth/login', loginRequest);
            expect(result).toBeNull();
            expect(mockLogger.error).toHaveBeenCalledWith('Failed to login:', expect.any(Error));
        });
    });
}); 