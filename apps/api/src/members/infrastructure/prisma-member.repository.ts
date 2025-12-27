import { DueCategory, DueStatus } from '@club-social/shared/dues';
import {
  ExportRequest,
  PaginatedRequest,
  PaginatedResponse,
  SortOrder,
} from '@club-social/shared/types';
import { Injectable } from '@nestjs/common';

import {
  MemberGetPayload,
  MemberOrderByWithRelationInput,
  MemberWhereInput,
} from '@/infrastructure/database/prisma/generated/models';
import { PrismaMappers } from '@/infrastructure/database/prisma/prisma.mappers';
import { PrismaService } from '@/infrastructure/database/prisma/prisma.service';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

type MemberWithUser = MemberGetPayload<{ include: { user: true } }>;
type MemberWithUserAndDues = MemberGetPayload<{
  include: { dues: { include: { settlements: true } }; user: true };
}>;

import { MemberEntity } from '../domain/entities/member.entity';
import { MemberRepository } from '../domain/member.repository';
import {
  MemberDetailModel,
  MemberPaginatedExtraModel,
  MemberPaginatedModel,
  MemberSearchModel,
  MemberSearchParams,
} from '../domain/member.types';

@Injectable()
export class PrismaMemberRepository implements MemberRepository {
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly mapper: PrismaMappers,
  ) {}

  public async findForExport(
    params: ExportRequest,
  ): Promise<MemberPaginatedModel[]> {
    const { orderBy, where } = this.buildWhereAndOrderBy(params);

    const members = await this.prismaService.member.findMany({
      include: { user: true },
      orderBy,
      where,
    });

    const duesByMemberAndCategory = await this.fetchDueAggregates(
      members.map((m) => m.id),
    );

    return members.map((member) => {
      const memberDues = duesByMemberAndCategory.get(member.id);

      return {
        electricityTotalDueAmount:
          memberDues?.get(DueCategory.ELECTRICITY) ?? 0,
        guestTotalDueAmount: memberDues?.get(DueCategory.GUEST) ?? 0,
        member: this.mapper.member.toDomain(member),
        memberShipTotalDueAmount: memberDues?.get(DueCategory.MEMBERSHIP) ?? 0,
        user: this.mapper.user.toDomain(member.user),
      };
    });
  }

  public async findOneModel(id: UniqueId): Promise<MemberDetailModel | null> {
    const member: MemberWithUserAndDues | null =
      await this.prismaService.member.findUnique({
        include: { dues: { include: { settlements: true } }, user: true },
        where: { id: id.value },
      });

    if (!member) {
      return null;
    }

    return {
      dues: member.dues.map((due) => this.mapper.due.toDomain(due)),
      member: this.mapper.member.toDomain(member),
      payments: [],
      user: this.mapper.user.toDomain(member.user),
    };
  }

  public async findPaginated(
    params: PaginatedRequest,
  ): Promise<
    PaginatedResponse<MemberPaginatedModel, MemberPaginatedExtraModel>
  > {
    const { orderBy, where } = this.buildWhereAndOrderBy(params);

    // Check if sorting by a due category field
    const dueSortField = this.extractDueSortField(params);

    let members: MemberWithUser[];
    let total: number;

    if (dueSortField) {
      // Sorting by due amount - use aggregation-based sorting
      const result = await this.findPaginatedByDueSort({
        category: dueSortField.category,
        order: dueSortField.order,
        page: params.page,
        pageSize: params.pageSize,
        where,
      });
      members = result.members;
      total = result.total;
    } else {
      // Standard Prisma sorting
      [members, total] = await Promise.all([
        this.prismaService.member.findMany({
          include: { user: true },
          orderBy,
          skip: (params.page - 1) * params.pageSize,
          take: params.pageSize,
          where,
        }),
        this.prismaService.member.count({ where }),
      ]);
    }

    const duesByMemberAndCategory = await this.fetchDueAggregates(
      members.map((m) => m.id),
    );

    const totals = this.calculateTotalsByCategory(duesByMemberAndCategory);

    return {
      data: members.map((member) => {
        const memberDues = duesByMemberAndCategory.get(member.id);

        return {
          electricityTotalDueAmount:
            memberDues?.get(DueCategory.ELECTRICITY) ?? 0,
          guestTotalDueAmount: memberDues?.get(DueCategory.GUEST) ?? 0,
          member: this.mapper.member.toDomain(member),
          memberShipTotalDueAmount:
            memberDues?.get(DueCategory.MEMBERSHIP) ?? 0,
          user: this.mapper.user.toDomain(member.user),
        };
      }),
      extra: {
        electricityTotalDueAmount: totals[DueCategory.ELECTRICITY],
        guestTotalDueAmount: totals[DueCategory.GUEST],
        memberShipTotalDueAmount: totals[DueCategory.MEMBERSHIP],
      },
      total,
    };
  }

  public async findUniqueById(id: UniqueId): Promise<MemberEntity | null> {
    const member = await this.prismaService.member.findUnique({
      where: { id: id.value },
    });

    if (!member) {
      return null;
    }

    return this.mapper.member.toDomain(member);
  }

  public async findUniqueByIds(ids: UniqueId[]): Promise<MemberEntity[]> {
    const members = await this.prismaService.member.findMany({
      where: {
        id: { in: ids.map((id) => id.value) },
      },
    });

    return members.map((member) => this.mapper.member.toDomain(member));
  }

  public async findUniqueOrThrow(id: UniqueId): Promise<MemberEntity> {
    const member = await this.prismaService.member.findUniqueOrThrow({
      where: { id: id.value },
    });

    return this.mapper.member.toDomain(member);
  }

  public async save(entity: MemberEntity): Promise<void> {
    const create = this.mapper.member.toCreateInput(entity);
    const update = this.mapper.member.toUpdateInput(entity);

    await this.prismaService.member.upsert({
      create,
      update,
      where: { id: entity.id.value },
    });
  }

  public async search(
    params: MemberSearchParams,
  ): Promise<MemberSearchModel[]> {
    const members = await this.prismaService.member.findMany({
      include: { user: true },
      orderBy: [{ user: { lastName: 'asc' } }, { user: { firstName: 'asc' } }],
      take: params.limit,
      where: {
        OR: [
          {
            user: {
              OR: [
                {
                  firstName: {
                    contains: params.searchTerm,
                    mode: 'insensitive',
                  },
                },
                {
                  lastName: {
                    contains: params.searchTerm,
                    mode: 'insensitive',
                  },
                },
              ],
            },
          },
        ],
      },
    });

    return members.map((member) => ({
      member: this.mapper.member.toDomain(member),
      user: this.mapper.user.toDomain(member.user),
    }));
  }

  private buildWhereAndOrderBy(params: ExportRequest): {
    orderBy: MemberOrderByWithRelationInput[];
    where: MemberWhereInput;
  } {
    const where: MemberWhereInput = {};

    if (params.filters?.id) {
      where.id = { in: params.filters.id };
    }

    if (params.filters?.category) {
      where.category = { in: params.filters.category };
    }

    if (params.filters?.userStatus) {
      where.user = { status: { in: params.filters.userStatus } };
    }

    const orderBy: MemberOrderByWithRelationInput[] = [];

    params.sort.forEach(({ field, order }) => {
      if (field === 'email') {
        orderBy.push({ user: { email: order } });
      } else if (field === 'id') {
        orderBy.push(
          { user: { lastName: order } },
          { user: { firstName: order } },
        );
      } else {
        orderBy.push({ [field]: order });
      }
    });

    return { orderBy, where };
  }

  private calculateTotalsByCategory(
    duesByMemberAndCategory: Map<string, Map<DueCategory, number>>,
  ): Record<DueCategory, number> {
    const totals: Record<DueCategory, number> = {
      [DueCategory.ELECTRICITY]: 0,
      [DueCategory.GUEST]: 0,
      [DueCategory.MEMBERSHIP]: 0,
    };

    duesByMemberAndCategory.forEach((categoryMap) => {
      categoryMap.forEach((amount, category) => {
        totals[category] += amount;
      });
    });

    return totals;
  }

  private extractDueSortField(
    params: PaginatedRequest,
  ): null | { category: DueCategory; order: SortOrder } {
    const dueSortFieldMap: Record<string, DueCategory> = {
      electricityTotalDueAmount: DueCategory.ELECTRICITY,
      guestTotalDueAmount: DueCategory.GUEST,
      memberShipTotalDueAmount: DueCategory.MEMBERSHIP,
    };

    for (const sort of params.sort) {
      const category = dueSortFieldMap[sort.field];

      if (category) {
        return { category, order: sort.order };
      }
    }

    return null;
  }

  private async fetchDueAggregates(
    memberIds: string[],
  ): Promise<Map<string, Map<DueCategory, number>>> {
    const dueAggregates = await this.prismaService.due.groupBy({
      _sum: { amount: true },
      by: ['memberId', 'category'],
      where: {
        memberId: { in: memberIds },
        status: {
          in: [DueStatus.PENDING, DueStatus.PARTIALLY_PAID],
        },
      },
    });

    // Build lookup map: memberId -> category -> amount
    const duesByMemberAndCategory = new Map<string, Map<DueCategory, number>>();

    dueAggregates.forEach((aggregate) => {
      if (!duesByMemberAndCategory.has(aggregate.memberId)) {
        duesByMemberAndCategory.set(
          aggregate.memberId,
          new Map<DueCategory, number>(),
        );
      }

      const memberDuesMap = duesByMemberAndCategory.get(aggregate.memberId);

      if (memberDuesMap && aggregate._sum) {
        memberDuesMap.set(
          aggregate.category as DueCategory,
          aggregate._sum.amount ?? 0,
        );
      }
    });

    return duesByMemberAndCategory;
  }

  private async findPaginatedByDueSort(params: {
    category: DueCategory;
    order: SortOrder;
    page: number;
    pageSize: number;
    where: MemberWhereInput;
  }): Promise<{ members: MemberWithUser[]; total: number }> {
    // Get all matching member IDs
    const allMembers = await this.prismaService.member.findMany({
      select: { id: true },
      where: params.where,
    });

    const allMemberIds = allMembers.map((m) => m.id);
    const totalMembersCount = allMemberIds.length;

    // Aggregate dues by category and sort
    const dues = await this.prismaService.due.groupBy({
      _sum: { amount: true },
      by: ['memberId'],
      orderBy: {
        _sum: { amount: params.order },
      },
      where: {
        category: params.category,
        memberId: { in: allMemberIds },
        status: {
          in: [DueStatus.PENDING, DueStatus.PARTIALLY_PAID],
        },
      },
    });

    // Get sorted member IDs from dues aggregation
    const sortedMemberIdsFromDues = dues.map((d) => d.memberId);

    // Members with no dues go at the end
    const membersWithNoDues = allMemberIds.filter(
      (id) => !sortedMemberIdsFromDues.includes(id),
    );
    const sortedMemberIds = [...sortedMemberIdsFromDues, ...membersWithNoDues];

    // Paginate on the sorted list
    const paginatedMemberIdsToFetch = sortedMemberIds.slice(
      (params.page - 1) * params.pageSize,
      params.page * params.pageSize,
    );

    // Fetch the members for this page
    const fetchedMembers = await this.prismaService.member.findMany({
      include: { user: true },
      where: { id: { in: paginatedMemberIdsToFetch } },
    });

    // Re-sort to match the order (Prisma returns in arbitrary order)
    const memberMap = new Map<string, MemberWithUser>(
      fetchedMembers.map((m) => [m.id, m]),
    );
    const members = paginatedMemberIdsToFetch.map(
      (id) => memberMap.get(id) as MemberWithUser,
    );

    return { members, total: totalMembersCount };
  }
}
