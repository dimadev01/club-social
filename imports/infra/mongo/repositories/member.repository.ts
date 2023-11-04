import { Mongo } from 'meteor/mongo';
import { inject, injectable } from 'tsyringe';
import { ILogger } from '@application/logger/logger.interface';
import { FindPaginatedAggregationResult } from '@application/pagination/find-paginated-aggregation.result';
import { FindPaginatedResponse } from '@application/pagination/find-paginated.response';
import { CategoryEnum } from '@domain/categories/category.enum';
import { Member } from '@domain/members/entities/member.entity';
import { MembersCollection } from '@domain/members/member.collection';
import { IMemberPort } from '@domain/members/member.port';
import { DIToken } from '@infra/di/di-tokens';
import { MongoCollection } from '@infra/mongo/common/mongo-collection.base';
import { MongoCrudRepository } from '@infra/mongo/common/mongo-crud.repository';
import {
  FindPaginatedMember,
  FindPaginatedMembersRequest,
} from '@infra/mongo/repositories/member-repository.types';

@injectable()
export class MemberRepository
  extends MongoCrudRepository<Member>
  implements IMemberPort
{
  public constructor(
    @inject(DIToken.Logger)
    protected readonly _logger: ILogger
  ) {
    super(_logger);
  }

  public async findPaginated(
    request: FindPaginatedMembersRequest
  ): Promise<FindPaginatedResponse<FindPaginatedMember>> {
    const query: Mongo.Query<Member> = {
      isDeleted: false,
    };

    if (request.filters.status?.length) {
      query.status = { $in: request.filters.status };
    }

    if (request.filters.category?.length) {
      query.category = { $in: request.filters.category };
    }

    const $userLookupPipeline: Mongo.Query<Meteor.User> = [];

    if (request.search) {
      $userLookupPipeline.push({
        $match: {
          $or: [
            this.createSearchMatch('profile.firstName', request.search),
            this.createSearchMatch('profile.lastName', request.search),
            this.createSearchMatch('emails.address', request.search),
          ],
        },
      });
    }

    const [{ data, total }] = await this.getCollection()
      .rawCollection()
      .aggregate<FindPaginatedAggregationResult<FindPaginatedMember>>([
        { $match: query },
        {
          $lookup: {
            as: 'user',
            foreignField: '_id',
            from: 'users',
            localField: 'userId',
            pipeline: $userLookupPipeline,
          },
        },
        {
          $unwind: '$user',
        },
        {
          $facet: {
            data: [
              ...this.getPaginatedPipeline(request),
              {
                $lookup: {
                  as: 'movements',
                  foreignField: 'memberId',
                  from: 'movements',
                  localField: '_id',
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $eq: ['$isDeleted', false],
                        },
                      },
                    },
                  ],
                },
              },
              {
                $addFields: {
                  electricityBalance: this._getCategoryBalance(
                    CategoryEnum.ElectricityIncome,
                    CategoryEnum.ElectricityDebt
                  ),
                  guestBalance: this._getCategoryBalance(
                    CategoryEnum.GuestIncome,
                    CategoryEnum.GuestDebt
                  ),
                  membershipBalance: this._getCategoryBalance(
                    CategoryEnum.MembershipIncome,
                    CategoryEnum.MembershipDebt
                  ),
                },
              },
              {
                $project: {
                  _id: 1,
                  category: 1,
                  electricityBalance: 1,
                  guestBalance: 1,
                  membershipBalance: 1,
                  status: 1,
                  user: 1,
                },
              },
            ],
            total: [{ $count: 'count' }],
          },
        },
      ])
      .toArray();

    return {
      count: total.length ? total[0].count : 0,
      data,
    };
  }

  protected getCollection(): MongoCollection<Member> {
    return MembersCollection;
  }

  private _getCategoryBalance(
    categoryIncome: CategoryEnum,
    categoryDebt: CategoryEnum
  ) {
    const createReduce = (category: CategoryEnum) => ({
      $reduce: {
        in: {
          $add: [
            '$$value',
            {
              $sum: {
                $cond: [
                  {
                    $eq: ['$$this.category', category],
                  },
                  '$$this.amount',
                  0,
                ],
              },
            },
          ],
        },
        initialValue: 0,
        input: '$movements',
      },
    });

    return {
      $subtract: [createReduce(categoryIncome), createReduce(categoryDebt)],
    };
  }
}
