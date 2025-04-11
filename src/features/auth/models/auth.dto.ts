export interface LoginDTO {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterDTO {
  email: string;
  password: string;
  username: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthResponseDTO {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
  user: {
    id: string;
    email: string;
    username: string;
    roles: Array<{ id: string; name: string }>;
  };
} 