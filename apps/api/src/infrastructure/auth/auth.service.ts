import { Request } from 'express';

export const AUTH_SERVICE_PROVIDER = Symbol('AuthService');

export interface AuthService {
  isValid(req: Request): Promise<boolean>;
}
