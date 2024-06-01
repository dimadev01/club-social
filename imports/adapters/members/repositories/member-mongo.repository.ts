import type { Document } from 'mongodb';
import { inject, injectable } from 'tsyringe';

import { MemberAuditEntity } from '@adapters/members/entities/member-audit.entity';
import { MemberEntity } from '@adapters/members/entities/member.entity';
import { MemberMapper } from '@adapters/members/mappers/member.mapper';
import { FindPaginatedMembersAggregationResult } from '@adapters/members/repositories/member-mongo-repository.types';
import { MemberAuditableCollection } from '@adapters/mongo/collections/member-auditable.collection';
import { MongoCollection } from '@adapters/mongo/collections/mongo.collection';
import { MongoUtils } from '@adapters/mongo/mongo.utils';
import { CrudMongoAuditableRepository } from '@adapters/repositories/crud-mongo-auditable.repository';
import { ILogger } from '@application/logger/logger.interface';
import { DIToken } from '@domain/common/tokens.di';
import { DueCategoryEnum, DueStatusEnum } from '@domain/dues/due.enum';
import { MemberModel } from '@domain/members/models/member.model';
import {
  FindMembersRequest,
  FindPaginatedMembersRequest,
  FindPaginatedMembersResponse,
  MemberBalance,
} from '@domain/members/repositories/member-repository.types';
import { IMemberRepository } from '@domain/members/repositories/member.repository';

@injectable()
export class MemberMongoRepository
  extends CrudMongoAuditableRepository<
    MemberModel,
    MemberEntity,
    MemberAuditEntity
  >
  implements IMemberRepository
{
  public constructor(
    @inject(DIToken.MemberMongoCollection)
    protected readonly collection: MongoCollection<MemberEntity>,
    protected readonly auditableCollection: MemberAuditableCollection,
    protected readonly mapper: MemberMapper,
    @inject(DIToken.Logger)
    protected readonly logger: ILogger,
  ) {
    super(collection, mapper, logger, auditableCollection);
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
    request: FindPaginatedMembersRequest,
  ): Promise<FindPaginatedMembersResponse<MemberModel>> {
    const pipeline = this._getPipelineToExportOrGrid(request);

    pipeline.push(
      {
        $facet: {
          entities: [
            {
              $lookup: {
                as: 'user',
                foreignField: '_id',
                from: 'users',
                localField: 'userId',
              },
            },
            { $unwind: '$user' },
            ...this.getPaginatedPipeline(request),
          ],
          totalCount: [{ $count: 'count' }],
          totals: [
            {
              $group: {
                _id: null,
                electricity: { $sum: '$pendingElectricity' },
                guest: { $sum: '$pendingGuest' },
                membership: { $sum: '$pendingMembership' },
                total: { $sum: '$pendingTotal' },
              },
            },
            {
              $project: { _id: 0 },
            },
          ],
        },
      },
      {
        $project: {
          entities: 1,
          totalCount: MongoUtils.first('$totalCount.count', 0),
          totals: MongoUtils.first('$totals', undefined),
        },
      },
    );

    const [{ entities, totalCount, totals }] = await this.collection
      .rawCollection()
      .aggregate<FindPaginatedMembersAggregationResult>(pipeline)
      .toArray();

    return {
      items: entities.map((entity) => this.mapper.toModel(entity)),
      totalCount,
      totals,
    };
  }

  public async findToExport(
    request: FindPaginatedMembersRequest,
  ): Promise<MemberModel[]> {
    const pipeline = this._getPipelineToExportOrGrid(request);

    pipeline.push(
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
    );

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
    request: FindPaginatedMembersRequest,
  ): Document[] {
    const pipeline: Document[] = [];

    const $match: Document = {
      $expr: { $and: [{ $eq: ['$isDeleted', false] }] },
    };

    if (request.filterByCategory) {
      $match.$expr.$and.push({ $in: ['$category', request.filterByCategory] });
    }

    if (request.filterByStatus) {
      $match.$expr.$and.push({ $in: ['$status', request.filterByStatus] });
    }

    if (request.filterById) {
      $match.$expr.$and.push({ $in: ['$_id', request.filterById] });
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

    // if (
    //   request.sorter?.pendingElectricity ||
    //   request.sorter?.pendingMembership ||
    //   request.sorter?.pendingGuest ||
    //   request.sorter?.pendingTotal ||
    //   request.filterByDebtStatus
    // ) {
    //   pipeline.push({
    //     $lookup: {
    //       as: 'dues',
    //       foreignField: 'memberId',
    //       from: 'dues',
    //       localField: '_id',
    //       pipeline: [
    //         {
    //           $match: {
    //             $expr: {
    //               $and: [
    //                 { $eq: ['$isDeleted', false] },
    //                 { $eq: ['$status', DueStatusEnum.PENDING] },
    //               ],
    //             },
    //           },
    //         },
    //       ],
    //     },
    //   });

    //   if (request.sorter.pendingElectricity) {
    //     pipeline.push({
    //       $addFields: {
    //         pendingElectricity: getPendingByCategoryDocument(
    //           DueCategoryEnum.ELECTRICITY,
    //         ),
    //       },
    //     });
    //   } else if (request.sorter.pendingMembership) {
    //     pipeline.push({
    //       $addFields: {
    //         pendingMembership: getPendingByCategoryDocument(
    //           DueCategoryEnum.MEMBERSHIP,
    //         ),
    //       },
    //     });
    //   } else if (request.sorter.pendingGuest) {
    //     pipeline.push({
    //       $addFields: {
    //         pendingGuest: getPendingByCategoryDocument(DueCategoryEnum.GUEST),
    //       },
    //     });
    //   } else if (request.sorter.pendingTotal || request.filterByDebtStatus) {
    //     pipeline.push(
    //       {
    //         $addFields: {
    //           pendingElectricity: getPendingByCategoryDocument(
    //             DueCategoryEnum.ELECTRICITY,
    //           ),
    //           pendingGuest: getPendingByCategoryDocument(DueCategoryEnum.GUEST),
    //           pendingMembership: getPendingByCategoryDocument(
    //             DueCategoryEnum.MEMBERSHIP,
    //           ),
    //         },
    //       },
    //       {
    //         $addFields: {
    //           pendingTotal: {
    //             $add: [
    //               '$pendingElectricity',
    //               '$pendingGuest',
    //               '$pendingMembership',
    //             ],
    //           },
    //         },
    //       },
    //     );

    //     if (request.filterByDebtStatus?.includes('true')) {
    //       pipeline.push({
    //         $match: {
    //           $expr: {
    //             $gt: ['$pendingTotal', 0],
    //           },
    //         },
    //       });
    //     } else if (request.filterByDebtStatus?.includes('false')) {
    //       pipeline.push({
    //         $match: {
    //           $expr: {
    //             $eq: ['$pendingTotal', 0],
    //           },
    //         },
    //       });
    //     }
    //   }
    // }

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

    pipeline.push({
      $addFields: {
        pendingElectricity: getPendingByCategoryDocument(
          DueCategoryEnum.ELECTRICITY,
        ),
      },
    });

    pipeline.push({
      $addFields: {
        pendingMembership: getPendingByCategoryDocument(
          DueCategoryEnum.MEMBERSHIP,
        ),
      },
    });

    pipeline.push({
      $addFields: {
        pendingGuest: getPendingByCategoryDocument(DueCategoryEnum.GUEST),
      },
    });

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

    if (request.filterByDebtStatus?.includes('true')) {
      pipeline.push({
        $match: {
          $expr: {
            $gt: ['$pendingTotal', 0],
          },
        },
      });
    } else if (request.filterByDebtStatus?.includes('false')) {
      pipeline.push({
        $match: {
          $expr: {
            $eq: ['$pendingTotal', 0],
          },
        },
      });
    }

    return pipeline;
  }
}
