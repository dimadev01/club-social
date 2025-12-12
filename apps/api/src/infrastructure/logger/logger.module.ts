import { Logtail } from '@logtail/node';
import { LogtailTransport } from '@logtail/winston';
import { Global, Module } from '@nestjs/common';
import { WinstonModule, utilities as winstonUtilities } from 'nest-winston';
import * as winston from 'winston';

import { ConfigService } from '@/infrastructure/config/config.service';
import { TraceModule } from '@/infrastructure/trace/trace.module';
import { TraceService } from '@/infrastructure/trace/trace.service';
import { APP_LOGGER_PROVIDER } from '@/shared/application/app-logger';

import { AppLoggerService } from './logger.service';
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

        return {
          transports: [
            new LogtailTransport(
              new Logtail(configService.betterStackSourceToken, {
                endpoint: configService.betterStackEndpoint,
              }),
              {
                format: commonFormat,
                level: 'info',
              },
            ),
            new winston.transports.Console({
              format: commonFormat,
              level: 'info',
            }),
          ],
        };
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
