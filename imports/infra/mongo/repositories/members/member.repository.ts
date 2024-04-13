import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import type { Document } from 'mongodb';
import SimpleSchema from 'simpl-schema';
import { inject, injectable } from 'tsyringe';
import { EntityNotFoundError } from '@application/errors/entity-not-found.error';
import { ILogger } from '@application/logger/logger.interface';
import { FindPaginatedAggregationResult } from '@application/pagination/find-paginated-aggregation.result';
import { FindPaginatedResponse } from '@application/pagination/find-paginated.response';
import { DueCategoryEnum } from '@domain/dues/due.enum';
import { Member } from '@domain/members/entities/member.entity';
import {
  MemberCategoryEnum,
  MemberStatusEnum,
} from '@domain/members/member.enum';
import { IMemberPort } from '@domain/members/member.port';
import { DIToken } from '@infra/di/di-tokens';
import {
  MemberCollection,
  MemberSchema,
} from '@infra/mongo/collections/member.collection';
import { MongoCollection } from '@infra/mongo/common/mongo-collection.base';
import { MongoCrudRepository } from '@infra/mongo/common/mongo-crud.repository';
import {
  FindPaginatedMember,
  FindPaginatedMembersRequest,
} from '@infra/mongo/repositories/members/member-repository.types';
import { MongoUtils } from '@shared/utils/mongo.utils';

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

  public async findAll(): Promise<Member[]> {
    const query: Mongo.Query<Member> = {
      isDeleted: false,
    };

    return this.getCollection()
      .rawCollection()
      .aggregate<Member>([
        { $match: query },
        ...this._userLookup(),
        { $sort: { 'user.profile.lastName': 1 } },
      ])
      .toArray();
  }

  public async findOneById(id: string): Promise<Member | undefined> {
    const member = await super.findOneById(id);

    if (!member) {
      return undefined;
    }

    const user = await Meteor.users.findOneAsync(member.userId);

    if (!user) {
      return undefined;
    }

    member.user = user;

    return member;
  }

  public async findOneByIdOrThrow(id: string): Promise<Member> {
    const member = await this.findOneById(id);

    if (!member) {
      throw new Error(`Member with id ${id} not found`);
    }

    return member;
  }

  public async findOneByIdOrThrowWithSession(id: string): Promise<Member> {
    const member = await this.findOneById(id);

    if (!member) {
      throw new Error(`Member with id ${id} not found`);
    }

    return member;
  }

  public async findOneByUserId(userId: string): Promise<Member | null> {
    const query: Mongo.Query<Member> = { isDeleted: false, userId };

    return (await this.getCollection().findOneAsync(query)) ?? null;
  }

  public async findOneByUserIdOrThrow(userId: string): Promise<Member> {
    const member = await this.findOneByUserId(userId);

    if (!member) {
      throw new EntityNotFoundError(Member);
    }

    return member;
  }

  public async findPaginated(
    request: FindPaginatedMembersRequest
  ): Promise<FindPaginatedResponse<FindPaginatedMember>> {
    const query: Mongo.Query<Member> = {
      isDeleted: false,
    };

    if (request.filters.status?.length) {
      query.status = { $in: request.filters.status as MemberStatusEnum[] };
    }

    if (request.filters.category?.length) {
      query.category = {
        $in: request.filters.category as MemberCategoryEnum[],
      };
    }

    if (request.sortField === 'name') {
      request.sortField = 'user.profile.lastName';
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

    const facetData: Document[] = [];

    if (request.sortField === 'user.profile.lastName') {
      if (request.findForCsv) {
        facetData.push({
          $sort: {
            [request.sortField]: this._getSorterValue(request.sortOrder),
          },
        });
      } else {
        facetData.push(...this.getPaginatedPipelineQuery(request));
      }
    }

    facetData.push(
      {
        $lookup: {
          as: 'dues',
          foreignField: 'member._id',
          from: 'dues',
          localField: '_id',
          pipeline: [
            { $match: { $expr: { $eq: ['$isDeleted', false] } } },
            { $project: { amount: 1, category: 1, 'payments.amount': 1 } },
          ],
        },
      },
      {
        $addFields: {
          electricityBalance: this._getTotalBalanceByCategory(
            DueCategoryEnum.Electricity
          ),
          guestBalance: this._getTotalBalanceByCategory(DueCategoryEnum.Guest),
          membershipBalance: this._getTotalBalanceByCategory(
            DueCategoryEnum.Membership
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
          phones: 1,
          status: 1,
          totalBalance: {
            $sum: [
              '$electricityBalance',
              '$guestBalance',
              '$membershipBalance',
            ],
          },
          user: 1,
        },
      }
    );

    if (request.sortField !== 'user.profile.lastName') {
      if (request.findForCsv) {
        facetData.push({
          $sort: {
            [request.sortField]: this._getSorterValue(request.sortOrder),
          },
        });
      } else {
        facetData.push(...this.getPaginatedPipelineQuery(request));
      }
    }

    const [{ data, count }] = await this.getCollection()
      .rawCollection()
      .aggregate<FindPaginatedAggregationResult<FindPaginatedMember>>([
        { $match: query },
        ...this._userLookup($userLookupPipeline),
        {
          $facet: {
            data: facetData,
            total: [{ $count: 'count' }],
          },
        },
        {
          $project: {
            count: MongoUtils.elementAtArray0('$total.count', 0),
            data: 1,
          },
        },
      ])
      .toArray();

    return {
      count,
      data,
    };
  }

  public async getLoggedInOrThrow(): Promise<Member> {
    const currentUser = await this.getCurrentUserOrThrow();

    return this.findOneByUserIdOrThrow(currentUser._id);
  }

  protected getCollection(): MongoCollection<Member> {
    return MemberCollection;
  }

  protected getSchema(): SimpleSchema {
    return MemberSchema;
  }

  private _getTotalBalanceByCategory(category: DueCategoryEnum) {
    return {
      $reduce: {
        in: { $add: ['$$value', '$$this'] },
        initialValue: 0,
        input: {
          $map: {
            as: 'due',
            in: {
              $subtract: [
                {
                  $ifNull: [
                    {
                      $reduce: {
                        in: {
                          $add: ['$$value', '$$this.amount'],
                        },
                        initialValue: 0,
                        input: '$$due.payments',
                      },
                    },
                    0,
                  ],
                },
                '$$due.amount',
              ],
            },
            input: {
              $filter: {
                as: 'due',
                cond: {
                  $eq: ['$$due.category', category],
                },
                input: '$dues',
              },
            },
          },
        },
      },
    };
  }

  private _userLookup(pipeline?: Mongo.Query<Meteor.User>) {
    return [
      {
        $lookup: {
          as: 'user',
          foreignField: '_id',
          from: 'users',
          localField: 'userId',
          pipeline,
        },
      },
      {
        $unwind: '$user',
      },
    ];
  }
}
