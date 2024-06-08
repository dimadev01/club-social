import SimpleSchema from 'simpl-schema';
import { inject, injectable } from 'tsyringe';

import { DIToken } from '@application/common/di/tokens.di';
import { ILogger } from '@domain/common/logger/logger.interface';
import { Movement } from '@domain/movements/entities/movement.entity';
import {
  MovementCollection,
  MovementSchema,
} from '@domain/movements/movement.collection';
import { IMovementPort } from '@domain/movements/movement.port';
import { MongoCollectionOld } from '@infra/mongo/old/mongo-collection.old';
import { MongoCrudRepositoryOld } from '@infra/mongo/old/mongo-crud.repository';

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
