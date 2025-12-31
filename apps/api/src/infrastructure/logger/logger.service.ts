import { Inject, Injectable, Scope } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

import { AppLogger, ErrorLog, Log } from '@/shared/application/app-logger';
import { ErrorMapper } from '@/shared/domain/errors/error.mapper';

@Injectable({ scope: Scope.TRANSIENT })
export class AppLoggerService implements AppLogger {
  private context = 'AppLoggerService';

  public constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
  ) {}

  public error(log: ErrorLog) {
    const { error, ...rest } = log;

    const normalizedError = ErrorMapper.unknownToError(error);

    this.logger.error({
      context: this.context,
      errorMessage: normalizedError.message,
      errorName: normalizedError.name,
      errorStack: normalizedError.stack,
      level: 'error',
      message: log.message ?? normalizedError.message,
      ...rest,
    });
  }

  public info(log: Log) {
    this.logger.info({ context: this.context, level: 'info', ...log });
  }

  public setContext(context: string) {
    this.context = context;
  }

  public warn(log: Log) {
    this.logger.warn({ context: this.context, level: 'warn', ...log });
  }
}
