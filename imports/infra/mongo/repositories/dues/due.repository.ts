import { plainToInstance } from 'class-transformer';
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { inject, injectable } from 'tsyringe';
import { ILogger } from '@application/logger/logger.interface';
import { DueCollection, DueSchema } from '@domain/dues/due.collection';
import { DueCategoryEnum, DueStatusEnum } from '@domain/dues/due.enum';
import { IDuePort } from '@domain/dues/due.port';
import { Due } from '@domain/dues/entities/due.entity';
import { DIToken } from '@infra/di/di-tokens';
import { MongoCollection } from '@infra/mongo/common/mongo-collection.base';
import { MongoCrudRepository } from '@infra/mongo/common/mongo-crud.repository';
import {
  FindByIdsRequest,
  FindPaginatedDuesAggregationResult,
  FindPaginatedDuesRequest,
  FindPaginatedDuesResponse,
  FindPaidRequest,
  FindPendingByMemberRequest,
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
    protected readonly _logger: ILogger,
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
    request: FindPaginatedDuesRequest,
  ): Promise<FindPaginatedDuesResponse> {
    const query: Mongo.Query<Due> = {
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
        $eq: ['$category', DueCategoryEnum.Membership],
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
      balance: MongoUtils.first('$totals.balance', 0),
      data: 1,
      totalDues: MongoUtils.first('$totals.dues', 0),
      totalPayments: MongoUtils.first('$totals.payments', 0),
    };

    const hasFilters = query.$expr.$and.length > 1;

    if (hasFilters) {
      $facet.total = [{ $count: 'count' }];

      $project.count = MongoUtils.first('$total.count', 0);
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

  public findPendingByMember(
    request: FindPendingByMemberRequest,
  ): Promise<Due[]> {
    const query: Mongo.Query<Due> = {
      isDeleted: false,
      memberId: request.memberId,
      status: { $in: [DueStatusEnum.Pending, DueStatusEnum.PartiallyPaid] },
    };

    const options: Mongo.Options<Due> = {
      // eslint-disable-next-line sort-keys-fix/sort-keys-fix
      sort: { date: 1, category: -1 },
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
