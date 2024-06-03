import { Mongo } from 'meteor/mongo';
import type { Document } from 'mongodb';
import { inject, injectable } from 'tsyringe';

import { DIToken } from '@application/common/di/tokens.di';
import { ILogger } from '@domain/common/logger/logger.interface';
import { FindPaginatedResponse } from '@domain/common/repositories/grid.repository';
import { DueStatusEnum } from '@domain/dues/due.enum';
import { IDueRepository } from '@domain/dues/due.repository';
import { Due } from '@domain/dues/models/due.model';
import {
  FindPaginatedDuesRequest,
  FindPendingDuesRequest,
} from '@domain/dues/repositories/due-repository.types';
import { DueCollection } from '@infra/mongo/collections/due.collection';
import { DueEntity } from '@infra/mongo/entities/due.entity';
import { DueMapper } from '@infra/mongo/mappers/due.mapper';
import { CrudMongoRepository } from '@infra/mongo/repositories/common/crud-mongo.repository';

@injectable()
export class DueMongoRepository
  extends CrudMongoRepository<Due, DueEntity>
  implements IDueRepository
{
  public constructor(
    @inject(DIToken.Logger)
    protected readonly logger: ILogger,
    protected readonly collection: DueCollection,
    protected readonly mapper: DueMapper,
  ) {
    super(collection, mapper, logger);
  }

  public async findPaginated(
    request: FindPaginatedDuesRequest,
  ): Promise<FindPaginatedResponse<Due>> {
    const pipeline: Document[] = [];

    const $match: Document = {
      $expr: {
        $and: [
          {
            $eq: ['$isDeleted', false],
          },
        ],
      },
    };

    pipeline.push({ $match });

    if (request.filterByMember) {
      $match.$expr.$and.push({
        $in: ['$memberId', request.filterByMember],
      });
    }

    if (request.filterByStatus) {
      $match.$expr.$and.push({
        $in: ['$status', request.filterByStatus],
      });
    }

    const entitiesPipeline: Document[] = [
      ...this.getPaginatedPipeline(request),
      {
        $lookup: {
          as: 'member',
          foreignField: '_id',
          from: 'members',
          localField: 'memberId',
          pipeline: [
            {
              $lookup: {
                as: 'user',
                foreignField: '_id',
                from: 'users',
                localField: 'userId',
              },
            },
            {
              $unwind: '$user',
            },
          ],
        },
      },
      {
        $unwind: '$member',
      },
    ];

    return super.findPaginatedPipeline(pipeline, entitiesPipeline);
  }

  public async findPending(request: FindPendingDuesRequest): Promise<Due[]> {
    const query: Mongo.Query<DueEntity> = {
      isDeleted: false,
      memberId: request.memberId,
      status: DueStatusEnum.PENDING,
    };

    const entities = await this.collection.find(query).fetchAsync();

    return entities.map((entity) => this.mapper.toDomain(entity));
  }
}
