import './migrations';
import { injectable } from 'tsyringe';

@injectable()
export class MigrationsService {
  public start() {
    // @ts-ignore
    // Migrations.migrateTo(0);

    // @ts-ignore
    Migrations.migrateTo('latest');
  }
}
