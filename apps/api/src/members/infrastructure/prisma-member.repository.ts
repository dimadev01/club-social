import { DueCategory, DueStatus } from '@club-social/shared/dues';
import {
  FileStatus,
  MaritalStatus,
  MemberCategory,
  MemberNationality,
  MemberSex,
  MemberStatus,
} from '@club-social/shared/members';
import {
  ExportDataDto,
  GetPaginatedDataDto,
  PaginatedDataResultDto,
  SortOrder,
} from '@club-social/shared/types';
import { Injectable } from '@nestjs/common';
import { orderBy, sumBy } from 'es-toolkit/compat';

import {
  MemberGetPayload,
  MemberOrderByWithRelationInput,
  MemberWhereInput,
} from '@/infrastructure/database/prisma/generated/models';
import { PrismaService } from '@/infrastructure/database/prisma/prisma.service';
import { PrismaClientLike } from '@/infrastructure/database/prisma/prisma.types';
import { Name } from '@/shared/domain/value-objects/name/name.vo';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

import { MemberEntity } from '../domain/entities/member.entity';
import {
  MemberPaginatedExtraReadModel,
  MemberPaginatedReadModel,
  MemberReadModel,
  MemberSearchParams,
  MemberSearchReadModel,
} from '../domain/member-read-models';
import { MemberRepository } from '../domain/member.repository';
import { PrismaMemberMapper } from './prisma-member.mapper';

type MemberPayload = MemberGetPayload<{ include: { user: true } }>;
type MemberPayloadWithLedgerEntries = MemberGetPayload<{
  include: { ledgerEntries: true; user: true };
}>;

@Injectable()
export class PrismaMemberRepository implements MemberRepository {
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly memberMapper: PrismaMemberMapper,
  ) {}

  public async findById(id: UniqueId): Promise<MemberEntity | null> {
    const member = await this.prismaService.member.findUnique({
      where: { id: id.value },
    });

    if (!member) {
      return null;
    }

    return this.memberMapper.toDomain(member);
  }

  public async findByIdOrThrow(id: UniqueId): Promise<MemberEntity> {
    const member = await this.prismaService.member.findUniqueOrThrow({
      where: { id: id.value },
    });

    return this.memberMapper.toDomain(member);
  }

  public async findByIdReadModel(
    id: UniqueId,
  ): Promise<MemberReadModel | null> {
    const member: MemberPayload | null =
      await this.prismaService.member.findUnique({
        include: { user: true },
        where: { id: id.value },
      });

    if (!member) {
      return null;
    }

    return this.toReadModel(member);
  }

  public async findByIds(ids: UniqueId[]): Promise<MemberEntity[]> {
    const members = await this.prismaService.member.findMany({
      where: {
        id: { in: ids.map((id) => id.value) },
      },
    });

    return members.map((member) => this.memberMapper.toDomain(member));
  }

  public async findForExport(
    params: ExportDataDto,
  ): Promise<MemberPaginatedReadModel[]> {
    const { orderBy, where } = this.buildWhereAndOrderBy(params);

    const members = await this.prismaService.member.findMany({
      include: { ledgerEntries: true, user: true },
      orderBy,
      where,
    });

    const duesByMemberAndCategory = await this.fetchDueAggregates(
      members.map((m) => m.id),
    );

    return members.map((member) =>
      this.toPaginatedReadModel(member, duesByMemberAndCategory),
    );
  }

  public async findPaginated(
    params: GetPaginatedDataDto,
  ): Promise<
    PaginatedDataResultDto<
      MemberPaginatedReadModel,
      MemberPaginatedExtraReadModel
    >
  > {
    const { orderBy, where } = this.buildWhereAndOrderBy(params);

    // Check if sorting by a due category field or balance
    const dueSortField = this.extractDueSortField(params);

    // Check if sorting by balance
    const balanceSortField = params.sort.find(
      (sort) => sort.field === 'balance',
    );

    // Check if sorting by total amount
    const totalAmountSortField = params.sort.find(
      (sort) => sort.field === 'totalAmount',
    );

    let members: MemberPayloadWithLedgerEntries[];
    let total: number;

    if (dueSortField) {
      // Sorting by due amount - use aggregation-based sorting
      const result = await this.findPaginatedByCategoryOrTotalSort({
        category: dueSortField.category,
        order: dueSortField.order,
        page: params.page,
        pageSize: params.pageSize,
        where,
      });

      members = result.members;
      total = result.total;
    } else if (totalAmountSortField) {
      const result = await this.findPaginatedByCategoryOrTotalSort({
        order: totalAmountSortField.order,
        page: params.page,
        pageSize: params.pageSize,
        where,
      });

      members = result.members;
      total = result.total;
    } else if (balanceSortField) {
      // Sorting by balance - use aggregation-based sorting
      const result = await this.findPaginatedByBalanceSort({
        order: balanceSortField.order,
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
          include: { ledgerEntries: true, user: true },
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

    return {
      data: members.map((member) =>
        this.toPaginatedReadModel(member, duesByMemberAndCategory),
      ),
      total,
    };
  }

  public async findUniqueByUserId(userId: UniqueId): Promise<MemberEntity> {
    const member = await this.prismaService.member.findUniqueOrThrow({
      where: { userId: userId.value },
    });

    return this.memberMapper.toDomain(member);
  }

  public async save(
    entity: MemberEntity,
    tx?: PrismaClientLike,
  ): Promise<void> {
    const client = tx ?? this.prismaService;

    const create = this.memberMapper.toCreateInput(entity);
    const update = this.memberMapper.toUpdateInput(entity);

    await client.member.upsert({
      create,
      update,
      where: { id: entity.id.value },
    });
  }

  public async search(
    params: MemberSearchParams,
  ): Promise<MemberSearchReadModel[]> {
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
      category: member.category as MemberCategory,
      id: member.id,
      name: Name.raw({
        firstName: member.user.firstName,
        lastName: member.user.lastName,
      }).fullName,
      status: member.status as MemberStatus,
    }));
  }

  private buildWhereAndOrderBy(params: ExportDataDto): {
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

    if (params.filters?.status) {
      where.status = { in: params.filters.status };
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

  private extractDueSortField(
    params: GetPaginatedDataDto,
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

  private async findPaginatedByBalanceSort(params: {
    order: SortOrder;
    page: number;
    pageSize: number;
    where: MemberWhereInput;
  }): Promise<{
    members: MemberPayloadWithLedgerEntries[];
    total: number;
  }> {
    // Get all matching members with their ledger entries
    const allMembers = await this.prismaService.member.findMany({
      include: { ledgerEntries: true, user: true },
      where: params.where,
    });

    const totalMembersCount = allMembers.length;

    // Calculate balance for each member and sort
    const membersWithBalance = allMembers.map((member) => ({
      balance: sumBy(member.ledgerEntries, (entry) => entry.amount),
      member,
    }));

    const sortedMembersWithBalance = orderBy(
      membersWithBalance,
      (m) => m.balance,
      params.order,
    );

    // Paginate on the sorted list
    const paginatedMembers = sortedMembersWithBalance.slice(
      (params.page - 1) * params.pageSize,
      params.page * params.pageSize,
    );

    return {
      members: paginatedMembers.map((m) => m.member),
      total: totalMembersCount,
    };
  }

  private async findPaginatedByCategoryOrTotalSort(params: {
    category?: DueCategory;
    order: SortOrder;
    page: number;
    pageSize: number;
    where: MemberWhereInput;
  }): Promise<{
    members: MemberPayloadWithLedgerEntries[];
    total: number;
  }> {
    // Get all matching member IDs
    const allMembers = await this.prismaService.member.findMany({
      select: { id: true },
      where: params.where,
    });

    const allMemberIds = allMembers.map((m) => m.id);
    const totalMembersCount = allMemberIds.length;

    // Aggregate dues and sort (optionally filtered by category)
    const dues = await this.prismaService.due.groupBy({
      _sum: { amount: true },
      by: ['memberId'],
      orderBy: {
        _sum: { amount: params.order },
      },
      where: {
        ...(params.category && { category: params.category }),
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
      include: { ledgerEntries: true, user: true },
      where: { id: { in: paginatedMemberIdsToFetch } },
    });

    // Re-sort to match the order (Prisma returns in arbitrary order)
    const memberMap = new Map<string, MemberPayloadWithLedgerEntries>(
      fetchedMembers.map((m) => [m.id, m]),
    );
    const members = paginatedMemberIdsToFetch.map(
      (id) => memberMap.get(id) as MemberPayloadWithLedgerEntries,
    );

    return { members, total: totalMembersCount };
  }

  private toPaginatedReadModel(
    member: MemberPayloadWithLedgerEntries,
    duesByMemberAndCategory: Map<string, Map<DueCategory, number>>,
  ): MemberPaginatedReadModel {
    const memberDues = duesByMemberAndCategory.get(member.id);

    const electricityTotalDueAmount =
      memberDues?.get(DueCategory.ELECTRICITY) ?? 0;
    const guestTotalDueAmount = memberDues?.get(DueCategory.GUEST) ?? 0;
    const memberShipTotalDueAmount =
      memberDues?.get(DueCategory.MEMBERSHIP) ?? 0;

    const totalAmount =
      electricityTotalDueAmount +
      guestTotalDueAmount +
      memberShipTotalDueAmount;

    const balance = sumBy(
      member.ledgerEntries,
      (ledgerEntry) => ledgerEntry.amount,
    );

    return {
      balance,
      category: member.category as MemberCategory,
      electricityTotalDueAmount,
      email: member.user.email,
      guestTotalDueAmount,
      id: member.id,
      memberShipTotalDueAmount,
      name: Name.raw({
        firstName: member.user.firstName,
        lastName: member.user.lastName,
      }).fullName,
      status: member.status as MemberStatus,
      totalAmount,
    };
  }

  private toReadModel(model: MemberPayload): MemberReadModel {
    return {
      address:
        model.street || model.cityName || model.stateName || model.zipCode
          ? {
              cityName: model.cityName,
              stateName: model.stateName,
              street: model.street,
              zipCode: model.zipCode,
            }
          : null,
      birthDate: model.birthDate,
      category: model.category as MemberCategory,
      documentID: model.documentID,
      email: model.user.email,
      fileStatus: model.fileStatus as FileStatus,
      firstName: model.user.firstName,
      id: model.id,
      lastName: model.user.lastName,
      maritalStatus: model.maritalStatus as MaritalStatus | null,
      name: Name.raw({
        firstName: model.user.firstName,
        lastName: model.user.lastName,
      }).fullName,
      nationality: model.nationality as MemberNationality | null,
      phones: model.phones,
      sex: model.sex as MemberSex | null,
      status: model.status as MemberStatus,
      userId: model.userId,
    };
  }
}
