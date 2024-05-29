import type { Document } from 'mongodb';
import { inject, injectable } from 'tsyringe';

import { ILogger } from '@application/logger/logger.interface';
import { FindPaginatedResponse } from '@domain/common/repositories/queryable-grid-repository.interface';
import { DIToken } from '@domain/common/tokens.di';
import { DueCategoryEnum, DueStatusEnum } from '@domain/dues/due.enum';
import {
  FindPaginatedMembersRequest,
  IMemberRepository,
  MemberBalance,
} from '@domain/members/member-repository.interface';
import { MemberModel } from '@domain/members/models/member.model';
import { MemberMapper } from '@infra/mappers/member.mapper';
import { UserMapper } from '@infra/mappers/user.mapper';
import { MemberCollection } from '@infra/mongo/collections/member.collection';
import { PaginatedAggregationResult } from '@infra/mongo/common/paginated-aggregation.interface';
import { MemberEntity } from '@infra/mongo/entities/members/member.entity';
import { MongoUtils } from '@infra/mongo/mongo.utils';
import { CrudMongoRepository } from '@infra/mongo/repositories/common/crud-mongo.repository';
import { PaginatedMemberEntity } from '@infra/mongo/repositories/members/member-mongo-repository.types';

@injectable()
export class MemberMongoRepository
  extends CrudMongoRepository<MemberModel, MemberEntity>
  implements IMemberRepository
{
  public constructor(
    @inject(MemberCollection)
    protected readonly collection: MemberCollection,
    @inject(MemberMapper)
    protected readonly memberMapper: MemberMapper,
    @inject(UserMapper)
    protected readonly userMapper: UserMapper,
    @inject(DIToken.Logger)
    protected readonly logger: ILogger,
  ) {
    super(collection, memberMapper, logger);
  }

  public async getBalances(memberIds: string[]): Promise<MemberBalance[]> {
    function getGroupByCategoryDocument(category: DueCategoryEnum): Document {
      return {
        $sum: {
          $cond: [{ $eq: ['$due.category', category] }, '$due.amount', 0],
        },
      };
    }

    const pipeline: Document[] = [
      {
        $project: {
          _id: 1,
        },
      },
      {
        $match: {
          $expr: {
            $in: ['$_id', memberIds],
          },
        },
      },
      {
        $lookup: {
          as: 'due',
          foreignField: 'memberId',
          from: 'dues',
          localField: '_id',
          pipeline: [
            {
              $project: {
                amount: 1,
                category: 1,
                isDeleted: 1,
                status: 1,
              },
            },
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$isDeleted', false] },
                    { $eq: ['$status', DueStatusEnum.PENDING] },
                  ],
                },
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: '$due',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: '$_id',
          electricity: getGroupByCategoryDocument(DueCategoryEnum.ELECTRICITY),
          guest: getGroupByCategoryDocument(DueCategoryEnum.GUEST),
          membership: getGroupByCategoryDocument(DueCategoryEnum.MEMBERSHIP),
        },
      },
      {
        $addFields: {
          total: {
            $add: ['$electricity', '$membership', '$guest'],
          },
        },
      },
    ];

    return this.collection
      .rawCollection()
      .aggregate<MemberBalance>(pipeline)
      .toArray();
  }

  public async findByDocument(documentID: string): Promise<MemberModel | null> {
    const entity = await this.collection.findOneAsync({
      documentID,
      isDeleted: false,
    });

    if (!entity) {
      return null;
    }

    return this.memberMapper.toModel(entity);
  }

  public async findPaginated(
    request: FindPaginatedMembersRequest,
  ): Promise<FindPaginatedResponse<MemberModel>> {
    const pipeline: Document[] = [];

    const $match: Document = {
      $expr: { $and: [{ $eq: ['$isDeleted', false] }] },
    };

    if (request.filters?.category) {
      $match.$expr.$and.push({ $in: ['$category', request.filters.category] });
    }

    if (request.filters?.status) {
      $match.$expr.$and.push({ $in: ['$status', request.filters.status] });
    }

    pipeline.push({ $match });

    pipeline.push({
      $lookup: {
        as: 'user',
        foreignField: '_id',
        from: 'users',
        localField: 'userId',
        pipeline: [],
      },
    });

    if (request.sorter?.name) {
      request.sorter['user.profile.firstName'] = request.sorter.name;

      delete request.sorter.name;
    }

    function getPendingByCategoryDocument(category: DueCategoryEnum): Document {
      return {
        $reduce: {
          in: {
            $cond: {
              else: '$$value',
              if: { $eq: ['$$this.category', category] },
              then: { $add: ['$$value', '$$this.amount'] },
            },
          },
          initialValue: 0,
          input: '$dues',
        },
      };
    }

    if (
      request.sorter?.pendingElectricity ||
      request.sorter?.pendingMembership ||
      request.sorter?.pendingGuest ||
      request.sorter?.pendingTotal
    ) {
      pipeline.push({
        $lookup: {
          as: 'dues',
          foreignField: 'memberId',
          from: 'dues',
          localField: '_id',
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$isDeleted', false] },
                    { $eq: ['$status', DueStatusEnum.PENDING] },
                  ],
                },
              },
            },
          ],
        },
      });

      if (request.sorter.pendingElectricity) {
        pipeline.push({
          $addFields: {
            pendingElectricity: getPendingByCategoryDocument(
              DueCategoryEnum.ELECTRICITY,
            ),
          },
        });
      } else if (request.sorter.pendingMembership) {
        pipeline.push({
          $addFields: {
            pendingMembership: getPendingByCategoryDocument(
              DueCategoryEnum.MEMBERSHIP,
            ),
          },
        });
      } else if (request.sorter.pendingGuest) {
        pipeline.push({
          $addFields: {
            pendingGuest: getPendingByCategoryDocument(DueCategoryEnum.GUEST),
          },
        });
      } else if (request.sorter.pendingTotal) {
        pipeline.push(
          {
            $addFields: {
              pendingElectricity: getPendingByCategoryDocument(
                DueCategoryEnum.ELECTRICITY,
              ),
              pendingGuest: getPendingByCategoryDocument(DueCategoryEnum.GUEST),
              pendingMembership: getPendingByCategoryDocument(
                DueCategoryEnum.MEMBERSHIP,
              ),
            },
          },
          {
            $addFields: {
              pendingTotal: {
                $add: [
                  '$pendingElectricity',
                  '$pendingGuest',
                  '$pendingMembership',
                ],
              },
            },
          },
        );
      }
    }

    pipeline.push(
      {
        $unwind: '$user',
      },
      {
        $facet: {
          entities: [
            ...this.getPaginatedPipeline(request),
            {
              $lookup: {
                as: 'user',
                foreignField: '_id',
                from: 'users',
                localField: 'userId',
              },
            },
            { $unwind: '$user' },
          ],
          totalCount: [{ $count: 'count' }],
        },
      },
      {
        $project: {
          entities: 1,
          totalCount: MongoUtils.first('$totalCount.count', 0),
        },
      },
    );

    const [{ entities, totalCount }] = await this.collection
      .rawCollection()
      .aggregate<PaginatedAggregationResult<PaginatedMemberEntity>>(pipeline)
      .toArray();

    const items = entities.map((entity) => {
      const model = this.memberMapper.toModel(entity);

      model.user = this.userMapper.toModel(entity.user);

      return model;
    });

    return { items, totalCount };
  }
}
