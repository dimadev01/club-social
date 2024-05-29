import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import type { Document } from 'mongodb';
import SimpleSchema from 'simpl-schema';
import { container, inject, injectable } from 'tsyringe';

import { EntityNotFoundError } from '@application/errors/entity-not-found.error';
import { ILogger } from '@application/logger/logger.interface';
import { FindPaginatedAggregationResult } from '@application/pagination/find-paginated-aggregation.result';
import { FindPaginatedResponse } from '@application/pagination/find-paginated.response';
import { DIToken } from '@domain/common/tokens.di';
import { DueCategoryEnum } from '@domain/dues/due.enum';
import {
  MemberCategoryEnum,
  MemberStatusEnum,
} from '@domain/members/member.enum';
import { IMemberPort } from '@domain/members/member.port';
import { MemberOld } from '@domain/members/models/member.old';
import { MemberCollection } from '@infra/mongo/collections/member.collection';
import { MemberSchemaOld } from '@infra/mongo/collections/member.collection.old';
import { MongoCollection } from '@infra/mongo/collections/mongo.collection';
import {
  FindPaginatedMemberOld,
  FindPaginatedMembersRequest,
} from '@infra/mongo/repositories/members/member-mongo-repository.types';
import { MongoCrudRepositoryOld } from '@infra/mongo/repositories/mongo-crud.repository';
import { MongoUtilsOld } from '@shared/utils/mongo.utils';

@injectable()
export class MemberRepositoryOld
  extends MongoCrudRepositoryOld<MemberOld>
  implements IMemberPort
{
  public constructor(
    @inject(DIToken.Logger)
    protected readonly _logger: ILogger,
  ) {
    super(_logger);
  }

  public async findAll(): Promise<MemberOld[]> {
    const query: Mongo.Selector<MemberOld> = {
      isDeleted: false,
    };

    return this.getCollection()
      .rawCollection()
      .aggregate<MemberOld>([
        { $match: query },
        ...this._userLookup(),
        { $sort: { 'user.profile.lastName': 1 } },
      ])
      .toArray();
  }

  public async findOneById(id: string): Promise<MemberOld | undefined> {
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

  public async findOneByIdOrThrow(id: string): Promise<MemberOld> {
    const member = await this.findOneById(id);

    if (!member) {
      throw new Error(`Member with id ${id} not found`);
    }

    return member;
  }

  public async findOneByIdOrThrowWithSession(id: string): Promise<MemberOld> {
    const member = await this.findOneById(id);

    if (!member) {
      throw new Error(`Member with id ${id} not found`);
    }

    return member;
  }

  public async findOneByUserId(userId: string): Promise<MemberOld | null> {
    const query: Mongo.Selector<MemberOld> = { isDeleted: false, userId };

    return (await this.getCollection().findOneAsync(query)) ?? null;
  }

  public async findOneByUserIdOrThrow(userId: string): Promise<MemberOld> {
    const member = await this.findOneByUserId(userId);

    if (!member) {
      throw new EntityNotFoundError(MemberOld);
    }

    return member;
  }

  public async findPaginated(
    request: FindPaginatedMembersRequest,
  ): Promise<FindPaginatedResponse<FindPaginatedMemberOld>> {
    const query: Mongo.Selector<MemberOld> = {
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

    const $userLookupPipeline: Mongo.Selector<Meteor.User> = [];

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
          pendingGuest: this._getpendingTotalByCategory(
            DueCategoryEnum.ELECTRICITY,
          ),
          pendingGuest: this._getpendingTotalByCategory(DueCategoryEnum.GUEST),
          pendingMembership: this._getpendingTotalByCategory(
            DueCategoryEnum.MEMBERSHIP,
          ),
        },
      },
      {
        $project: {
          _id: 1,
          category: 1,
          pendingGuest: 1,
          pendingGuest: 1,
          pendingMembership: 1,
          pendingTotal: {
            $sum: ['$pendingGuest', '$pendingGuest', '$pendingMembership'],
          },
          phones: 1,
          status: 1,
          user: 1,
        },
      },
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
      .aggregate<FindPaginatedAggregationResult<FindPaginatedMemberOld>>([
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
            count: MongoUtilsOld.elementAtArray0('$total.count', 0),
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

  public async getLoggedInOrThrow(): Promise<MemberOld> {
    const currentUser = await this.getCurrentUserOrThrow();

    return this.findOneByUserIdOrThrow(currentUser._id);
  }

  protected getCollection(): MongoCollection<MemberOld> {
    return container.resolve(MemberCollection);
  }

  protected getSchema(): SimpleSchema {
    return MemberSchemaOld;
  }

  private _getpendingTotalByCategory(category: DueCategoryEnum) {
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

  private _userLookup(pipeline?: Mongo.Selector<Meteor.User>) {
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
