import { Global, Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';

import configLoader from './config.loader';
import { ConfigService } from './config.service';

@Global()
@Module({
  exports: [ConfigService],
  imports: [
    NestConfigModule.forRoot({
      load: [configLoader],
    }),
  ],
  providers: [ConfigService],
})
export class ConfigModule {}
