import { Global, Module } from '@nestjs/common';

import { UpdateSettingUseCase } from './application/update-setting.use-case';
import { AppSettingService } from './infrastructure/app-setting.service';
import { AppSettingsController } from './presentation/app-settings.controller';

@Global()
@Module({
  controllers: [AppSettingsController],
  exports: [AppSettingService],
  providers: [AppSettingService, UpdateSettingUseCase],
})
export class AppSettingsModule {}
