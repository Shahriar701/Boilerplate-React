import { User } from '../../../../domain/entities/user.entity';
import { CreateUserDTO, UpdateUserDTO } from '../../models/user.dto';

export interface IUserRepository {
  findAll(): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  create(createUserDTO: CreateUserDTO): Promise<User>;
  update(id: string, updateUserDTO: UpdateUserDTO): Promise<User>;
  delete(id: string): Promise<boolean>;
} 