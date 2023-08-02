import './migrations';
import { injectable } from 'tsyringe';
import { LoggerOstrio } from '@infra/logger/logger-ostrio';

@injectable()
export class MigrationsService {
  public constructor(private readonly _logger: LoggerOstrio) {}

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

    // @ts-expect-error
    // Migrations.migrateTo(0);

    // @ts-expect-error
    Migrations.migrateTo('latest');
  }
}
