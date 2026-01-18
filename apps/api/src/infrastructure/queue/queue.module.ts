import { BullModule } from '@nestjs/bullmq';
import { Global, Module } from '@nestjs/common';

import { ConfigService } from '../config/config.service';

@Global()
@Module({
  exports: [BullModule],
  imports: [
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.redisHost,
          password: configService.redisPassword,
          port: configService.redisPort,
        },
      }),
    }),
    BullModule.registerQueue({
      defaultJobOptions: {
        attempts: 3,
        backoff: { delay: 5_000, type: 'exponential' },
        removeOnComplete: true,
        removeOnFail: { count: 1000 },
      },
      name: 'email-critical',
    }),
    BullModule.registerQueue({
      defaultJobOptions: {
        attempts: 3,
        backoff: { delay: 5_000, type: 'exponential' },
        removeOnComplete: true,
        removeOnFail: { count: 1000 },
      },
      name: 'notification',
    }),
  ],
  providers: [],
})
export class QueueModule {}
