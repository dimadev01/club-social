import {
  AppSettingKey,
  AppSettingScope,
} from '@club-social/shared/app-settings';
import { UserRole } from '@club-social/shared/users';
import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  Inject,
  NotFoundException,
  Param,
  Patch,
  Session,
} from '@nestjs/common';

import type { AuthSession } from '@/infrastructure/auth/better-auth/better-auth.types';
import type { AppLogger } from '@/shared/application/app-logger';

import { APP_LOGGER_PROVIDER } from '@/shared/application/app-logger';
import { BaseController } from '@/shared/presentation/controller';
import { PublicRoute } from '@/shared/presentation/decorators/public-route.decorator';
import { SkipMaintenanceCheck } from '@/shared/presentation/decorators/skip-maintenance-check.decorator';

import type { AppSettingRepository } from '../domain/app-setting.repository';

import { UpdateSettingUseCase } from '../application/update-setting.use-case';
import { APP_SETTING_REPOSITORY_PROVIDER } from '../domain/app-setting.repository';
import { isValidAppSettingKey } from '../domain/app-setting.types';
import { AppSettingEntity } from '../domain/entities/app-setting.entity';
import { AppSettingService } from '../infrastructure/app-setting.service';
import { AppSettingResponseDto } from './dto/app-setting.dto';
import { UpdateSettingRequestDto } from './dto/update-setting.dto';

@Controller('app-settings')
export class AppSettingsController extends BaseController {
  public constructor(
    @Inject(APP_LOGGER_PROVIDER)
    protected readonly logger: AppLogger,
    @Inject(APP_SETTING_REPOSITORY_PROVIDER)
    private readonly repository: AppSettingRepository,
    private readonly appSettingService: AppSettingService,
    private readonly updateSettingUseCase: UpdateSettingUseCase,
  ) {
    super(logger);
  }

  @Get()
  public async getAll(
    @Session() session: AuthSession,
  ): Promise<AppSettingResponseDto<AppSettingKey>[]> {
    const scopes = this.getScopesForRole(session.user.role as UserRole);

    if (scopes.length === 0) {
      throw new ForbiddenException('You do not have access to any settings');
    }

    const settings = await this.repository.findByScopes(scopes);

    return settings.map((s) => this.toDto(s));
  }

  @Get('maintenance-mode')
  @PublicRoute()
  @SkipMaintenanceCheck()
  public async getMaintenanceMode(): Promise<
    AppSettingResponseDto<AppSettingKey>
  > {
    const setting = await this.appSettingService.getMaintenanceMode();

    return this.toDto(setting);
  }

  @Patch('maintenance-mode')
  public async updateMaintenanceMode(
    @Body() body: UpdateSettingRequestDto,
    @Session() session: AuthSession,
  ): Promise<void> {
    this.requireAdmin(session);

    this.handleResult(
      await this.updateSettingUseCase.execute({
        key: AppSettingKey.MAINTENANCE_MODE,
        updatedBy: session.user.name,
        value: body.value,
      }),
    );
  }

  @Get(':key')
  public async getByKey(
    @Param('key') key: string,
    @Session() session: AuthSession,
  ): Promise<AppSettingResponseDto<AppSettingKey>> {
    if (!isValidAppSettingKey(key)) {
      throw new NotFoundException(`Setting with key "${key}" not found`);
    }

    const setting = await this.appSettingService.getValue(key);

    this.requireAccessToScope(setting.scope, session.user.role as UserRole);

    return this.toDto(setting);
  }

  @Patch(':key')
  public async updateByKey(
    @Param('key') key: string,
    @Body() body: UpdateSettingRequestDto,
    @Session() session: AuthSession,
  ): Promise<void> {
    if (!isValidAppSettingKey(key)) {
      throw new BadRequestException(`Invalid setting key: "${key}"`);
    }

    const setting = await this.appSettingService.getValue(key);

    this.requireAccessToScope(setting.scope, session.user.role as UserRole);

    this.handleResult(
      await this.updateSettingUseCase.execute({
        key,
        updatedBy: session.user.name,
        value: body.value,
      }),
    );
  }

  private getScopesForRole(role: UserRole): AppSettingScope[] {
    switch (role) {
      case UserRole.ADMIN:
        return [AppSettingScope.SYSTEM, AppSettingScope.APP];
      case UserRole.STAFF:
        return [AppSettingScope.APP];
      default:
        return [];
    }
  }

  private requireAccessToScope(scope: AppSettingScope, role: UserRole): void {
    const allowedScopes = this.getScopesForRole(role);

    if (!allowedScopes.includes(scope)) {
      throw new ForbiddenException(
        'You do not have permission to access this setting',
      );
    }
  }

  private requireAdmin(session: AuthSession): void {
    if (session.user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admins can access this resource');
    }
  }

  private toDto(
    entity: AppSettingEntity,
  ): AppSettingResponseDto<AppSettingKey> {
    return {
      description: entity.description,
      key: entity.id.value as AppSettingKey,
      scope: entity.scope,
      updatedAt: entity.updatedAt.toISOString(),
      updatedBy: entity.updatedBy,
      value: entity.value,
    };
  }
}
