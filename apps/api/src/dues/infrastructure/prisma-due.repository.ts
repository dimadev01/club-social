import type {
  ExportDataDto,
  GetPaginatedDataDto,
  PaginatedDataResultDto,
} from '@club-social/shared/types';

import {
  DueCategory,
  DueSettlementStatus,
  DueStatus,
} from '@club-social/shared/dues';
import { MemberStatus } from '@club-social/shared/members';
import { Injectable } from '@nestjs/common';

import {
  DueFindManyArgs,
  DueGetPayload,
  DueOrderByWithRelationInput,
  DueWhereInput,
} from '@/infrastructure/database/prisma/generated/models';
import { PrismaService } from '@/infrastructure/database/prisma/prisma.service';
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

  public async findById(id: UniqueId): Promise<DueEntity | null> {
    const due = await this.prismaService.due.findUnique({
      include: { settlements: true },
      where: { id: id.value },
    });

    if (!due) {
      return null;
    }

    return this.dueMapper.toDomain(due);
  }

  public async findByIdOrThrow(id: UniqueId): Promise<DueEntity> {
    const due = await this.prismaService.due.findUniqueOrThrow({
      include: { settlements: true },
      where: { id: id.value },
    });

    return this.dueMapper.toDomain(due);
  }

  public async findByIdReadModel(id: UniqueId): Promise<DueReadModel | null> {
    const due = await this.prismaService.due.findUnique({
      include: {
        member: { include: { user: true } },
        settlements: {
          include: { memberLedgerEntry: true, payment: true },
          orderBy: { memberLedgerEntry: { date: 'desc' } },
        },
      },
      where: { id: id.value },
    });

    return due ? this.toReadModel(due) : null;
  }

  public async findByIds(ids: UniqueId[]): Promise<DueEntity[]> {
    const dues = await this.prismaService.due.findMany({
      include: { settlements: true },
      where: {
        id: { in: ids.map((id) => id.value) },
      },
    });

    return dues.map((due) => this.dueMapper.toDomain(due));
  }

  public async findByMemberId(memberId: UniqueId): Promise<DueEntity[]> {
    const dues = await this.prismaService.due.findMany({
      include: { settlements: true },
      where: {
        memberId: memberId.value,
      },
    });

    return dues.map((due) => this.dueMapper.toDomain(due));
  }

  public async findForExport(
    params: ExportDataDto,
  ): Promise<DuePaginatedReadModel[]> {
    const { orderBy, where } = this.buildWhereAndOrderBy(params);

    const dues = await this.prismaService.due.findMany({
      include: { member: { include: { user: true } } },
      orderBy,
      where,
    });

    return dues.map((due) => this.toPaginatedReadModel(due));
  }

  public async findPaginated(
    params: GetPaginatedDataDto,
  ): Promise<
    PaginatedDataResultDto<DuePaginatedReadModel, DuePaginatedExtraReadModel>
  > {
    const { orderBy, where } = this.buildWhereAndOrderBy(params);

    const query = {
      include: { member: { include: { user: true } } },
      orderBy,
      skip: (params.page - 1) * params.pageSize,
      take: params.pageSize,
      where,
    } satisfies DueFindManyArgs;

    const [dues, total, totalAmount] = await Promise.all([
      this.prismaService.due.findMany(query),
      this.prismaService.due.count({ where }),
      this.prismaService.due.aggregate({ _sum: { amount: true }, where }),
    ]);

    return {
      data: dues.map((due) => this.toPaginatedReadModel(due)),
      extra: {
        totalAmount: totalAmount._sum.amount ?? 0,
      },
      total,
    };
  }

  public async findPending(): Promise<DueEntity[]> {
    const dues = await this.prismaService.due.findMany({
      include: { settlements: true },
      where: {
        status: {
          in: [DueStatus.PENDING, DueStatus.PARTIALLY_PAID],
        },
      },
    });

    return dues.map((due) => this.dueMapper.toDomain(due));
  }

  public async findPendingByMemberId(memberId: UniqueId): Promise<DueEntity[]> {
    const dues = await this.prismaService.due.findMany({
      include: { settlements: true },
      where: {
        memberId: memberId.value,
        status: {
          in: [DueStatus.PENDING, DueStatus.PARTIALLY_PAID],
        },
      },
    });

    return dues.map((due) => this.dueMapper.toDomain(due));
  }

  public async save(entity: DueEntity): Promise<void> {
    const create = this.dueMapper.toCreateInput(entity);
    const update = this.dueMapper.toUpdateInput(entity);

    const settlementUpserts = this.dueSettlementMapper.toUpserts(entity);

    await this.prismaService.$transaction(async (tx) => {
      await tx.due.upsert({
        create: create,
        update: update,
        where: { id: entity.id.value },
      });

      for (const settlementUpsert of settlementUpserts) {
        await tx.dueSettlement.upsert({
          create: settlementUpsert.create,
          update: settlementUpsert.update,
          where: settlementUpsert.where,
        });
      }
    });
  }

  private buildWhereAndOrderBy(params: ExportDataDto): {
    orderBy: DueOrderByWithRelationInput[];
    where: DueWhereInput;
  } {
    const where: DueWhereInput = {};

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
    } else if (params.filters?.memberStatus) {
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

    const orderBy: DueOrderByWithRelationInput[] = [];

    params.sort.forEach(({ field, order }) => {
      orderBy.push({ [field]: order });
    });

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
        memberLedgerEntry: {
          date: settlement.memberLedgerEntry.date,
          id: settlement.memberLedgerEntry.id,
        },
        payment: settlement.payment ? { id: settlement.payment.id } : null,
        status: settlement.status as DueSettlementStatus,
      })),
      id: due.id,
      member: {
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
