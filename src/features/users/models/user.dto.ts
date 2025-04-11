import { User, UserRole } from '../../../domain/entities/user.entity';

export interface UserDTO {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  roles: UserRole[];
  profileImageUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserDTO {
  email: string;
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
  roleIds?: string[];
}

export interface UpdateUserDTO {
  email?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  roleIds?: string[];
  isActive?: boolean;
}

export interface UpdatePasswordDTO {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Mappers
export const mapUserDTOToDomain = (userDTO: UserDTO): User => {
  return {
    id: userDTO.id,
    email: userDTO.email,
    username: userDTO.username,
    firstName: userDTO.firstName,
    lastName: userDTO.lastName,
    roles: userDTO.roles,
    profileImageUrl: userDTO.profileImageUrl,
    isActive: userDTO.isActive,
    createdAt: new Date(userDTO.createdAt),
    updatedAt: new Date(userDTO.updatedAt),
  };
};

export const mapDomainToUserDTO = (user: User): UserDTO => {
  return {
    id: user.id,
    email: user.email,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    roles: user.roles,
    profileImageUrl: user.profileImageUrl,
    isActive: user.isActive,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}; 