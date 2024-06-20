import type { Document } from 'mongodb';
import invariant from 'tiny-invariant';
import { inject, injectable } from 'tsyringe';

import { DIToken } from '@application/common/di/tokens.di';
import { ILoggerService } from '@application/common/logger/logger.interface';
import { FindPaginatedResponse } from '@application/common/repositories/grid.repository';
import { FindOneById } from '@application/common/repositories/queryable.repository';
import {
  FindPaginatedMovementsFilters,
  FindPaginatedMovementsRequest,
  GetMovementsTotalsResponse,
  IMovementRepository,
} from '@application/movements/repositories/movement.repository';
import { MovementTypeEnum } from '@domain/categories/category.enum';
import { DateVo } from '@domain/common/value-objects/date.value-object';
import { Movement } from '@domain/movements/models/movement.model';
import { MovementAuditableCollection } from '@infra/mongo/collections/movement-auditable.collection';
import { MovementMongoCollection } from '@infra/mongo/collections/movement.collection';
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
    @inject(DIToken.ILoggerService)
    protected readonly logger: ILoggerService,
    protected readonly collection: MovementMongoCollection,
    protected readonly mapper: MovementMapper,
    protected readonly auditableCollection: MovementAuditableCollection,
  ) {
    super(collection, mapper, logger, auditableCollection);
  }

  public async findOneByPaymentOrThrow(
    request: FindOneById,
  ): Promise<Movement> {
    const entity = await this.collection.findOneAsync({
      paymentId: request.id,
    });

    invariant(entity);

    return this.mapper.toDomain(entity);
  }

  public async findPaginated(
    request: FindPaginatedMovementsRequest,
  ): Promise<FindPaginatedResponse<Movement>> {
    const query = this._getQueryByFilters(request);

    const pipeline: Document[] = [
      { $match: query },
      ...this.getPaginatedPipeline(request),
      {
        $lookup: {
          as: 'payment',
          foreignField: '_id',
          from: 'payments',
          localField: 'paymentId',
          pipeline: [...this.getMemberLookupPipeline()],
        },
      },
      {
        $unwind: {
          path: '$payment',
          preserveNullAndEmptyArrays: true,
        },
      },
    ];

    return super.paginate(pipeline, query);
  }

  public async findToExport(
    request: FindPaginatedMovementsRequest,
  ): Promise<Movement[]> {
    const query = this._getQueryByFilters(request);

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

  public async getTotals(
    request: FindPaginatedMovementsFilters,
  ): Promise<GetMovementsTotalsResponse> {
    const query = this._getQueryByFilters(request);

    const [result] = await this.collection
      .rawCollection()
      .aggregate([
        { $match: query },
        {
          $facet: {
            expense: [
              { $match: { type: MovementTypeEnum.EXPENSE } },
              { $group: { _id: null, total: { $sum: '$amount' } } },
            ],
            income: [
              { $match: { type: MovementTypeEnum.INCOME } },
              { $group: { _id: null, total: { $sum: '$amount' } } },
            ],
          },
        },
        {
          $project: {
            expense: {
              $ifNull: [{ $first: '$expense.total' }, 0],
            },
            income: {
              $ifNull: [{ $first: '$income.total' }, 0],
            },
            total: {
              $subtract: [
                { $ifNull: [{ $first: ['$income.total'] }, 0] },
                { $ifNull: [{ $first: ['$expense.total'] }, 0] },
              ],
            },
          },
        },
      ])
      .toArray();

    return {
      expense: result?.expense ?? 0,
      income: result?.income ?? 0,
      total: result?.total ?? 0,
    };
  }

  private _getQueryByFilters(
    request: FindPaginatedMovementsFilters,
  ): Mongo.Query<MovementEntity> {
    const query: Mongo.Query<MovementEntity> = {
      isDeleted: false,
    };

    if (request.filterByCategory.length > 0) {
      query.category = { $in: request.filterByCategory };
    }

    if (request.filterByType.length > 0) {
      query.type = { $in: request.filterByType };
    }

    if (request.filterByStatus.length > 0) {
      query.status = { $in: request.filterByStatus };
    }

    if (request.filterByCreatedAt.length > 0) {
      query.createdAt = {
        $gte: new DateVo(request.filterByCreatedAt[0]).date,
        $lte: new DateVo(request.filterByCreatedAt[1]).date,
      };
    }

    if (request.filterByDate.length > 0) {
      query.date = {
        $gte: new DateVo(request.filterByDate[0]).date,
        $lte: new DateVo(request.filterByDate[1]).date,
      };
    }

    return query;
  }
}
