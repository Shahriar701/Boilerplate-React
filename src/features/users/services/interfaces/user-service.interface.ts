import { User } from '../../../../domain/entities/user.entity';
import { CreateUserDTO, UpdateUserDTO } from '../../models/user.dto';

export interface IUserService {
  getAllUsers(): Promise<User[]>;
  getUserById(id: string): Promise<User>;
  getUserByEmail(email: string): Promise<User | null>;
  createUser(createUserDTO: CreateUserDTO): Promise<User>;
  updateUser(id: string, updateUserDTO: UpdateUserDTO): Promise<User>;
  deleteUser(id: string): Promise<boolean>;
} 