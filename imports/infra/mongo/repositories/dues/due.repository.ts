import { plainToInstance } from 'class-transformer';
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { inject, injectable } from 'tsyringe';
import { ILogger } from '@application/logger/logger.interface';
import { FindPaginatedAggregationResult } from '@application/pagination/find-paginated-aggregation.result';
import { FindPaginatedResponse } from '@application/pagination/find-paginated.response';
import { DueCollection, DueSchema } from '@domain/dues/due.collection';
import { DueStatusEnum } from '@domain/dues/due.enum';
import { IDuePort } from '@domain/dues/due.port';
import { Due } from '@domain/dues/entities/due.entity';
import { DIToken } from '@infra/di/di-tokens';
import { MongoCollection } from '@infra/mongo/common/mongo-collection.base';
import { MongoCrudRepository } from '@infra/mongo/common/mongo-crud.repository';
import {
  FindByIdsRequest,
  FindPaginatedDuesRequest,
  FindPaidRequest,
  FindPendingRequest,
} from '@infra/mongo/repositories/dues/due-repository.types';
import { DateUtils } from '@shared/utils/date.utils';
import { MongoUtils } from '@shared/utils/mongo.utils';

@injectable()
export class DueRepository
  extends MongoCrudRepository<Due>
  implements IDuePort
{
  public constructor(
    @inject(DIToken.Logger)
    protected readonly _logger: ILogger
  ) {
    super(_logger);
  }

  public async findByIds(request: FindByIdsRequest): Promise<Due[]> {
    const query: Mongo.Query<Due> = {
      _id: { $in: request.dueIds },
    };

    return this.getCollection().find(query).fetchAsync();
  }

  public async findPaginated(
    request: FindPaginatedDuesRequest
  ): Promise<FindPaginatedResponse<Due>> {
    const $expr: { $and: Mongo.Query<Due> } = {
      $and: [{ $eq: ['$isDeleted', request.showDeleted ?? false] }],
    };

    if (request.from && request.to) {
      $expr.$and.push({
        $gte: ['$date', DateUtils.utc(request.from).startOf('day').toDate()],
      });

      $expr.$and.push({
        $lte: ['$date', DateUtils.utc(request.to).startOf('day').toDate()],
      });
    }

    if (request.memberIds.length > 0) {
      $expr.$and.push({ $in: ['$member._id', request.memberIds] });
    }

    if (request.filters.category?.length) {
      $expr.$and.push({ $in: ['$category', request.filters.category] });
    }

    if (request.filters.status?.length) {
      $expr.$and.push({ $in: ['$status', request.filters.status] });
    }

    if (request.filters.membershipMonth?.length) {
      const dates: number[] = request.filters.membershipMonth.map(
        (month) => DateUtils.utc(month, 'MMMM').month() + 1
      );

      $expr.$and.push({
        $or: dates.map((date) => ({
          $eq: [{ $month: '$date' }, date],
        })),
      });
    }

    const [result] = await this.getCollection()
      .rawCollection()
      .aggregate<FindPaginatedAggregationResult<Due>>([
        { $match: { $expr } },
        {
          $facet: {
            data: [...this.getPaginatedPipelineQuery(request)],
            total: [{ $count: 'count' }],
          },
        },
        {
          $project: {
            count: MongoUtils.first('$total.count', 0),
            data: 1,
          },
        },
      ])
      .toArray();

    return {
      count: result.count,
      data: result.data.map((item) => plainToInstance(Due, item)),
    };
  }

  public async findPaid(request: FindPaidRequest): Promise<Due[]> {
    const query: Mongo.Query<Due> = {
      status: DueStatusEnum.Paid,
    };

    if (request.memberId) {
      query['member._id'] = request.memberId;
    }

    const options: Mongo.Options<Due> = {
      sort: { date: -1 },
    };

    return this.getCollection().find(query, options).fetchAsync();
  }

  public findPending(request: FindPendingRequest): Promise<Due[]> {
    const query: Mongo.Query<Due> = {
      'member._id': { $in: request.memberIds },
      status: DueStatusEnum.Pending,
    };

    const options: Mongo.Options<Due> = {
      sort: { date: 1 },
    };

    return this.getCollection().find(query, options).fetchAsync();
  }

  protected getCollection(): MongoCollection<Due> {
    return DueCollection;
  }

  protected getSchema(): SimpleSchema {
    return DueSchema;
  }
}
