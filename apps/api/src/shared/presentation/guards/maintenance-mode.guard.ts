import { UserRole } from '@club-social/shared/users';
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

import { AuthSession } from '@/infrastructure/auth/better-auth/better-auth.types';
import { FeatureFlag } from '@/infrastructure/feature-flags/feature-flags.enum';
import {
  FEATURE_FLAGS_SERVICE_PROVIDER,
  FeatureFlagsService,
} from '@/infrastructure/feature-flags/feature-flags.service';

import { IS_PUBLIC_KEY } from '../decorators/public-route.decorator';
import { SKIP_MAINTENANCE_CHECK_KEY } from '../decorators/skip-maintenance-check.decorator';

@Injectable()
export class MaintenanceModeGuard implements CanActivate {
  public constructor(
    private readonly reflector: Reflector,
    @Inject(FEATURE_FLAGS_SERVICE_PROVIDER)
    private readonly featureFlagsService: FeatureFlagsService,
  ) {}

  public canActivate(context: ExecutionContext): boolean {
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

    const isMaintenanceMode = this.featureFlagsService.isEnabled(
      FeatureFlag.MAINTENANCE_MODE,
    );

    if (!isMaintenanceMode) {
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
