import { Global, Module } from '@nestjs/common';
import * as Sentry from '@sentry/nestjs';
import { WinstonModule, utilities as winstonUtilities } from 'nest-winston';
import * as winston from 'winston';
import Transport from 'winston-transport';

import { ConfigService } from '@/infrastructure/config/config.service';
import { TraceModule } from '@/infrastructure/trace/trace.module';
import { TraceService } from '@/infrastructure/trace/trace.service';
import { APP_LOGGER_PROVIDER } from '@/shared/application/app-logger';

import { AppLoggerService } from './logger.service';
import { createPosthogTransport } from './posthog-logger-provider';
import { traceIdFormat } from './trace-id.format';

@Global()
@Module({
  exports: [APP_LOGGER_PROVIDER],
  imports: [
    WinstonModule.forRootAsync({
      imports: [TraceModule],
      inject: [ConfigService, TraceService],
      useFactory: (
        configService: ConfigService,
        traceService: TraceService,
      ) => {
        const commonFormat = winston.format.combine(
          traceIdFormat(traceService),
          winston.format.timestamp(),
          winston.format.json(),
        );

        if (configService.isLocal) {
          return {
            transports: [
              new winston.transports.Console({
                format: winston.format.combine(
                  commonFormat,
                  winstonUtilities.format.nestLike(
                    `${configService.appDisplayName} (${configService.environment})`,
                    {
                      appName: true,
                      colors: true,
                      prettyPrint: true,
                      processId: true,
                    },
                  ),
                ),
                level: 'info',
              }),
            ],
          };
        }

        const SentryWinstonTransport =
          Sentry.createSentryWinstonTransport(Transport);

        const transports: winston.transport[] = [
          new SentryWinstonTransport(),
          new winston.transports.Console({
            format: commonFormat,
            level: 'info',
          }),
        ];

        if (configService.posthogApiKey) {
          transports.push(
            createPosthogTransport(
              configService.posthogApiKey,
              configService.environment,
            ),
          );
        }

        return { transports };
      },
    }),
  ],
  providers: [
    AppLoggerService,
    {
      provide: APP_LOGGER_PROVIDER,
      useClass: AppLoggerService,
    },
  ],
})
export class LoggerModule {}
