import './migrations';
import { inject, injectable } from 'tsyringe';
import { ILogger } from '@application/logger/logger.interface';
import { DIToken } from '@infra/di/di-tokens';

@injectable()
export class MigrationService {
  public constructor(
    @inject(DIToken.Logger)
    private readonly _logger: ILogger
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
