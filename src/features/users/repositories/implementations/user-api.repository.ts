import { injectable, inject } from 'inversify';
import { TYPES } from '../../../../app/config/types';
import { IHttpClient } from '../../../../infrastructure/http/interfaces/http-client.interface';
import { User } from '../../../../domain/entities/user.entity';
import { CreateUserDTO, UpdateUserDTO, UserDTO, mapUserDTOToDomain } from '../../models/user.dto';
import { IUserRepository } from '../interfaces/user-repository.interface';
import { ILogger } from '../../../../infrastructure/logging/logger.interface';

@injectable()
export class UserApiRepository implements IUserRepository {
  constructor(
    @inject(TYPES.IHttpClient) private httpClient: IHttpClient,
    @inject(TYPES.ILogger) private logger: ILogger
  ) {}

  async findAll(): Promise<User[]> {
    try {
      const response = await this.httpClient.get<UserDTO[]>('/users');
      return response.data.map(mapUserDTOToDomain);
    } catch (error) {
      this.logger.error('Error fetching all users', error as Error);
      throw error;
    }
  }

  async findById(id: string): Promise<User | null> {
    try {
      const response = await this.httpClient.get<UserDTO>(`/users/${id}`);
      return mapUserDTOToDomain(response.data);
    } catch (error: any) {
      if (error.status === 404) {
        return null;
      }
      this.logger.error(`Error fetching user by id: ${id}`, error as Error);
      throw error;
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      const response = await this.httpClient.get<UserDTO[]>('/users', { email });
      
      if (response.data.length === 0) {
        return null;
      }
      
      return mapUserDTOToDomain(response.data[0]);
    } catch (error) {
      this.logger.error(`Error fetching user by email: ${email}`, error as Error);
      throw error;
    }
  }

  async findByUsername(username: string): Promise<User | null> {
    try {
      const response = await this.httpClient.get<UserDTO[]>('/users', { username });
      
      if (response.data.length === 0) {
        return null;
      }
      
      return mapUserDTOToDomain(response.data[0]);
    } catch (error) {
      this.logger.error(`Error fetching user by username: ${username}`, error as Error);
      throw error;
    }
  }

  async create(createUserDTO: CreateUserDTO): Promise<User> {
    try {
      const response = await this.httpClient.post<UserDTO>('/users', createUserDTO);
      return mapUserDTOToDomain(response.data);
    } catch (error) {
      this.logger.error('Error creating user', error as Error);
      throw error;
    }
  }

  async update(id: string, updateUserDTO: UpdateUserDTO): Promise<User> {
    try {
      const response = await this.httpClient.put<UserDTO>(`/users/${id}`, updateUserDTO);
      return mapUserDTOToDomain(response.data);
    } catch (error) {
      this.logger.error(`Error updating user: ${id}`, error as Error);
      throw error;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.httpClient.delete(`/users/${id}`);
      return true;
    } catch (error) {
      this.logger.error(`Error deleting user: ${id}`, error as Error);
      throw error;
    }
  }
} 