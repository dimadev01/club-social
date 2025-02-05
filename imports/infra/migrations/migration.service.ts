import './migrations';
import { container } from 'tsyringe';

import { DIToken } from '@application/common/di/tokens.di';
import { ILoggerService } from '@application/common/logger/logger.interface';

export class MigrationService {
  public constructor(
    private readonly _logger: ILoggerService = container.resolve<ILoggerService>(
      DIToken.ILoggerService,
    ),
  ) {}

  public start() {
    // @ts-expect-error
    Migrations.config({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      logger: (params: any) => {
        if (params.level === 'info') {
          this._logger.info(params.message);
        } else if (params.level === 'warn') {
          this._logger.warn(params.message);
        } else if (params.level === 'error') {
          this._logger.error(params.message);
        } else if (params.level === 'debug') {
          this._logger.debug(params.message);
        }
      },
    });

    // Migrations.migrateTo(0);

    // @ts-expect-error
    Migrations.migrateTo('latest');
  }
}
