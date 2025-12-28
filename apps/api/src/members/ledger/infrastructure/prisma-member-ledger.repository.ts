import type {
  GetPaginatedDataDto,
  PaginatedDataResultDto,
} from '@club-social/shared/types';

import {
  MemberLedgerEntryStatus,
  MemberLedgerEntryType,
} from '@club-social/shared/members';
import { Injectable } from '@nestjs/common';

import {
  MemberLedgerEntryFindManyArgs,
  MemberLedgerEntryOrderByWithRelationInput,
  MemberLedgerEntryWhereInput,
} from '@/infrastructure/database/prisma/generated/models';
import { PrismaMappers } from '@/infrastructure/database/prisma/prisma.mappers';
import { PrismaService } from '@/infrastructure/database/prisma/prisma.service';
import { DateRange } from '@/shared/domain/value-objects/date-range';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

import type {
  MemberLedgerEntryDetailReadModel,
  MemberLedgerEntryPaginatedExtraModel,
  MemberLedgerEntryPaginatedModel,
} from '../member-ledger.types';

import { MemberLedgerEntryEntity } from '../domain/member-ledger-entry.entity';
import { MemberLedgerRepository } from '../member-ledger.repository';

// Types that represent negative amounts (debits)
const DEBIT_TYPES: string[] = [
  MemberLedgerEntryType.DUE_APPLY_DEBIT,
  MemberLedgerEntryType.BALANCE_APPLY_DEBIT,
  MemberLedgerEntryType.REFUND_DEBIT,
  MemberLedgerEntryType.ADJUSTMENT_DEBIT,
];

// Types that represent positive amounts (credits)
const CREDIT_TYPES: string[] = [
  MemberLedgerEntryType.DEPOSIT_CREDIT,
  MemberLedgerEntryType.ADJUSTMENT_CREDIT,
];

@Injectable()
export class PrismaMemberLedgerRepository implements MemberLedgerRepository {
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly mapper: PrismaMappers,
  ) {}

  public async findById(id: UniqueId): Promise<MemberLedgerEntryEntity | null> {
    const memberLedgerEntry =
      await this.prismaService.memberLedgerEntry.findUnique({
        where: { id: id.value },
      });

    return memberLedgerEntry
      ? this.mapper.memberLedgerEntry.toDomain(memberLedgerEntry)
      : null;
  }

  public async findByIdOrThrow(id: UniqueId): Promise<MemberLedgerEntryEntity> {
    const memberLedgerEntry =
      await this.prismaService.memberLedgerEntry.findUniqueOrThrow({
        where: { id: id.value },
      });

    return this.mapper.memberLedgerEntry.toDomain(memberLedgerEntry);
  }

  public async findByIds(ids: UniqueId[]): Promise<MemberLedgerEntryEntity[]> {
    const memberLedgerEntries =
      await this.prismaService.memberLedgerEntry.findMany({
        where: { id: { in: ids.map((id) => id.value) } },
      });

    return memberLedgerEntries.map((memberLedgerEntry) =>
      this.mapper.memberLedgerEntry.toDomain(memberLedgerEntry),
    );
  }

  public async findDetailById(
    id: string,
  ): Promise<MemberLedgerEntryDetailReadModel | null> {
    const entry = await this.prismaService.memberLedgerEntry.findUnique({
      include: { member: { include: { user: true } } },
      where: { id },
    });

    if (!entry) {
      return null;
    }

    return {
      amount: entry.amount,
      createdAt: entry.createdAt,
      createdBy: entry.createdBy,
      date: entry.date,
      id: entry.id,
      memberId: entry.memberId,
      memberName: `${entry.member.user.lastName} ${entry.member.user.firstName}`,
      notes: entry.notes,
      paymentId: entry.paymentId,
      reversalOfId: entry.reversalOfId,
      source: entry.source,
      status: entry.status,
      type: entry.type,
      updatedAt: entry.updatedAt,
      updatedBy: entry.updatedBy,
    };
  }

  public async findPaginated(
    params: GetPaginatedDataDto,
  ): Promise<
    PaginatedDataResultDto<
      MemberLedgerEntryPaginatedModel,
      MemberLedgerEntryPaginatedExtraModel
    >
  > {
    const { orderBy, where } = this.buildWhereAndOrderBy(params);

    const query = {
      include: {
        member: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
      orderBy,
      skip: (params.page - 1) * params.pageSize,
      take: params.pageSize,
      where,
    } satisfies MemberLedgerEntryFindManyArgs;

    const [entries, total, inflowSum, outflowSum] = await Promise.all([
      this.prismaService.memberLedgerEntry.findMany(query),
      this.prismaService.memberLedgerEntry.count({ where }),
      this.prismaService.memberLedgerEntry.aggregate({
        _sum: { amount: true },
        where: {
          ...where,
          status: MemberLedgerEntryStatus.POSTED,
          type: { in: CREDIT_TYPES },
        },
      }),
      this.prismaService.memberLedgerEntry.aggregate({
        _sum: { amount: true },
        where: {
          ...where,
          status: MemberLedgerEntryStatus.POSTED,
          type: { in: DEBIT_TYPES },
        },
      }),
    ]);

    const totalInflow = inflowSum._sum.amount ?? 0;
    const totalOutflow = outflowSum._sum.amount ?? 0;
    const totalAmount = totalInflow - totalOutflow;

    return {
      data: entries.map((entry) => ({
        amount: entry.amount,
        createdAt: entry.createdAt,
        date: entry.date,
        id: entry.id,
        memberFullName: `${entry.member.user.lastName} ${entry.member.user.firstName}`,
        memberId: entry.memberId,
        notes: entry.notes,
        paymentId: entry.paymentId,
        source: entry.source,
        status: entry.status,
        type: entry.type,
      })),
      extra: {
        totalAmount,
        totalAmountInflow: totalInflow,
        totalAmountOutflow: totalOutflow,
      },
      total,
    };
  }

  public async save(entity: MemberLedgerEntryEntity): Promise<void> {
    const create = this.mapper.memberLedgerEntry.toCreateInput(entity);
    const update = this.mapper.memberLedgerEntry.toUpdateInput(entity);

    await this.prismaService.memberLedgerEntry.upsert({
      create,
      update,
      where: { id: entity.id.value },
    });
  }

  private buildWhereAndOrderBy(params: GetPaginatedDataDto): {
    orderBy: MemberLedgerEntryOrderByWithRelationInput[];
    where: MemberLedgerEntryWhereInput;
  } {
    const where: MemberLedgerEntryWhereInput = {};

    if (params.filters?.createdAt) {
      const dateRangeResult = DateRange.fromUserInput(
        params.filters.createdAt[0],
        params.filters.createdAt[1],
      );

      if (dateRangeResult.isErr()) {
        throw dateRangeResult.error;
      }

      where.createdAt = {
        gte: dateRangeResult.value.start,
        lt: dateRangeResult.value.end,
      };
    }

    if (params.filters?.date) {
      where.date = {
        gte: params.filters.date[0],
        lte: params.filters.date[1],
      };
    }

    if (params.filters?.memberId) {
      where.memberId = { in: params.filters.memberId };
    }

    if (params.filters?.type) {
      where.type = { in: params.filters.type };
    }

    if (params.filters?.status) {
      where.status = { in: params.filters.status };
    }

    if (params.filters?.source) {
      where.source = { in: params.filters.source };
    }

    const orderBy: MemberLedgerEntryOrderByWithRelationInput[] =
      params.sort.map(({ field, order }) => ({ [field]: order }));

    return { orderBy, where };
  }
}
