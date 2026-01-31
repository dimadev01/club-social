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
import { UserRole } from '@club-social/shared/users';
import { Injectable } from '@nestjs/common';
import { orderBy, sumBy } from 'es-toolkit/compat';

import {
  MemberGetPayload,
  MemberOrderByWithRelationInput,
  MemberWhereInput,
} from '@/infrastructure/database/prisma/generated/models';
import { PrismaService } from '@/infrastructure/database/prisma/prisma.service';
import { PrismaClientLike } from '@/infrastructure/database/prisma/prisma.types';
import { EntityNotFoundError } from '@/shared/domain/errors/entity-not-found.error';
import { Name } from '@/shared/domain/value-objects/name/name.vo';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';
import {
  UserNotification,
  UserNotificationProps,
} from '@/users/domain/entities/user-notification';

import { MemberEntity } from '../domain/entities/member.entity';
import {
  MemberPaginatedExtraReadModel,
  MemberPaginatedReadModel,
  MemberReadModel,
  MemberSearchParams,
  MemberSearchReadModel,
  MemberStatisticsReadModel,
} from '../domain/member-read-models';
import {
  type FindMembersByCategoryParams,
  MemberRepository,
} from '../domain/member.repository';
import { PrismaMemberMapper } from './prisma-member.mapper';

type MemberWithUserPayload = MemberGetPayload<{ include: { user: true } }>;
type MemberWithUserWithLedgerEntriesPayload = MemberGetPayload<{
  include: { ledgerEntries: true; user: true };
}>;

@Injectable()
export class PrismaMemberRepository implements MemberRepository {
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly memberMapper: PrismaMemberMapper,
  ) {}

  public async findByCategoryReadModel(
    params: FindMembersByCategoryParams,
  ): Promise<MemberSearchReadModel[]> {
    const members = await this.prismaService.member.findMany({
      include: { user: true },
      orderBy: [{ user: { lastName: 'asc' } }, { user: { firstName: 'asc' } }],
      where: {
        category: params.category,
        status: params.status,
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
    const member: MemberWithUserPayload | null =
      await this.prismaService.member.findUnique({
        include: { user: true },
        where: { id: id.value },
      });

    return member ? this.toReadModel(member) : null;
  }

  public async findByIdReadModelOrThrow(
    id: UniqueId,
  ): Promise<MemberReadModel> {
    const member = await this.findByIdReadModel(id);

    if (!member) {
      throw new EntityNotFoundError();
    }

    return member;
  }

  public async findByIds(ids: UniqueId[]): Promise<MemberEntity[]> {
    const members = await this.prismaService.member.findMany({
      where: {
        id: { in: ids.map((id) => id.value) },
      },
    });

    return members.map((member) => this.memberMapper.toDomain(member));
  }

  public async findByUserIdReadModel(
    userId: UniqueId,
  ): Promise<MemberReadModel | null> {
    const member: MemberWithUserPayload | null =
      await this.prismaService.member.findUnique({
        include: { user: true },
        where: { userId: userId.value },
      });

    return member ? this.toReadModel(member) : null;
  }

  public async findForExport(
    params: ExportDataDto,
  ): Promise<MemberPaginatedReadModel[]> {
    const { members } = await this.findAllSorted(params);

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
    const { members, total } = await this.findAllSorted(params, {
      page: params.page,
      pageSize: params.pageSize,
    });

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

  public async getStatistics(
    topDebtorsLimit = 10,
  ): Promise<MemberStatisticsReadModel> {
    const activeWhere = { status: MemberStatus.ACTIVE };

    // Count by category
    const categoryGroups = await this.prismaService.member.groupBy({
      _count: true,
      by: ['category'],
      where: activeWhere,
    });

    const byCategory = Object.fromEntries(
      Object.values(MemberCategory).map((cat) => [cat, 0]),
    ) as Record<MemberCategory, number>;

    categoryGroups.forEach((group) => {
      byCategory[group.category as MemberCategory] = group._count;
    });

    // Count by sex
    const sexGroups = await this.prismaService.member.groupBy({
      _count: true,
      by: ['sex'],
      where: activeWhere,
    });

    const bySex = { female: 0, male: 0, unknown: 0 };

    sexGroups.forEach((group) => {
      if (group.sex === MemberSex.MALE) {
        bySex.male = group._count;
      } else if (group.sex === MemberSex.FEMALE) {
        bySex.female = group._count;
      } else {
        bySex.unknown = group._count;
      }
    });

    // Total active members
    const total = Object.values(byCategory).reduce(
      (sum, count) => sum + count,
      0,
    );

    // Top debtors: aggregate pending/partially paid dues by member
    const dueAggregates = await this.prismaService.due.groupBy({
      _sum: { amount: true },
      by: ['memberId'],
      orderBy: { _sum: { amount: 'desc' } },
      take: topDebtorsLimit,
      where: {
        member: activeWhere,
        status: { in: [DueStatus.PENDING, DueStatus.PARTIALLY_PAID] },
      },
    });

    // Get member details for top debtors
    const debtorIds = dueAggregates.map((agg) => agg.memberId);
    const debtorMembers = await this.prismaService.member.findMany({
      include: { user: true },
      where: { id: { in: debtorIds } },
    });

    const debtorMap = new Map(debtorMembers.map((m) => [m.id, m]));

    const topDebtors = dueAggregates
      .filter((agg) => (agg._sum.amount ?? 0) > 0)
      .map((agg) => {
        const member = debtorMap.get(agg.memberId);

        return {
          category:
            (member?.category as MemberCategory) ?? MemberCategory.MEMBER,
          id: agg.memberId,
          name: member
            ? Name.raw({
                firstName: member.user.firstName,
                lastName: member.user.lastName,
              }).fullName
            : '',
          totalDebt: agg._sum.amount ?? 0,
        };
      });

    return { byCategory, bySex, topDebtors, total };
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
    params: ExportDataDto,
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

  private async findAllByBalanceSort(params: {
    order: SortOrder;
    where: MemberWhereInput;
  }): Promise<MemberWithUserWithLedgerEntriesPayload[]> {
    const allMembers = await this.prismaService.member.findMany({
      include: { ledgerEntries: true, user: true },
      where: params.where,
    });

    const membersWithBalance = allMembers.map((member) => ({
      balance: sumBy(member.ledgerEntries, (entry) => entry.amount),
      member,
    }));

    const sortedMembersWithBalance = orderBy(
      membersWithBalance,
      (m) => m.balance,
      params.order,
    );

    return sortedMembersWithBalance.map((m) => m.member);
  }

  private async findAllByCategoryOrTotalSort(params: {
    category?: DueCategory;
    order: SortOrder;
    where: MemberWhereInput;
  }): Promise<MemberWithUserWithLedgerEntriesPayload[]> {
    const allMembers = await this.prismaService.member.findMany({
      select: { id: true },
      where: params.where,
    });

    const allMemberIds = allMembers.map((m) => m.id);

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

    const sortedMemberIdsFromDues = dues.map((d) => d.memberId);

    const membersWithNoDues = allMemberIds.filter(
      (id) => !sortedMemberIdsFromDues.includes(id),
    );
    const sortedMemberIds = [...sortedMemberIdsFromDues, ...membersWithNoDues];

    const fetchedMembers = await this.prismaService.member.findMany({
      include: { ledgerEntries: true, user: true },
      where: { id: { in: sortedMemberIds } },
    });

    const memberMap = new Map<string, MemberWithUserWithLedgerEntriesPayload>(
      fetchedMembers.map((m) => [m.id, m]),
    );

    return sortedMemberIds.map(
      (id) => memberMap.get(id) as MemberWithUserWithLedgerEntriesPayload,
    );
  }

  private async findAllSorted(
    params: ExportDataDto,
    pagination?: { page: number; pageSize: number },
  ): Promise<{
    members: MemberWithUserWithLedgerEntriesPayload[];
    total: number;
  }> {
    const { orderBy, where } = this.buildWhereAndOrderBy(params);

    const dueSortField = this.extractDueSortField(params);
    const balanceSortField = params.sort.find((s) => s.field === 'balance');
    const totalAmountSortField = params.sort.find(
      (s) => s.field === 'totalAmount',
    );

    // Computed sorts: fetch all, sort in memory, then paginate
    let allMembers: MemberWithUserWithLedgerEntriesPayload[] | null = null;

    if (dueSortField) {
      allMembers = await this.findAllByCategoryOrTotalSort({
        category: dueSortField.category,
        order: dueSortField.order,
        where,
      });
    } else if (totalAmountSortField) {
      allMembers = await this.findAllByCategoryOrTotalSort({
        order: totalAmountSortField.order,
        where,
      });
    } else if (balanceSortField) {
      allMembers = await this.findAllByBalanceSort({
        order: balanceSortField.order,
        where,
      });
    }

    if (allMembers) {
      if (pagination) {
        return {
          members: allMembers.slice(
            (pagination.page - 1) * pagination.pageSize,
            pagination.page * pagination.pageSize,
          ),
          total: allMembers.length,
        };
      }

      return { members: allMembers, total: allMembers.length };
    }

    // Standard sorting: use Prisma skip/take for efficiency
    if (pagination) {
      const [members, total] = await Promise.all([
        this.prismaService.member.findMany({
          include: { ledgerEntries: true, user: true },
          orderBy,
          skip: (pagination.page - 1) * pagination.pageSize,
          take: pagination.pageSize,
          where,
        }),
        this.prismaService.member.count({ where }),
      ]);

      return { members, total };
    }

    const members = await this.prismaService.member.findMany({
      include: { ledgerEntries: true, user: true },
      orderBy,
      where,
    });

    return { members, total: members.length };
  }

  private toPaginatedReadModel(
    member: MemberWithUserWithLedgerEntriesPayload,
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

  private toReadModel(model: MemberWithUserPayload): MemberReadModel {
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
      notificationPreferences: UserNotification.forRole(
        UserRole.MEMBER,
        model.user.notificationPreferences as unknown as UserNotificationProps,
      ),
      phones: model.phones,
      sex: model.sex as MemberSex | null,
      status: model.status as MemberStatus,
      userId: model.userId,
    };
  }
}
