import type { Document } from 'mongodb';
import { inject, injectable } from 'tsyringe';

import { DIToken } from '@application/common/di/tokens.di';
import { ILogger } from '@domain/common/logger/logger.interface';
import {
  FindPaginatedRequest,
  FindPaginatedResponse,
} from '@domain/common/repositories/grid.repository';
import { Movement } from '@domain/movements/models/movement.model';
import { IMovementRepository } from '@domain/movements/movement.repository';
import { MovementCollection } from '@infra/mongo/collections/movement.collection';
import { MovementEntity } from '@infra/mongo/entities/movement.entity';
import { MovementMapper } from '@infra/mongo/mappers/movement.mapper';
import { CrudMongoRepository } from '@infra/mongo/repositories/common/crud-mongo.repository';

@injectable()
export class MovementMongoRepository
  extends CrudMongoRepository<Movement, MovementEntity>
  implements IMovementRepository
{
  public constructor(
    @inject(DIToken.Logger)
    protected readonly logger: ILogger,
    protected readonly collection: MovementCollection,
    protected readonly mapper: MovementMapper,
  ) {
    super(collection, mapper, logger);
  }

  public async findPaginated(
    request: FindPaginatedRequest,
  ): Promise<FindPaginatedResponse<Movement>> {
    const query: Mongo.Query<MovementEntity> = {
      isDeleted: false,
    };

    const pipeline: Document[] = [
      { $match: query },
      ...this.getPaginatedPipeline(request),
    ];

    return super.paginate(pipeline, request);
  }
}
