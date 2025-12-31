import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';

import { ConfigService } from '../config/config.service';

@Module({
  exports: [BullModule],
  imports: [
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.redisHost,
          port: configService.redisPort,
        },
      }),
    }),
    BullModule.registerQueue({
      name: 'email',
    }),
  ],
  providers: [],
})
export class QueueModule {}
