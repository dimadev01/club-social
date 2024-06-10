import type { Document } from 'mongodb';
import { inject, injectable } from 'tsyringe';

import { DIToken } from '@application/common/di/tokens.di';
import { ILogger } from '@domain/common/logger/logger.interface';
import { FindPaginatedResponse } from '@domain/common/repositories/grid.repository';
import { Movement } from '@domain/movements/models/movement.model';
import {
  FindPaginatedMovementsRequest,
  IMovementRepository,
} from '@domain/movements/movement.repository';
import { MovementAuditableCollection } from '@infra/mongo/collections/movement-auditable.collection';
import { MovementCollection } from '@infra/mongo/collections/movement.collection';
import { MovementAuditEntity } from '@infra/mongo/entities/movement-audit.entity';
import { MovementEntity } from '@infra/mongo/entities/movement.entity';
import { MovementMapper } from '@infra/mongo/mappers/movement.mapper';
import { CrudMongoAuditableRepository } from '@infra/mongo/repositories/common/crud-mongo-auditable.repository';

@injectable()
export class MovementMongoRepository
  extends CrudMongoAuditableRepository<
    Movement,
    MovementEntity,
    MovementAuditEntity
  >
  implements IMovementRepository
{
  public constructor(
    @inject(DIToken.Logger)
    protected readonly logger: ILogger,
    protected readonly collection: MovementCollection,
    protected readonly mapper: MovementMapper,
    protected readonly auditableCollection: MovementAuditableCollection,
  ) {
    super(collection, mapper, logger, auditableCollection);
  }

  public async findPaginated(
    request: FindPaginatedMovementsRequest,
  ): Promise<FindPaginatedResponse<Movement>> {
    const query = this._getMatchQueryToGridOrExport(request);

    const pipeline: Document[] = [
      { $match: query },
      ...this.getPaginatedPipeline(request),
    ];

    return super.paginate(pipeline, query);
  }

  public async findToExport(
    request: FindPaginatedMovementsRequest,
  ): Promise<Movement[]> {
    const query = this._getMatchQueryToGridOrExport(request);

    const pipeline: Document[] = [
      { $match: query },
      this.getPaginatedSorterStage(request.sorter),
    ];

    const entities = await this.collection
      .rawCollection()
      .aggregate<MovementEntity>(pipeline)
      .toArray();

    return entities.map<Movement>((entity) => this.mapper.toDomain(entity));
  }

  private _getMatchQueryToGridOrExport(
    request: FindPaginatedMovementsRequest,
  ): Mongo.Query<MovementEntity> {
    const query: Mongo.Query<MovementEntity> = {
      isDeleted: false,
    };

    if (request.filterByCategory.length > 0) {
      query.category = { $in: request.filterByCategory };
    }

    if (request.filterByStatus.length > 0) {
      query.status = { $in: request.filterByStatus };
    }

    return query;
  }
}
