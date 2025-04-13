import { RegisterRequest, RegisterResponse } from '../models/auth.dto';

export interface IRegisterUseCase {
  execute(request: RegisterRequest): Promise<RegisterResponse | null>;
} 