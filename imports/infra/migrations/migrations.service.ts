import './migrations';
import { injectable } from 'tsyringe';
import { Logger } from '@infra/logger/logger.service';

@injectable()
export class MigrationsService {
  public constructor(private readonly _logger: Logger) {}

  public start() {
    // @ts-ignore
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

    // @ts-ignore
    // Migrations.migrateTo(0);

    // @ts-ignore
    Migrations.migrateTo('latest');
  }
}
