import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { fromNodeHeaders } from 'better-auth/node';
import { Request } from 'express';

import { BetterAuthService } from '@/infrastructure/auth/better-auth/better-auth.service';
import { AuthSession } from '@/infrastructure/auth/better-auth/better-auth.types';

import { IS_PUBLIC_KEY } from '../decorators/public-route.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  public constructor(
    private readonly reflector: Reflector,
    private readonly betterAuth: BetterAuthService,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const req = context
      .switchToHttp()
      .getRequest<Request & { session: AuthSession | null }>();

    const session = await this.betterAuth.auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    req.session = session;

    return !!session;
  }
}
