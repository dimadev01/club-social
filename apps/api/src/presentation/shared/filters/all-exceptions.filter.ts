import {
  ArgumentsHost,
  Catch,
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { BaseExceptionFilter, HttpAdapterHost } from '@nestjs/core';
import * as Sentry from '@sentry/nestjs';

import {
  APP_LOGGER_PROVIDER,
  type AppLogger,
} from '@/application/shared/logger/logger';
import { ConfigService } from '@/infrastructure/config/config.service';
import { TraceService } from '@/infrastructure/trace/trace.service';

@Catch()
@Injectable()
export class AllExceptionsFilter extends BaseExceptionFilter {
  public constructor(
    protected readonly adapterHost: HttpAdapterHost,
    @Inject(APP_LOGGER_PROVIDER)
    private readonly logger: AppLogger,
    private readonly traceService: TraceService,
    private readonly configService: ConfigService,
  ) {
    super(adapterHost.httpAdapter);
    this.logger.setContext(AllExceptionsFilter.name);
  }

  public catch(exception: unknown, host: ArgumentsHost): void {
    if (exception instanceof HttpException) {
      super.catch(exception, host);

      return;
    }

    const traceId = this.traceService.get();

    if (traceId) {
      Sentry.setTag('traceId', traceId);
    }

    this.logger.error({
      error: exception,
      message: 'Unhandled exception',
      method: this.catch.name,
    });

    if (!this.configService.isLocal) {
      Sentry.captureException(exception);
    }

    super.catch(new InternalServerErrorException(), host);
  }
}
