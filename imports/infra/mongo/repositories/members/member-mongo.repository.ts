import type { Document } from 'mongodb';
import { inject, injectable } from 'tsyringe';

import { ILogger } from '@application/logger/logger.interface';
import { FindPaginatedResponse } from '@domain/common/repositories/queryable-grid-repository.interface';
import { DIToken } from '@domain/common/tokens.di';
import { DueCategoryEnum, DueStatusEnum } from '@domain/dues/due.enum';
import {
  FindMembersRequest,
  GetMembersGridRequest,
  IMemberRepository,
  MemberBalance,
} from '@domain/members/member-repository.interface';
import { MemberModel } from '@domain/members/models/member.model';
import { MemberMapper } from '@infra/mappers/member.mapper';
import { MemberAuditCollection } from '@infra/mongo/collections/member-audit.collection';
import { MemberCollection } from '@infra/mongo/collections/member.collection';
import { PaginatedAggregationResult } from '@infra/mongo/common/paginated-aggregation.interface';
import { MemberAuditEntity } from '@infra/mongo/entities/members/member-audit.entity';
import { MemberEntity } from '@infra/mongo/entities/members/member.entity';
import { MongoUtils } from '@infra/mongo/mongo.utils';
import { CrudMongoAuditRepository } from '@infra/mongo/repositories/common/crud-mongo-audit.repository';

@injectable()
export class MemberMongoRepository
  extends CrudMongoAuditRepository<MemberModel, MemberEntity, MemberAuditEntity>
  implements IMemberRepository
{
  public constructor(
    @inject(MemberCollection)
    protected readonly collection: MemberCollection,
    @inject(MemberAuditCollection)
    protected readonly historicalCollection: MemberAuditCollection,
    @inject(MemberMapper)
    protected readonly mapper: MemberMapper,
    @inject(DIToken.Logger)
    protected readonly logger: ILogger,
  ) {
    super(collection, mapper, logger, historicalCollection);
  }

  public async find(request: FindMembersRequest): Promise<MemberModel[]> {
    const pipeline: Document[] = [];

    const $match: Document = {
      $expr: { $and: [{ $eq: ['$isDeleted', false] }] },
    };

    if (request.status) {
      $match.$expr.$and.push({ $in: ['$status', request.status] });
    }

    if (request.category) {
      $match.$expr.$and.push({ $in: ['$category', request.category] });
    }

    pipeline.push(
      { $match },
      {
        $lookup: {
          as: 'user',
          foreignField: '_id',
          from: 'users',
          localField: 'userId',
        },
      },
      { $unwind: '$user' },
      {
        $sort: {
          'user.profile.firstName': 1,
          'user.profile.lastName': 1,
        },
      },
    );

    const entities = await this.collection
      .rawCollection()
      .aggregate<MemberEntity>(pipeline)
      .toArray();

    return entities.map((entity) => this.mapper.toModel(entity));
  }

  public async findByDocument(documentID: string): Promise<MemberModel | null> {
    const entity = await this.collection.findOneAsync({
      documentID,
      isDeleted: false,
    });

    if (!entity) {
      return null;
    }

    return this.mapper.toModel(entity);
  }

  public async findPaginated(
    request: GetMembersGridRequest,
  ): Promise<FindPaginatedResponse<MemberModel>> {
    const pipeline: Document[] = this._getPipelineToExportOrGrid(
      request,
      'paginated',
    );

    const [{ entities, totalCount }] = await this.collection
      .rawCollection()
      .aggregate<PaginatedAggregationResult<MemberEntity>>(pipeline)
      .toArray();

    const items = entities.map((entity) => this.mapper.toModel(entity));

    return { items, totalCount };
  }

  public async findToExport(
    request: GetMembersGridRequest,
  ): Promise<MemberModel[]> {
    const pipeline = this._getPipelineToExportOrGrid(request, 'export');

    const entities = await this.collection
      .rawCollection()
      .aggregate<MemberEntity>(pipeline)
      .toArray();

    return entities.map((entity) => this.mapper.toModel(entity));
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

  private _getPipelineToExportOrGrid(
    request: GetMembersGridRequest,
    type: 'export' | 'paginated',
  ): Document[] {
    const pipeline: Document[] = [];

    const $match: Document = {
      $expr: { $and: [{ $eq: ['$isDeleted', false] }] },
    };

    if (request.categoryFilter) {
      $match.$expr.$and.push({ $in: ['$category', request.categoryFilter] });
    }

    if (request.statusFilter) {
      $match.$expr.$and.push({ $in: ['$status', request.statusFilter] });
    }

    if (request.idFilter) {
      $match.$expr.$and.push({ $in: ['$_id', request.idFilter] });
    }

    if (request.sorter?._id) {
      request.sorter['user.profile.firstName'] = request.sorter._id;

      request.sorter['user.profile.lastName'] = request.sorter._id;

      delete request.sorter._id;
    }

    pipeline.push({ $match });

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
      request.sorter?.pendingTotal ||
      request.debtStatusFilter
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
      } else if (request.sorter.pendingTotal || request.debtStatusFilter) {
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

        if (request.debtStatusFilter?.includes('true')) {
          pipeline.push({
            $match: {
              $expr: {
                $gt: ['$pendingTotal', 0],
              },
            },
          });
        } else if (request.debtStatusFilter?.includes('false')) {
          pipeline.push({
            $match: {
              $expr: {
                $eq: ['$pendingTotal', 0],
              },
            },
          });
        }
      }
    }

    const userLookUpAndSorter = [
      {
        $lookup: {
          as: 'user',
          foreignField: '_id',
          from: 'users',
          localField: 'userId',
        },
      },
      { $unwind: '$user' },
      this.getPaginatedSorterStage(request.sorter),
    ];

    if (type === 'export') {
      pipeline.push(...userLookUpAndSorter);

      return pipeline;
    }

    pipeline.push(
      {
        $facet: {
          entities: [
            ...userLookUpAndSorter,
            ...this.getPaginatedStages(request.page, request.limit),
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

    return pipeline;
  }
}
