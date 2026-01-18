import { RedisModule as NestRedisModule } from '@nestjs-labs/nestjs-ioredis';
import { Global, Module } from '@nestjs/common';

import { ConfigService } from '../config/config.service';

@Global()
@Module({
  exports: [NestRedisModule],
  imports: [
    NestRedisModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        config: {
          host: configService.redisHost,
          password: configService.redisPassword,
          port: configService.redisPort,
        },
      }),
    }),
  ],
})
export class RedisModule {}
