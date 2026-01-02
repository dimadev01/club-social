import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { AppSettingUpdatedEvent } from '@/app-settings/domain/events/app-setting-updated.event';
import {
  APP_LOGGER_PROVIDER,
  type AppLogger,
} from '@/shared/application/app-logger';

import { AppSettingService } from '../app-setting.service';

@Injectable()
export class AppSettingEventHandler {
  public constructor(
    @Inject(APP_LOGGER_PROVIDER)
    private readonly logger: AppLogger,
    private readonly appSettingCacheService: AppSettingService,
  ) {
    this.logger.setContext(AppSettingEventHandler.name);
  }

  @OnEvent(AppSettingUpdatedEvent.name)
  public async handleAppSettingUpdated(
    event: AppSettingUpdatedEvent,
  ): Promise<void> {
    await this.appSettingCacheService.invalidate(event.appSetting.key);
  }
}
