import { UserRole } from '@club-social/shared/users';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

import { AppSettingService } from '@/app-settings/infrastructure/app-setting.service';
import { AuthSession } from '@/infrastructure/auth/better-auth/better-auth.types';

import { IS_PUBLIC_KEY } from '../decorators/public-route.decorator';
import { SKIP_MAINTENANCE_CHECK_KEY } from '../decorators/skip-maintenance-check.decorator';

@Injectable()
export class MaintenanceModeGuard implements CanActivate {
  public constructor(
    private readonly reflector: Reflector,
    private readonly appSettingService: AppSettingService,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const skipMaintenanceCheck = this.reflector.getAllAndOverride<boolean>(
      SKIP_MAINTENANCE_CHECK_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (skipMaintenanceCheck) {
      return true;
    }

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const maintenanceModeSetting =
      await this.appSettingService.getMaintenanceMode();

    if (!maintenanceModeSetting.value.enabled) {
      return true;
    }

    const req = context
      .switchToHttp()
      .getRequest<Request & { session: AuthSession | null }>();

    const session = req.session;

    if (session?.user.role === UserRole.ADMIN) {
      return true;
    }

    throw new ServiceUnavailableException({
      error: 'Service Unavailable',
      message:
        'El sistema se encuentra en mantenimiento. Por favor, intente más tarde.',
      statusCode: 503,
    });
  }
}
