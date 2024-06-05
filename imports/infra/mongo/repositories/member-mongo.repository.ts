import type { Document } from 'mongodb';
import { inject, injectable } from 'tsyringe';

import { DIToken } from '@application/common/di/tokens.di';
import { ILogger } from '@domain/common/logger/logger.interface';
import { DueCategoryEnum, DueStatusEnum } from '@domain/dues/due.enum';
import {
  FindMembers,
  FindMembersToExport,
  FindOneMemberById,
  FindPaginatedMembersRequest,
  FindPaginatedMembersResponse,
  IMemberRepository,
  MemberTotalDues,
  PaginatedMember,
} from '@domain/members/member.repository';
import { Member } from '@domain/members/models/member.model';
import { MemberMongoAuditableCollection } from '@infra/mongo/collections/member-auditable.collection';
import { MemberMongoCollection } from '@infra/mongo/collections/member.collection';
import { MemberAuditEntity } from '@infra/mongo/entities/member-audit.entity';
import { MemberEntity } from '@infra/mongo/entities/member.entity';
import { MemberMapper } from '@infra/mongo/mappers/member.mapper';
import { MongoUtils } from '@infra/mongo/mongo.utils';
import { CrudMongoAuditableRepository } from '@infra/mongo/repositories/common/crud-mongo-auditable.repository';
import { FindPaginatedMembersAggregationResult } from '@infra/mongo/repositories/types/member-mongo-repository.types';
import { UserMongoRepository } from '@infra/mongo/repositories/user-mongo.repository';

@injectable()
export class MemberMongoRepository
  extends CrudMongoAuditableRepository<Member, MemberEntity, MemberAuditEntity>
  implements IMemberRepository
{
  public constructor(
    @inject(DIToken.Logger)
    protected readonly logger: ILogger,
    protected readonly collection: MemberMongoCollection,
    protected readonly auditableCollection: MemberMongoAuditableCollection,
    protected readonly mapper: MemberMapper,
    private readonly _userRepository: UserMongoRepository,
  ) {
    super(collection, mapper, logger, auditableCollection);
  }

  public async find(request: FindMembers): Promise<Member[]> {
    const pipeline: Document[] = [];

    const $match: Document = {
      $expr: { $and: [{ $eq: ['$isDeleted', false] }] },
    };

    if (request.status && request.status.length > 0) {
      $match.$expr.$and.push({ $in: ['$status', request.status] });
    }

    if (request.category && request.category.length > 0) {
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

    return entities.map((entity) => this.mapper.toDomain(entity));
  }

  public async findByDocument(documentID: string): Promise<Member | null> {
    const entity = await this.collection.findOneAsync({
      documentID,
      isDeleted: false,
    });

    if (!entity) {
      return null;
    }

    return this.mapper.toDomain(entity);
  }

  public async findPaginated(
    request: FindPaginatedMembersRequest,
  ): Promise<FindPaginatedMembersResponse> {
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
      items: entities.map<PaginatedMember>((entity) => ({
        dues: entity.dues ?? {
          _id: '',
          electricity: 0,
          guest: 0,
          membership: 0,
          total: 0,
        },
        member: this.mapper.toDomain(entity),
      })),
      totalCount,
      totals,
    };
  }

  public async findToExport(request: FindMembersToExport): Promise<Member[]> {
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

    return entities.map((entity) => this.mapper.toDomain(entity));
  }

  public async getBalances(memberIds: string[]): Promise<MemberTotalDues[]> {
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
      // {
      //   $project: {
      //     _id: 1,
      //     electricity: { $ifNull: ['$electricity', 0] },
      //     guest: { $ifNull: ['$guest', 0] },
      //     membership: { $ifNull: ['$membership', 0] },
      //     total: { $ifNull: ['$electricity', 0] },
      //   },
      // },
    ];

    const result = await this.collection
      .rawCollection()
      .aggregate<MemberTotalDues>(pipeline)
      .toArray();

    return result;
  }

  private _getPipelineToExportOrGrid(
    request: FindPaginatedMembersRequest,
  ): Document[] {
    const pipeline: Document[] = [];

    const $match: Document = {
      isDeleted: false,
      // $expr: { $and: [{ $eq: ['$isDeleted', false] }] },
    };

    if (request.filterById.length > 0) {
      $match.$expr.$and.push({ $in: ['$_id', request.filterById] });
    } else {
      if (request.filterByCategory.length > 0) {
        $match.$expr.$and.push({
          $in: ['$category', request.filterByCategory],
        });
      }

      if (request.filterByStatus.length > 0) {
        $match.status = { $in: request.filterByStatus };
        // $match.$expr.$and.push({ $in: ['$status', request.filterByStatus] });
      }
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
    //   request.sorter.pendingElectricity ||
    //   request.sorter.pendingMembership ||
    //   request.sorter.pendingGuest ||
    //   request.sorter.pendingTotal ||
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

    pipeline.push(
      {
        $lookup: {
          as: 'dues',
          foreignField: 'memberId',
          from: 'dues',
          localField: '_id',
          pipeline: [
            {
              $match: {
                isDeleted: false,
                status: {
                  $in: [DueStatusEnum.PENDING, DueStatusEnum.PARTIALLY_PAID],
                },
              },
            },
            {
              $lookup: {
                as: 'payments',
                foreignField: 'dueId',
                from: 'payment.dues',
                localField: '_id',
                pipeline: [
                  {
                    $match: {
                      isDeleted: false,
                    },
                  },
                  {
                    $group: {
                      _id: null,
                      totalPaid: {
                        $sum: '$amount',
                      },
                    },
                  },
                  {
                    $project: {
                      _id: 0,
                    },
                  },
                ],
              },
            },
            {
              $unwind: {
                path: '$payments',
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $addFields: {
                amount: {
                  $subtract: [
                    '$amount',
                    {
                      $ifNull: ['$payments.totalPaid', 0],
                    },
                  ],
                },
              },
            },
            {
              $group: {
                _id: null,
                electricity: {
                  $sum: {
                    $cond: [
                      { $eq: ['$category', DueCategoryEnum.ELECTRICITY] },
                      '$amount',
                      0,
                    ],
                  },
                },
                guest: {
                  $sum: {
                    $cond: [
                      { $eq: ['$category', DueCategoryEnum.GUEST] },
                      '$amount',
                      0,
                    ],
                  },
                },
                membership: {
                  $sum: {
                    $cond: [
                      { $eq: ['$category', DueCategoryEnum.MEMBERSHIP] },
                      '$amount',
                      0,
                    ],
                  },
                },
              },
            },
            {
              $project: {
                _id: 0,
                electricity: 1,
                guest: 1,
                membership: 1,
                total: {
                  $add: ['$membership', '$guest', '$electricity'],
                },
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: '$dues',
          preserveNullAndEmptyArrays: true,
        },
      },
    );

    // pipeline.push({
    //   $addFields: {
    //     pendingElectricity: getPendingByCategoryDocument(
    //       DueCategoryEnum.ELECTRICITY,
    //     ),
    //   },
    // });

    // pipeline.push({
    //   $addFields: {
    //     pendingMembership: getPendingByCategoryDocument(
    //       DueCategoryEnum.MEMBERSHIP,
    //     ),
    //   },
    // });

    // pipeline.push({
    //   $addFields: {
    //     pendingGuest: getPendingByCategoryDocument(DueCategoryEnum.GUEST),
    //   },
    // });

    // pipeline.push(
    //   {
    //     $addFields: {
    //       pendingElectricity: getPendingByCategoryDocument(
    //         DueCategoryEnum.ELECTRICITY,
    //       ),
    //       pendingGuest: getPendingByCategoryDocument(DueCategoryEnum.GUEST),
    //       pendingMembership: getPendingByCategoryDocument(
    //         DueCategoryEnum.MEMBERSHIP,
    //       ),
    //     },
    //   },
    //   {
    //     $addFields: {
    //       pendingTotal: {
    //         $add: [
    //           '$pendingElectricity',
    //           '$pendingGuest',
    //           '$pendingMembership',
    //         ],
    //       },
    //     },
    //   },
    // );

    if (request.filterByDebtStatus.includes('true')) {
      pipeline.push({
        $match: {
          $expr: {
            $gt: ['$pendingTotal', 0],
          },
        },
      });
    } else if (request.filterByDebtStatus.includes('false')) {
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

  public async findOneById(request: FindOneMemberById): Promise<Member | null> {
    const member = await super.findOneById(request);

    if (!member) {
      return null;
    }

    if (request.fetchUser ?? true) {
      member.user = await this._userRepository.findOneByIdOrThrow({
        id: member.userId,
      });
    }

    return member;
  }
}
