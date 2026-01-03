import type {
  ExportDataDto,
  GetPaginatedDataDto,
  PaginatedDataResultDto,
} from '@club-social/shared/types';

import { Injectable } from '@nestjs/common';

import {
  MemberLedgerEntryFindManyArgs,
  MemberLedgerEntryOrderByWithRelationInput,
  MemberLedgerEntryWhereInput,
} from '@/infrastructure/database/prisma/generated/models';
import { PrismaService } from '@/infrastructure/database/prisma/prisma.service';
import { PrismaClientLike } from '@/infrastructure/database/prisma/prisma.types';
import { QueryContext } from '@/shared/domain/repository';
import { SignedAmount } from '@/shared/domain/value-objects/amount/signed-amount.vo';
import { DateRange } from '@/shared/domain/value-objects/date-range';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

import type {
  MemberLedgerEntryDetailReadModel,
  MemberLedgerEntryPaginatedExtraModel,
  MemberLedgerEntryPaginatedModel,
} from '../member-ledger-entry-read-models';

import { MemberLedgerEntryEntity } from '../domain/member-ledger-entry.entity';
import { MemberLedgerRepository } from '../member-ledger.repository';
import { PrismaMemberLedgerEntryMapper } from './prisma-member-ledger.mapper';

@Injectable()
export class PrismaMemberLedgerRepository implements MemberLedgerRepository {
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly memberLedgerEntryMapper: PrismaMemberLedgerEntryMapper,
  ) {}

  public async findById(
    id: UniqueId,
    context?: QueryContext,
  ): Promise<MemberLedgerEntryEntity | null> {
    const where: MemberLedgerEntryWhereInput = { id: id.value };

    if (context?.memberId) {
      where.memberId = context.memberId.value;
    }

    const memberLedgerEntry =
      await this.prismaService.memberLedgerEntry.findFirst({
        where,
      });

    return memberLedgerEntry
      ? this.memberLedgerEntryMapper.toDomain(memberLedgerEntry)
      : null;
  }

  public async findByIdOrThrow(
    id: UniqueId,
    context?: QueryContext,
  ): Promise<MemberLedgerEntryEntity> {
    const where: MemberLedgerEntryWhereInput = { id: id.value };

    if (context?.memberId) {
      where.memberId = context.memberId.value;
    }

    const memberLedgerEntry =
      await this.prismaService.memberLedgerEntry.findFirstOrThrow({
        where,
      });

    return this.memberLedgerEntryMapper.toDomain(memberLedgerEntry);
  }

  public async findByIdReadModel(
    id: UniqueId,
    context?: QueryContext,
  ): Promise<MemberLedgerEntryDetailReadModel | null> {
    const where: MemberLedgerEntryWhereInput = { id: id.value };

    if (context?.memberId) {
      where.memberId = context.memberId.value;
    }

    const entry = await this.prismaService.memberLedgerEntry.findFirst({
      include: { member: { include: { user: true } } },
      where,
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

  public async findByIds(
    ids: UniqueId[],
    context?: QueryContext,
  ): Promise<MemberLedgerEntryEntity[]> {
    const where: MemberLedgerEntryWhereInput = {
      id: { in: ids.map((id) => id.value) },
    };

    if (context?.memberId) {
      where.memberId = context.memberId.value;
    }

    const memberLedgerEntries =
      await this.prismaService.memberLedgerEntry.findMany({
        where,
      });

    return memberLedgerEntries.map((memberLedgerEntry) =>
      this.memberLedgerEntryMapper.toDomain(memberLedgerEntry),
    );
  }

  public async findForExport(
    params: ExportDataDto,
    context?: QueryContext,
  ): Promise<MemberLedgerEntryPaginatedModel[]> {
    const { orderBy, where } = this.buildWhereAndOrderBy(params, context);

    const entries = await this.prismaService.memberLedgerEntry.findMany({
      include: { member: { include: { user: true } } },
      orderBy,
      where,
    });

    return entries.map((entry) => ({
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
    }));
  }

  public async findPaginated(
    params: GetPaginatedDataDto,
    context?: QueryContext,
  ): Promise<
    PaginatedDataResultDto<
      MemberLedgerEntryPaginatedModel,
      MemberLedgerEntryPaginatedExtraModel
    >
  > {
    const { orderBy, where } = this.buildWhereAndOrderBy(params, context);

    const query = {
      include: { member: { include: { user: true } } },
      orderBy,
      skip: (params.page - 1) * params.pageSize,
      take: params.pageSize,
      where,
    } satisfies MemberLedgerEntryFindManyArgs;

    const [entries, total, balanceSum] = await Promise.all([
      this.prismaService.memberLedgerEntry.findMany(query),
      this.prismaService.memberLedgerEntry.count({ where }),
      this.prismaService.memberLedgerEntry.aggregate({
        _sum: { amount: true },
        where,
      }),
    ]);

    const balance = balanceSum._sum.amount ?? 0;

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
      extra: { balance },
      total,
    };
  }

  public async getBalanceByMemberId(memberId: UniqueId): Promise<SignedAmount> {
    const balance = await this.prismaService.memberLedgerEntry.aggregate({
      _sum: { amount: true },
      where: { memberId: memberId.value },
    });

    return SignedAmount.raw({ cents: balance._sum.amount ?? 0 });
  }

  public async save(
    entity: MemberLedgerEntryEntity,
    tx?: PrismaClientLike,
  ): Promise<void> {
    const client = tx ?? this.prismaService;

    const create = this.memberLedgerEntryMapper.toCreateInput(entity);
    const update = this.memberLedgerEntryMapper.toUpdateInput(entity);

    await client.memberLedgerEntry.upsert({
      create,
      update,
      where: { id: entity.id.value },
    });
  }

  private buildWhereAndOrderBy(
    params: ExportDataDto | GetPaginatedDataDto,
    context?: QueryContext,
  ): {
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

    if (context?.memberId) {
      where.memberId = context.memberId.value;
    } else if (params.filters?.memberId) {
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
