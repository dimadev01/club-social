import { Global, Module } from '@nestjs/common';

import { UpdateSettingUseCase } from './application/update-setting.use-case';
import { AppSettingService } from './infrastructure/app-setting.service';
import { AppSettingEventHandler } from './infrastructure/events/app-setting-event.handler';
import { AppSettingsController } from './presentation/app-settings.controller';

@Global()
@Module({
  controllers: [AppSettingsController],
  exports: [AppSettingService],
  providers: [AppSettingService, UpdateSettingUseCase, AppSettingEventHandler],
})
export class AppSettingsModule {}
