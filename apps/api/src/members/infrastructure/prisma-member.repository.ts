import { DueCategory, DueStatus } from '@club-social/shared/dues';
import {
  ExportRequest,
  PaginatedRequest,
  PaginatedResponse,
} from '@club-social/shared/types';
import { Injectable } from '@nestjs/common';

import {
  MemberFindManyArgs,
  MemberOrderByWithRelationInput,
  MemberWhereInput,
} from '@/infrastructure/database/prisma/generated/models';
import { PrismaMappers } from '@/infrastructure/database/prisma/prisma.mappers';
import { PrismaService } from '@/infrastructure/database/prisma/prisma.service';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

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
    const member = await this.prismaService.member.findUnique({
      include: { dues: { include: { paymentDues: true } }, user: true },
      where: { deletedAt: null, id: id.value },
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

    const query = {
      include: {
        dues: {
          where: {
            deletedAt: null,
            status: {
              in: [DueStatus.PENDING, DueStatus.PARTIALLY_PAID],
            },
          },
        },
        user: true,
      },
      orderBy,
      skip: (params.page - 1) * params.pageSize,
      take: params.pageSize,
      where,
    } satisfies MemberFindManyArgs;

    const [members, total] = await Promise.all([
      this.prismaService.member.findMany(query),
      this.prismaService.member.count({ where }),
    ]);

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
      where: { deletedAt: null, id: id.value },
    });

    if (!member) {
      return null;
    }

    return this.mapper.member.toDomain(member);
  }

  public async findUniqueByIds(ids: UniqueId[]): Promise<MemberEntity[]> {
    const members = await this.prismaService.member.findMany({
      where: {
        deletedAt: null,
        id: { in: ids.map((id) => id.value) },
      },
    });

    return members.map((member) => this.mapper.member.toDomain(member));
  }

  public async findUniqueOrThrow(id: UniqueId): Promise<MemberEntity> {
    const member = await this.prismaService.member.findUniqueOrThrow({
      where: { deletedAt: null, id: id.value },
    });

    return this.mapper.member.toDomain(member);
  }

  public async save(entity: MemberEntity): Promise<MemberEntity> {
    const data = this.mapper.member.toPersistence(entity);

    const member = await this.prismaService.member.upsert({
      create: data,
      update: data,
      where: { id: entity.id.value },
    });

    return this.mapper.member.toDomain(member);
  }

  public async search(
    params: MemberSearchParams,
  ): Promise<MemberSearchModel[]> {
    const members = await this.prismaService.member.findMany({
      include: { user: true },
      orderBy: [{ user: { lastName: 'asc' } }, { user: { firstName: 'asc' } }],
      take: params.limit,
      where: {
        deletedAt: null,
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
    const where: MemberWhereInput = {
      deletedAt: null,
    };

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

  private async fetchDueAggregates(
    memberIds: string[],
  ): Promise<Map<string, Map<DueCategory, number>>> {
    const dueAggregates = await this.prismaService.due.groupBy({
      _sum: { amount: true },
      by: ['memberId', 'category'],
      where: {
        deletedAt: null,
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

      if (memberDuesMap) {
        memberDuesMap.set(
          aggregate.category as DueCategory,
          aggregate._sum.amount ?? 0,
        );
      }
    });

    return duesByMemberAndCategory;
  }
}
