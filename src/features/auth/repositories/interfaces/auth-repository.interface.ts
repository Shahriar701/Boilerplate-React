import { AuthResponseDTO, LoginDTO, RegisterDTO } from '../../models/auth.dto';

export interface IAuthRepository {
  login(loginDTO: LoginDTO): Promise<AuthResponseDTO>;
  register(registerDTO: RegisterDTO): Promise<AuthResponseDTO>;
  refreshToken(refreshToken: string): Promise<AuthResponseDTO>;
  logout(): Promise<void>;
} 