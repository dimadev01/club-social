import { Inject, UnauthorizedException } from '@nestjs/common';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

import {
  AUTH_SERVICE_PROVIDER,
  type AuthService,
} from '@/infrastructure/auth/auth.service';

import { IS_PUBLIC_KEY } from './public-route.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  public constructor(
    private readonly reflector: Reflector,
    @Inject(AUTH_SERVICE_PROVIDER)
    private readonly authService: AuthService,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const req = context.switchToHttp().getRequest<Request>();

    if (await this.authService.isValid(req)) {
      return true;
    }

    throw new UnauthorizedException();
  }
}
