import SimpleSchema from 'simpl-schema';
import { inject, injectable } from 'tsyringe';

import { MongoCollectionOld } from '@adapters/mongo/common/mongo-collection.old';
import { MongoCrudRepositoryOld } from '@adapters/repositories/mongo-crud.repository';
import { ILogger } from '@application/logger/logger.interface';
import { DIToken } from '@domain/common/tokens.di';
import { Movement } from '@domain/movements/entities/movement.entity';
import {
  MovementCollection,
  MovementSchema,
} from '@domain/movements/movement.collection';
import { IMovementPort } from '@domain/movements/movement.port';

@injectable()
export class MovementRepository
  extends MongoCrudRepositoryOld<Movement>
  implements IMovementPort
{
  public constructor(
    @inject(DIToken.Logger)
    protected readonly _logger: ILogger,
  ) {
    super(_logger);
  }

  protected getCollection(): MongoCollectionOld<Movement> {
    return MovementCollection;
  }

  protected getSchema(): SimpleSchema {
    return MovementSchema;
  }
}
