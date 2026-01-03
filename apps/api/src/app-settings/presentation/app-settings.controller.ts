import { AppSettingKey } from '@club-social/shared/app-settings';
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
    this.requireAdmin(session);

    const settings = await this.repository.findAll();

    return settings.map((s) => this.toDto(s));
  }

  @Get('maintenance-mode')
  @PublicRoute()
  @SkipMaintenanceCheck()
  public async getMaintenanceMode(): Promise<
    AppSettingResponseDto<typeof AppSettingKey.MAINTENANCE_MODE>
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
        updatedBy: session.user.id,
        value: body.value,
      }),
    );
  }

  @Get(':key')
  public async getByKey(
    @Param('key') key: string,
    @Session() session: AuthSession,
  ): Promise<AppSettingResponseDto<AppSettingKey>> {
    this.requireAdmin(session);

    if (!isValidAppSettingKey(key)) {
      throw new NotFoundException(`Setting with key "${key}" not found`);
    }

    const setting = await this.appSettingService.getValue(key);

    return this.toDto(setting);
  }

  @Patch(':key')
  public async updateByKey(
    @Param('key') key: string,
    @Body() body: UpdateSettingRequestDto,
    @Session() session: AuthSession,
  ): Promise<void> {
    this.requireAdmin(session);

    if (!isValidAppSettingKey(key)) {
      throw new BadRequestException(`Invalid setting key: "${key}"`);
    }

    this.handleResult(
      await this.updateSettingUseCase.execute({
        key,
        updatedBy: session.user.id,
        value: body.value,
      }),
    );
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
      updatedAt: entity.updatedAt.toISOString(),
      updatedBy: entity.updatedBy,
      value: entity.value,
    };
  }
}
