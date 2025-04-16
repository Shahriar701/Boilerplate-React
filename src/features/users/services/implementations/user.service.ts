import { injectable, inject, LazyServiceIdentifier } from 'inversify';
import { TYPES } from '../../../../app/config/types';
import { User } from '../../../../domain/entities/user.entity';
import { IUserRepository } from '../../repositories/interfaces/user-repository.interface';
import { IUserService } from '../interfaces/user-service.interface';
import { CreateUserDTO, UpdateUserDTO } from '../../models/user.dto';
import { ILogger } from '../../../../infrastructure/logging/logger.interface';

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject(TYPES.IUserRepository) private userRepository: IUserRepository,
    @inject(new LazyServiceIdentifier(() => TYPES.LoggerService)) private logger: ILogger
  ) {}

  async getAllUsers(): Promise<User[]> {
    try {
      return await this.userRepository.findAll();
    } catch (error) {
      this.logger.error('Error getting all users', error as Error);
      throw new Error('Failed to retrieve users');
    }
  }

  async getUserById(id: string): Promise<User> {
    try {
      const user = await this.userRepository.findById(id);
      
      if (!user) {
        throw new Error(`User with ID ${id} not found`);
      }
      
      return user;
    } catch (error) {
      this.logger.error(`Error getting user by ID: ${id}`, error as Error);
      throw error instanceof Error ? error : new Error(`Failed to retrieve user with ID ${id}`);
    }
  }

  async getUserByEmail(email: string): Promise<User | null> {
    try {
      return await this.userRepository.findByEmail(email);
    } catch (error) {
      this.logger.error(`Error getting user by email: ${email}`, error as Error);
      throw new Error(`Failed to retrieve user with email ${email}`);
    }
  }

  async createUser(createUserDTO: CreateUserDTO): Promise<User> {
    try {
      // Check if email already exists
      const existingEmail = await this.userRepository.findByEmail(createUserDTO.email);
      if (existingEmail) {
        throw new Error(`User with email ${createUserDTO.email} already exists`);
      }
      
      // Check if username already exists
      const existingUsername = await this.userRepository.findByUsername(createUserDTO.username);
      if (existingUsername) {
        throw new Error(`Username ${createUserDTO.username} is already taken`);
      }
      
      return await this.userRepository.create(createUserDTO);
    } catch (error) {
      this.logger.error('Error creating user', error as Error);
      throw error instanceof Error ? error : new Error('Failed to create user');
    }
  }

  async updateUser(id: string, updateUserDTO: UpdateUserDTO): Promise<User> {
    try {
      // Check if user exists
      const existingUser = await this.userRepository.findById(id);
      if (!existingUser) {
        throw new Error(`User with ID ${id} not found`);
      }
      
      // If email is being updated, check if it's already taken
      if (updateUserDTO.email && updateUserDTO.email !== existingUser.email) {
        const existingEmail = await this.userRepository.findByEmail(updateUserDTO.email);
        if (existingEmail) {
          throw new Error(`User with email ${updateUserDTO.email} already exists`);
        }
      }
      
      // If username is being updated, check if it's already taken
      if (updateUserDTO.username && updateUserDTO.username !== existingUser.username) {
        const existingUsername = await this.userRepository.findByUsername(updateUserDTO.username);
        if (existingUsername) {
          throw new Error(`Username ${updateUserDTO.username} is already taken`);
        }
      }
      
      return await this.userRepository.update(id, updateUserDTO);
    } catch (error) {
      this.logger.error(`Error updating user: ${id}`, error as Error);
      throw error instanceof Error ? error : new Error(`Failed to update user with ID ${id}`);
    }
  }

  async deleteUser(id: string): Promise<boolean> {
    try {
      const existingUser = await this.userRepository.findById(id);
      if (!existingUser) {
        throw new Error(`User with ID ${id} not found`);
      }
      
      return await this.userRepository.delete(id);
    } catch (error) {
      this.logger.error(`Error deleting user: ${id}`, error as Error);
      throw error instanceof Error ? error : new Error(`Failed to delete user with ID ${id}`);
    }
  }
} 