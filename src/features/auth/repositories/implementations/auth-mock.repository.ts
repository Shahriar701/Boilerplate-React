import { injectable, inject } from 'inversify';
import { TYPES } from '../../../../app/config/types';
import { IAuthRepository } from '../auth.repository.interface';
import { ILoggerService } from '../../../../infrastructure/logging/logger.interface';
import {
    LoginRequest,
    LoginResponse,
    RegisterRequest,
    RegisterResponse,
} from '../../models/auth.dto';

/**
 * A mock repository that simulates authentication with the backend
 * This provides data for development and testing without requiring a backend
 */
@injectable()
export class AuthMockRepository implements IAuthRepository {
    private users: Record<string, { password: string, userData: any }> = {};

    constructor(
        @inject(TYPES.LoggerService) private readonly logger: ILoggerService
    ) {
        // Pre-populate with test users
        this.users['demo@example.com'] = {
            password: 'password123',
            userData: {
                id: 'demo-user-id-123',
                name: 'Demo User',
                email: 'demo@example.com',
                roles: ['user']
            }
        };

        this.users['testuser@example.com'] = {
            password: 'Password123',
            userData: {
                id: 'test-user-id-123',
                name: 'Test User',
                email: 'testuser@example.com',
                roles: ['user']
            }
        };

        this.users['admin@example.com'] = {
            password: 'admin123',
            userData: {
                id: 'admin-user-id-456',
                name: 'Admin User',
                email: 'admin@example.com',
                roles: ['admin', 'user']
            }
        };

        this.logger.info('Mock auth repository initialized with test users', {
            users: Object.keys(this.users).join(', ')
        });
    }

    async login(request: LoginRequest): Promise<LoginResponse | null> {
        this.logger.info('Mock login attempt', { email: request.email });

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));

        const userRecord = this.users[request.email];

        if (userRecord && userRecord.password === request.password) {
            this.logger.info('Mock login successful');
            return {
                user: userRecord.userData,
                token: `mock-jwt-token-${Date.now()}`
            };
        }

        this.logger.error('Mock login failed: Invalid credentials');
        throw new Error('Invalid credentials');
    }

    async register(request: RegisterRequest): Promise<RegisterResponse | null> {
        this.logger.info('Mock registration attempt', { email: request.email });

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));

        if (this.users[request.email]) {
            this.logger.error('Mock registration failed: Email already exists');
            throw new Error('Email already exists');
        }

        // Create a new user
        const newUser = {
            id: `user-${Date.now()}`,
            name: request.name,
            email: request.email,
            roles: ['user']
        };

        // Store the user
        this.users[request.email] = {
            password: request.password,
            userData: newUser
        };

        this.logger.info('Mock registration successful');
        return {
            user: newUser,
            token: `mock-jwt-token-${Date.now()}`
        };
    }

    async logout(): Promise<boolean> {
        this.logger.info('Mock logout successful');
        return true;
    }
} 