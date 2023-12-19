import { plainToInstance } from 'class-transformer';
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { inject, injectable } from 'tsyringe';
import { ILogger } from '@application/logger/logger.interface';
import { FindPaginatedAggregationResult } from '@application/pagination/find-paginated-aggregation.result';
import { FindPaginatedResponse } from '@application/pagination/find-paginated.response';
import { DueCollection, DueSchema } from '@domain/dues/due.collection';
import { DueCategoryEnum, DueStatusEnum } from '@domain/dues/due.enum';
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
    const query: Mongo.Query<Due> = {
      isDeleted: request.showDeleted ?? false,
    };

    if (request.from && request.to) {
      query.date = {
        $gte: DateUtils.utc(request.from).startOf('day').toDate(),
        $lte: DateUtils.utc(request.to).endOf('day').toDate(),
      };
    }

    if (request.memberIds.length > 0) {
      query['member._id'] = { $in: request.memberIds };
    }

    if (request.filters.category?.length) {
      query.category = { $in: request.filters.category as DueCategoryEnum[] };
    }

    if (request.filters.status?.length) {
      query.status = { $in: request.filters.status as DueStatusEnum[] };
    }

    const [result] = await this.getCollection()
      .rawCollection()
      .aggregate<FindPaginatedAggregationResult<Due>>([
        { $match: query },
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
