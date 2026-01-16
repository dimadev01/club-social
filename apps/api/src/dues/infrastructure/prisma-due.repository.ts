import type {
  DateRangeDto,
  ExportDataDto,
  GetPaginatedDataDto,
  PaginatedDataResultDto,
} from '@club-social/shared/types';

import {
  DueCategory,
  DueSettlementStatus,
  DueStatus,
} from '@club-social/shared/dues';
import {
  MemberCategory,
  MemberLedgerEntrySource,
  MemberLedgerEntryStatus,
  MemberLedgerEntryType,
  MemberStatus,
} from '@club-social/shared/members';
import { Injectable } from '@nestjs/common';
import { sumBy } from 'es-toolkit/compat';

import {
  DueFindManyArgs,
  DueGetPayload,
  DueOrderByWithRelationInput,
  DueWhereInput,
} from '@/infrastructure/database/prisma/generated/models';
import { PrismaService } from '@/infrastructure/database/prisma/prisma.service';
import { PrismaClientLike } from '@/infrastructure/database/prisma/prisma.types';
import { EntityNotFoundError } from '@/shared/domain/errors/entity-not-found.error';
import { QueryContext } from '@/shared/domain/repository';
import { DateRange } from '@/shared/domain/value-objects/date-range';
import { Name } from '@/shared/domain/value-objects/name/name.vo';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

import {
  DuePaginatedExtraReadModel,
  DuePaginatedReadModel,
  DueReadModel,
} from '../domain/due-read-models';
import { DueRepository } from '../domain/due.repository';
import { DueEntity } from '../domain/entities/due.entity';
import { PrismaDueSettlementMapper } from './prisma-due-settlement.mapper';
import { PrismaDueMapper } from './prisma-due.mapper';

@Injectable()
export class PrismaDueRepository implements DueRepository {
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly dueMapper: PrismaDueMapper,
    private readonly dueSettlementMapper: PrismaDueSettlementMapper,
  ) {}

  public async findById(
    id: UniqueId,
    context?: QueryContext,
  ): Promise<DueEntity | null> {
    const where: DueWhereInput = { id: id.value };

    if (context?.memberId) {
      where.memberId = context.memberId.value;
    }

    const due = await this.prismaService.due.findFirst({
      include: { settlements: true },
      where,
    });

    if (!due) {
      return null;
    }

    return this.dueMapper.toDomain(due);
  }

  public async findByIdOrThrow(
    id: UniqueId,
    context?: QueryContext,
  ): Promise<DueEntity> {
    const where: DueWhereInput = { id: id.value };

    if (context?.memberId) {
      where.memberId = context.memberId.value;
    }

    const due = await this.findById(id, context);

    if (!due) {
      throw new EntityNotFoundError();
    }

    return due;
  }

  public async findByIdReadModel(
    id: UniqueId,
    context?: QueryContext,
  ): Promise<DueReadModel | null> {
    const where: DueWhereInput = { id: id.value };

    if (context?.memberId) {
      where.memberId = context.memberId.value;
    }

    const due = await this.prismaService.due.findFirst({
      include: {
        member: { include: { user: true } },
        settlements: {
          include: { memberLedgerEntry: true, payment: true },
          orderBy: { memberLedgerEntry: { date: 'desc' } },
        },
      },
      where,
    });

    return due ? this.toReadModel(due) : null;
  }

  public async findByIds(
    ids: UniqueId[],
    context?: QueryContext,
  ): Promise<DueEntity[]> {
    const where: DueWhereInput = { id: { in: ids.map((id) => id.value) } };

    if (context?.memberId) {
      where.memberId = context.memberId.value;
    }

    const dues = await this.prismaService.due.findMany({
      include: { settlements: true },
      where,
    });

    return dues.map((due) => this.dueMapper.toDomain(due));
  }

  public async findByIdsReadModel(
    ids: UniqueId[],
    context?: QueryContext,
  ): Promise<DueReadModel[]> {
    const where: DueWhereInput = { id: { in: ids.map((id) => id.value) } };

    if (context?.memberId) {
      where.memberId = context.memberId.value;
    }

    const dues = await this.prismaService.due.findMany({
      include: {
        member: { include: { user: true } },
        settlements: {
          include: { memberLedgerEntry: true, payment: true },
        },
      },
      where,
    });

    return dues.map((due) => this.toReadModel(due));
  }

  public async findForExport(
    params: ExportDataDto,
    context?: QueryContext,
  ): Promise<DuePaginatedReadModel[]> {
    const { orderBy, where } = this.buildWhereAndOrderBy(params, context);

    const dues = await this.prismaService.due.findMany({
      include: { member: { include: { user: true } } },
      orderBy,
      where,
    });

    return dues.map((due) => this.toPaginatedReadModel(due));
  }

  public async findPaginated(
    params: GetPaginatedDataDto,
    context?: QueryContext,
  ): Promise<
    PaginatedDataResultDto<DuePaginatedReadModel, DuePaginatedExtraReadModel>
  > {
    const { orderBy, where } = this.buildWhereAndOrderBy(params, context);

    const query = {
      include: { member: { include: { user: true } } },
      orderBy,
      skip: (params.page - 1) * params.pageSize,
      take: params.pageSize,
      where,
    } satisfies DueFindManyArgs;

    const [dues, total, pendingDues] = await Promise.all([
      this.prismaService.due.findMany(query),
      this.prismaService.due.count({ where }),
      this.prismaService.due.findMany({
        include: { settlements: true },
        where: {
          ...where,
          status: {
            in: [DueStatus.PENDING, DueStatus.PARTIALLY_PAID],
          },
        },
      }),
    ]);

    const pendingAmount = sumBy(
      pendingDues,
      (due) => this.dueMapper.toDomain(due).pendingAmount.cents,
    );

    return {
      data: dues.map((due) => this.toPaginatedReadModel(due)),
      extra: {
        pendingAmount,
      },
      total,
    };
  }

  public async findPendingByMemberId(memberId: UniqueId): Promise<DueEntity[]> {
    const dues = await this.prismaService.due.findMany({
      include: { settlements: true },
      orderBy: { date: 'asc' },
      where: {
        memberId: memberId.value,
        status: {
          in: [DueStatus.PENDING, DueStatus.PARTIALLY_PAID],
        },
      },
    });

    return dues.map((due) => this.dueMapper.toDomain(due));
  }

  public async findPendingForStatistics(
    params: DateRangeDto,
    context?: QueryContext,
  ): Promise<DueEntity[]> {
    const where: DueWhereInput = {
      member: {
        status: MemberStatus.ACTIVE,
      },
      status: {
        in: [DueStatus.PENDING, DueStatus.PARTIALLY_PAID],
      },
    };

    if (context?.memberId) {
      where.memberId = context.memberId.value;
    }

    if (params.dateRange) {
      where.date = {
        gte: params.dateRange[0],
        lte: params.dateRange[1],
      };
    }

    const dues = await this.prismaService.due.findMany({
      include: { settlements: true },
      where,
    });

    return dues.map((due) => this.dueMapper.toDomain(due));
  }

  public async save(entity: DueEntity, tx?: PrismaClientLike): Promise<void> {
    const client = tx ?? this.prismaService;

    const create = this.dueMapper.toCreateInput(entity);
    const update = this.dueMapper.toUpdateInput(entity);

    const settlementUpserts = this.dueSettlementMapper.toUpserts(entity);

    await client.due.upsert({
      create: create,
      update: update,
      where: { id: entity.id.value },
    });

    for (const settlementUpsert of settlementUpserts) {
      await client.dueSettlement.upsert({
        create: settlementUpsert.create,
        update: settlementUpsert.update,
        where: settlementUpsert.where,
      });
    }
  }

  private buildWhereAndOrderBy(
    params: ExportDataDto,
    context?: QueryContext,
  ): {
    orderBy: DueOrderByWithRelationInput[];
    where: DueWhereInput;
  } {
    const where: DueWhereInput = {};

    if (context?.memberId) {
      where.memberId = context.memberId.value;
    }

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

    if (!context?.memberId && params.filters?.memberId) {
      where.memberId = { in: params.filters.memberId };
    } else if (!context?.memberId && params.filters?.memberStatus) {
      where.member = {
        status: { in: params.filters.memberStatus },
      };
    }

    if (params.filters?.category) {
      where.category = { in: params.filters.category };
    }

    if (params.filters?.status) {
      where.status = { in: params.filters.status };
    }

    if (params.filters?.membersStatus) {
      where.member = {
        status: { in: params.filters.membersStatus },
      };
    }

    const orderBy: DueOrderByWithRelationInput[] = [
      ...params.sort.map(({ field, order }) => ({ [field]: order })),
      { createdAt: 'desc' },
    ];

    return { orderBy, where };
  }

  private toPaginatedReadModel(
    due: DueGetPayload<{
      include: { member: { include: { user: true } } };
    }>,
  ): DuePaginatedReadModel {
    return {
      amount: due.amount,
      category: due.category as DueCategory,
      createdAt: due.createdAt,
      date: due.date,
      id: due.id,
      member: {
        category: due.member.category as MemberCategory,
        id: due.member.id,
        name: Name.raw({
          firstName: due.member.user.firstName,
          lastName: due.member.user.lastName,
        }).fullName,
        status: due.member.status as MemberStatus,
      },
      status: due.status as DueStatus,
    };
  }

  private toReadModel(
    due: DueGetPayload<{
      include: {
        member: { include: { user: true } };
        settlements: { include: { memberLedgerEntry: true; payment: true } };
      };
    }>,
  ): DueReadModel {
    return {
      amount: due.amount,
      category: due.category as DueCategory,
      createdAt: due.createdAt,
      createdBy: due.createdBy,
      date: due.date,
      dueSettlements: due.settlements.map((settlement) => ({
        amount: settlement.amount,
        dueId: settlement.dueId,
        memberLedgerEntry: {
          date: settlement.memberLedgerEntry.date,
          id: settlement.memberLedgerEntry.id,
          source: settlement.memberLedgerEntry
            .source as MemberLedgerEntrySource,
          status: settlement.memberLedgerEntry
            .status as MemberLedgerEntryStatus,
          type: settlement.memberLedgerEntry.type as MemberLedgerEntryType,
        },
        payment: settlement.payment
          ? { date: settlement.payment.date, id: settlement.payment.id }
          : null,
        status: settlement.status as DueSettlementStatus,
      })),
      id: due.id,
      member: {
        category: due.member.category as MemberCategory,
        id: due.member.id,
        name: Name.raw({
          firstName: due.member.user.firstName,
          lastName: due.member.user.lastName,
        }).fullName,
        status: due.member.status as MemberStatus,
      },
      notes: due.notes,
      status: due.status as DueStatus,
      updatedAt: due.updatedAt,
      updatedBy: due.updatedBy,
      voidedAt: due.voidedAt,
      voidedBy: due.voidedBy,
      voidReason: due.voidReason,
    };
  }
}
