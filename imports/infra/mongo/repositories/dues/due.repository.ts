import SimpleSchema from 'simpl-schema';
import { inject, injectable } from 'tsyringe';
import { ILogger } from '@application/logger/logger.interface';
import { DueCollection, DueSchema } from '@domain/dues/due.collection';
import { IDuePort } from '@domain/dues/due.port';
import { Due } from '@domain/dues/entities/due.entity';
import { DIToken } from '@infra/di/di-tokens';
import { MongoCollection } from '@infra/mongo/common/mongo-collection.base';
import { MongoCrudRepository } from '@infra/mongo/common/mongo-crud.repository';

@injectable()
export class DuetRepository
  extends MongoCrudRepository<Due>
  implements IDuePort
{
  public constructor(
    @inject(DIToken.Logger)
    protected readonly _logger: ILogger
  ) {
    super(_logger);
  }

  protected getCollection(): MongoCollection<Due> {
    return DueCollection;
  }

  protected getSchema(): SimpleSchema {
    return DueSchema;
  }
}
