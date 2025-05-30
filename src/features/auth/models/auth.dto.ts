export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface UserDto {
  id: string;
  email: string;
  name: string;
  roles: string[];
  isActive: boolean;
  lastLogin: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginResponse {
  user: UserDto;
  token: string;
}

export interface RegisterResponse {
  user: UserDto;
  token: string;
}

// This matches the backend response format
export interface AuthResponseDTO {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    roles?: string[];
  };
} 