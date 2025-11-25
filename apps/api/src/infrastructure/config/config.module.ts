import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';

import configLoader from './config.loader';
import { ConfigService } from './config.service';

@Module({
  exports: [ConfigService],
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      load: [configLoader],
    }),
  ],
  providers: [ConfigService],
})
export class ConfigModule {}
