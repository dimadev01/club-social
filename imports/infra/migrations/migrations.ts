import './1-create-admin';
import { injectable } from 'tsyringe';

@injectable()
export class MigrationsService {
  public start() {
    // @ts-ignore
    Migrations.migrateTo('latest');
  }
}
