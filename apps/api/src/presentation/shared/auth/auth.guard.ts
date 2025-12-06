import { Inject } from '@nestjs/common';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

import {
  APP_LOGGER_PROVIDER,
  type AppLogger,
} from '@/application/shared/logger/logger';

import { IS_PUBLIC_KEY } from './public-route.decorator';
import { RequestWithUser } from './request-with-user';

@Injectable()
export class AuthGuard implements CanActivate {
  public constructor(
    @Inject(APP_LOGGER_PROVIDER)
    private readonly logger: AppLogger,
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<RequestWithUser>();

    this.logger.info({
      message: 'Validating request',
    });

    const authHeader = request.headers.authorization;

    if (!authHeader) {
      return false;
    }

    const [type, token] = authHeader.split(' ');

    if (type !== 'Bearer') {
      return false;
    }

    const decoded = await this.jwtService.verifyAsync(token);

    if (!decoded) {
      return false;
    }

    request.user = decoded;

    return true;
  }
}
