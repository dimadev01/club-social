import { plainToInstance } from 'class-transformer';
import { Mongo } from 'meteor/mongo';
import { inject, injectable } from 'tsyringe';

import { MongoCollectionOld } from '@adapters/mongo/common/mongo-collection.old';
import {
  FindByIdsRequest,
  FindPaginatedDuesAggregationResult,
  FindPaginatedDuesRequest,
  FindPaginatedDuesResponse,
  FindPaidRequest,
  FindPendingByMemberRequest,
} from '@adapters/repositories/dues/due-repository.types';
import { MongoCrudRepositoryOld } from '@adapters/repositories/mongo-crud.repository';
import { ILogger } from '@domain/common/logger/logger.interface';
import { DIToken } from '@domain/common/tokens.di';
import { DueCollectionOld } from '@domain/dues/due.collection';
import { DueCategoryEnum, DueStatusEnum } from '@domain/dues/due.enum';
import { IDuePortOld } from '@domain/dues/due.port';
import { Due } from '@domain/dues/entities/due.entity';
import { DateUtils } from '@shared/utils/date.utils';
import { MongoUtilsOld } from '@shared/utils/mongo.utils';

@injectable()
export class DueRepository
  extends MongoCrudRepositoryOld<Due>
  implements IDuePortOld
{
  public constructor(
    @inject(DIToken.Logger)
    protected readonly _logger: ILogger,
  ) {
    super(_logger);
  }

  public async findByIds2(request: FindByIdsRequest): Promise<Due[]> {
    const query: Mongo.Selector<Due> = {
      _id: { $in: request.dueIds },
    };

    return this.getCollection().find(query).fetchAsync();
  }

  public async findPaginated(
    request: FindPaginatedDuesRequest,
  ): Promise<FindPaginatedDuesResponse> {
    const query: Mongo.Selector<Due> = {
      $expr: { $and: [{ $eq: ['$isDeleted', request.showDeleted ?? false] }] },
    };

    if (request.from && request.to) {
      query.$expr.$and.push({
        $gte: ['$date', DateUtils.utc(request.from).startOf('day').toDate()],
      });

      query.$expr.$and.push({
        $lte: ['$date', DateUtils.utc(request.to).startOf('day').toDate()],
      });
    }

    if (request.memberIds.length > 0) {
      query.$expr.$and.push({ $in: ['$member._id', request.memberIds] });
    }

    if (request.filters.category?.length) {
      query.$expr.$and.push({ $in: ['$category', request.filters.category] });
    }

    if (request.filters.status?.length) {
      query.$expr.$and.push({ $in: ['$status', request.filters.status] });
    }

    if (request.filters.membershipMonth?.length) {
      const dates: number[] = request.filters.membershipMonth.map(
        (month) => DateUtils.utc(month, 'MMMM').month() + 1,
      );

      query.$expr.$and.push({
        $eq: ['$category', DueCategoryEnum.MEMBERSHIP],
      });

      query.$expr.$and.push({
        $or: dates.map((date) => ({
          $eq: [{ $month: '$date' }, date],
        })),
      });
    }

    const $facet: Record<string, unknown> = {
      data: [...this.getPaginatedPipelineQuery(request)],
      totals: [
        {
          $group: {
            _id: null,
            dues: { $sum: '$amount' },
            payments: {
              $sum: {
                $reduce: {
                  in: { $add: ['$$value', '$$this.amount'] },
                  initialValue: 0,
                  input: '$payments',
                },
              },
            },
          },
        },
        {
          $addFields: {
            balance: {
              $subtract: ['$payments', '$dues'],
            },
          },
        },
      ],
    };

    const $project: Record<string, number | object> = {
      balance: MongoUtilsOld.first('$totals.balance', 0),
      data: 1,
      totalDues: MongoUtilsOld.first('$totals.dues', 0),
      totalPayments: MongoUtilsOld.first('$totals.payments', 0),
    };

    const hasFilters = query.$expr.$and.length > 1;

    if (hasFilters) {
      $facet.total = [{ $count: 'count' }];

      $project.count = MongoUtilsOld.first('$total.count', 0);
    }

    const [result] = await this.getCollection()
      .rawCollection()
      .aggregate<FindPaginatedDuesAggregationResult>([
        { $match: query },
        { $facet },
        { $project },
      ])
      .toArray();

    return {
      balance: result.balance,
      count: await this.getAggregationCount(hasFilters, result.count),
      data: result.data.map((item) => plainToInstance(Due, item)),
      totalDues: result.totalDues,
      totalPayments: result.totalPayments,
    };
  }

  public async findPaid(request: FindPaidRequest): Promise<Due[]> {
    const query: Mongo.Selector<Due> = {
      status: DueStatusEnum.PAID,
    };

    if (request.memberId) {
      query['member._id'] = request.memberId;
    }

    const options: Mongo.Options<Due> = {
      sort: { date: -1 },
    };

    return this.getCollection().find(query, options).fetchAsync();
  }

  public findPendingByMember(
    request: FindPendingByMemberRequest,
  ): Promise<Due[]> {
    const query: Mongo.Selector<Due> = {
      isDeleted: false,
      memberId: request.memberId,
      status: { $in: [DueStatusEnum.PENDING, DueStatusEnum.PARTIALLY_PAID] },
    };

    const options: Mongo.Options<Due> = {
      // eslint-disable-next-line sort-keys-fix/sort-keys-fix
      sort: { date: 1, category: -1 },
    };

    return this.getCollection().find(query, options).fetchAsync();
  }

  protected getCollection(): MongoCollectionOld<Due> {
    return DueCollectionOld;
  }
}
