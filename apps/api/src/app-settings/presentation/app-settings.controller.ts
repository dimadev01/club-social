import { UserRole } from '@club-social/shared/users';
import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Inject,
  Patch,
  Session,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import type { AuthSession } from '@/infrastructure/auth/better-auth/better-auth.types';
import type { AppLogger } from '@/shared/application/app-logger';

import { APP_LOGGER_PROVIDER } from '@/shared/application/app-logger';
import { BaseController } from '@/shared/presentation/controller';
import { PublicRoute } from '@/shared/presentation/decorators/public-route.decorator';
import { SkipMaintenanceCheck } from '@/shared/presentation/decorators/skip-maintenance-check.decorator';

import type { AppSettingRepository } from '../domain/app-setting.repository';

import { UpdateSettingUseCase } from '../application/update-setting.use-case';
import { APP_SETTING_REPOSITORY_PROVIDER } from '../domain/app-setting.repository';
import { AppSettingKey } from '../domain/app-setting.types';
import { AppSettingEntity } from '../domain/entities/app-setting.entity';
import { AppSettingService } from '../infrastructure/app-setting.service';
import { AppSettingDto, MaintenanceModeDto } from './dto/app-setting.dto';
import { UpdateMaintenanceModeDto } from './dto/update-setting.dto';

@ApiTags('App Settings')
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
  ): Promise<AppSettingDto[]> {
    this.requireAdmin(session);

    const settings = await this.repository.findAll();

    return settings.map((s) => this.toDto(s));
  }

  @Get('maintenance-mode')
  @PublicRoute()
  @SkipMaintenanceCheck()
  public async getMaintenanceMode(): Promise<MaintenanceModeDto> {
    const maintenanceMode = await this.appSettingService.getMaintenanceMode();

    return {
      enabled: maintenanceMode.enabled,
    };
  }

  @Patch('maintenance-mode')
  public async updateMaintenanceMode(
    @Body() body: UpdateMaintenanceModeDto,
    @Session() session: AuthSession,
  ): Promise<AppSettingDto> {
    this.requireAdmin(session);

    const result = await this.updateSettingUseCase.execute({
      key: AppSettingKey.MAINTENANCE_MODE,
      updatedBy: session.user.id,
      value: { enabled: body.enabled },
    });

    const entity = this.handleResult(result);

    return this.toDto(entity);
  }

  private requireAdmin(session: AuthSession): void {
    if (session.user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admins can access this resource');
    }
  }

  private toDto(entity: AppSettingEntity): AppSettingDto {
    return {
      description: entity.description,
      key: entity.key,
      updatedAt: entity.updatedAt,
      updatedBy: entity.updatedBy,
      value: entity.value,
    };
  }
}
