import type { Document } from 'mongodb';
import { inject, injectable } from 'tsyringe';

import { DIToken } from '@application/common/di/tokens.di';
import { ILoggerService } from '@application/common/logger/logger.interface';
import {
  FindManyByIds,
  FindOneById,
} from '@application/common/repositories/queryable.repository';
import {
  FindMembers,
  FindMembersToExport,
  FindPaginatedMembersRequest,
  FindPaginatedMembersResponse,
  IMemberRepository,
  PaginatedMember,
} from '@application/members/repositories/member.repository';
import { DueCategoryEnum, DueStatusEnum } from '@domain/dues/due.enum';
import { MemberCreditTypeEnum } from '@domain/members/member.enum';
import { Member } from '@domain/members/models/member.model';
import { MemberMongoAuditableCollection } from '@infra/mongo/collections/member-auditable.collection';
import { MemberMongoCollection } from '@infra/mongo/collections/member.collection';
import { MemberAuditEntity } from '@infra/mongo/entities/member-audit.entity';
import { MemberEntity } from '@infra/mongo/entities/member.entity';
import { MemberMapper } from '@infra/mongo/mappers/member.mapper';
import { CrudMongoAuditableRepository } from '@infra/mongo/repositories/common/crud-mongo-auditable.repository';
import { MemberEntityWithDues } from '@infra/mongo/repositories/types/member-mongo-repository.types';
import { UserMongoRepository } from '@infra/mongo/repositories/user-mongo.repository';

@injectable()
export class MemberMongoRepository
  extends CrudMongoAuditableRepository<Member, MemberEntity, MemberAuditEntity>
  implements IMemberRepository
{
  public constructor(
    @inject(DIToken.ILoggerService)
    protected readonly logger: ILoggerService,
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

    pipeline.push({ $match }, ...this.getUserLookupPipeline(), {
      $sort: {
        lastName: 1,
        // eslint-disable-next-line sort-keys-fix/sort-keys-fix
        firstName: 1,
      },
    });

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

  public async findByIds(request: FindManyByIds): Promise<Member[]> {
    const pipeline: Document[] = [
      {
        $match: {
          _id: { $in: request.ids },
          isDeleted: false,
        },
      },
      ...this.getUserLookupPipeline(),
    ];

    const entities = await this.collection
      .rawCollection()
      .aggregate<MemberEntity>(pipeline)
      .toArray();

    return entities.map((entity) => this.mapper.toDomain(entity));
  }

  public async findOneById(request: FindOneById): Promise<Member | null> {
    const member = await super.findOneById(request);

    if (!member) {
      return null;
    }

    member.user = await this._userRepository.findOneByIdOrThrow({
      id: member.userId,
    });

    return member;
  }

  public async findOneByIdOrThrow(request: FindOneById): Promise<Member> {
    const member = await super.findOneByIdOrThrow(request);

    member.user = await this._userRepository.findOneByIdOrThrow({
      id: member.userId,
    });

    return member;
  }

  public async findPaginated(
    request: FindPaginatedMembersRequest,
  ): Promise<FindPaginatedMembersResponse> {
    const query = this._getMatchQueryToGridOrExport(request);

    const pipeline: Document[] = [{ $match: query }];

    if (this._isSortingBySomePendingDues(request)) {
      pipeline.push(...this._getPipelineWithDues(request));
    }

    pipeline.push(
      ...this.getPaginatedPipeline(request),
      ...this.getUserLookupPipeline(),
    );

    if (!this._isSortingBySomePendingDues(request)) {
      pipeline.push(...this._getPipelineWithDues(request));
    }

    const [entities, totalCount] = await Promise.all([
      this.aggregate<MemberEntityWithDues>(pipeline),
      this.count(query),
    ]);

    return {
      items: entities.map<PaginatedMember>((entity) => ({
        availableCredit: entity.availableCredit?.amount ?? 0,
        member: this.mapper.toDomain(entity),
        pendingElectricity: entity.pendingElectricity,
        pendingGuest: entity.pendingGuest,
        pendingMembership: entity.pendingMembership,
        pendingTotal: entity.pendingTotal,
      })),
      totalCount,
    };
  }

  public async findToExport(
    request: FindMembersToExport,
  ): Promise<PaginatedMember[]> {
    const query = this._getMatchQueryToGridOrExport(request);

    const pipeline: Document[] = [
      { $match: query },
      ...this._getPipelineWithDues(request),
      this.getPaginatedSorterStage(request.sorter),
      ...this.getUserLookupPipeline(),
    ];

    const entities = await this.collection
      .rawCollection()
      .aggregate<MemberEntityWithDues>(pipeline)
      .toArray();

    return entities.map<PaginatedMember>((entity) => ({
      availableCredit: entity.availableCredit?.amount ?? 0,
      member: this.mapper.toDomain(entity),
      pendingElectricity: entity.pendingElectricity,
      pendingGuest: entity.pendingGuest,
      pendingMembership: entity.pendingMembership,
      pendingTotal: entity.pendingTotal,
    }));
  }

  private _getMatchQueryToGridOrExport(
    request: FindPaginatedMembersRequest,
  ): Mongo.Query<MemberEntity> {
    const query: Mongo.Query<MemberEntity> = {
      isDeleted: false,
    };

    if (request.filterById.length > 0) {
      query._id = { $in: request.filterById };

      return query;
    }

    if (request.filterByCategory.length > 0) {
      query.category = { $in: request.filterByCategory };
    }

    if (request.filterByStatus.length > 0) {
      query.status = { $in: request.filterByStatus };
    }

    return query;
  }

  private _getPipelineWithDues(
    request: FindPaginatedMembersRequest,
  ): Document[] {
    function getPendingByCategoryDocument(category: DueCategoryEnum): Document {
      return {
        [category]: {
          $sum: {
            $cond: [{ $eq: ['$category', category] }, '$totalPendingAmount', 0],
          },
        },
      };
    }

    function groupByMemberCreditType(type: MemberCreditTypeEnum) {
      return {
        $sum: {
          $cond: [{ $eq: ['$type', type] }, '$amount', 0],
        },
      };
    }

    const pipeline: Document[] = [
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
              $group: {
                _id: null,
                ...getPendingByCategoryDocument(DueCategoryEnum.ELECTRICITY),
                ...getPendingByCategoryDocument(DueCategoryEnum.GUEST),
                ...getPendingByCategoryDocument(DueCategoryEnum.MEMBERSHIP),
                total: {
                  $sum: '$totalPendingAmount',
                },
              },
            },
          ],
        },
      },
      {
        $addFields: {
          pendingElectricity: {
            $ifNull: [{ $first: `$dues.${DueCategoryEnum.ELECTRICITY}` }, 0],
          },
          pendingGuest: {
            $ifNull: [{ $first: `$dues.${DueCategoryEnum.GUEST}` }, 0],
          },
          pendingMembership: {
            $ifNull: [{ $first: `$dues.${DueCategoryEnum.MEMBERSHIP}` }, 0],
          },
          pendingTotal: {
            $ifNull: [{ $first: `$dues.total` }, 0],
          },
        },
      },
      {
        $lookup: {
          as: 'availableCredit',
          foreignField: 'memberId',
          from: 'member.credits',
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
                credits: groupByMemberCreditType(MemberCreditTypeEnum.CREDIT),
                debits: groupByMemberCreditType(MemberCreditTypeEnum.DEBIT),
              },
            },
            {
              $project: {
                _id: 0,
                amount: { $subtract: ['$credits', '$debits'] },
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: '$availableCredit',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          availableCredit: { $ifNull: ['$availableCredit', { amount: 0 }] },
        },
      },
    ];

    if (request.filterByDebtStatus.includes('true')) {
      pipeline.push({ $match: { pendingTotal: { $gt: 0 } } });
    } else if (request.filterByDebtStatus.includes('false')) {
      pipeline.push({ $match: { pendingTotal: 0 } });
    }

    if (request.filterByAvailableCredit.includes('true')) {
      pipeline.push({ $match: { 'availableCredit.amount': { $gt: 0 } } });
    } else if (request.filterByAvailableCredit.includes('false')) {
      pipeline.push({ $match: { 'availableCredit.amount': 0 } });
    }

    return pipeline;
  }

  private _isSortingBySomePendingDues(
    request: FindPaginatedMembersRequest,
  ): boolean {
    if (
      request.sorter.pendingElectricity ||
      request.sorter.pendingMembership ||
      request.sorter.pendingGuest ||
      request.sorter.pendingTotal ||
      request.sorter.availableCredit ||
      request.filterByDebtStatus.length > 0
    ) {
      return true;
    }

    return false;
  }
}
