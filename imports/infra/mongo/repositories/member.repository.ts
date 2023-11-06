import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import type { Document } from 'mongodb';
import SimpleSchema from 'simpl-schema';
import { inject, injectable } from 'tsyringe';
import { ILogger } from '@application/logger/logger.interface';
import { FindPaginatedAggregationResult } from '@application/pagination/find-paginated-aggregation.result';
import { FindPaginatedResponse } from '@application/pagination/find-paginated.response';
import { CategoryEnum } from '@domain/categories/category.enum';
import { Member } from '@domain/members/entities/member.entity';
import { IMemberPort } from '@domain/members/member.port';
import { DIToken } from '@infra/di/di-tokens';
import {
  MembersCollection,
  MembersSchema,
} from '@infra/mongo/collections/member.collection';
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
      facetData.push(...this.getPaginatedPipelineQuery(request));
    }

    facetData.push(
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
      }
    );

    if (request.sortField !== 'user.profile.lastName') {
      facetData.push(...this.getPaginatedPipelineQuery(request));
    }

    const [{ data, total }] = await this.getCollection()
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

  protected getSchema(): SimpleSchema {
    return MembersSchema;
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
