import {
  AppSettingKey,
  AppSettingValues,
} from '@club-social/shared/app-settings';
import { Inject, Injectable } from '@nestjs/common';

import type { AppLogger } from '@/shared/application/app-logger';

import { APP_LOGGER_PROVIDER } from '@/shared/application/app-logger';
import { UseCase } from '@/shared/application/use-case';
import { DomainEventPublisher } from '@/shared/domain/events/domain-event-publisher';
import { ok, Result } from '@/shared/domain/result';

import type { AppSettingRepository } from '../domain/app-setting.repository';

import { APP_SETTING_REPOSITORY_PROVIDER } from '../domain/app-setting.repository';
import { AppSettingEntity } from '../domain/entities/app-setting.entity';

interface UpdateSettingParams<K extends AppSettingKey> {
  key: K;
  updatedBy: string;
  value: unknown;
}

@Injectable()
export class UpdateSettingUseCase extends UseCase<AppSettingEntity> {
  public constructor(
    @Inject(APP_LOGGER_PROVIDER)
    protected readonly logger: AppLogger,
    @Inject(APP_SETTING_REPOSITORY_PROVIDER)
    private readonly repository: AppSettingRepository,
    private readonly eventPublisher: DomainEventPublisher,
  ) {
    super(logger);
  }

  public async execute<K extends AppSettingKey>(
    params: UpdateSettingParams<K>,
  ): Promise<Result<AppSettingEntity<K>>> {
    this.logger.info({
      key: params.key,
      message: 'Updating app setting',
    });

    const value = params.value as AppSettingValues[K];

    const setting = await this.repository.findByKeyOrThrow<K>(params.key);

    setting.updateValue(value, params.updatedBy);

    await this.repository.save(setting);
    this.eventPublisher.dispatch(setting);

    this.logger.info({
      key: params.key,
      message: 'App setting updated successfully',
    });

    return ok(setting);
  }
}
