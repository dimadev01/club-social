import type {
  ExportDataDto,
  GetPaginatedDataDto,
  PaginatedDataResultDto,
} from '@club-social/shared/types';

import { MathUtils } from '@club-social/shared/lib';
import {
  MovementByCategoryDto,
  MovementCategory,
  MovementMode,
  MovementMonthlyTrendItemDto,
  MovementStatus,
  MovementType,
} from '@club-social/shared/movements';
import { Injectable } from '@nestjs/common';

import { Prisma } from '@/infrastructure/database/prisma/generated/client';
import {
  MovementFindManyArgs,
  MovementGetPayload,
  MovementOrderByWithRelationInput,
  MovementWhereInput,
} from '@/infrastructure/database/prisma/generated/models';
import { PrismaService } from '@/infrastructure/database/prisma/prisma.service';
import { PrismaClientLike } from '@/infrastructure/database/prisma/prisma.types';
import { DateOnly } from '@/shared/domain/value-objects/date-only/date-only.vo';
import { DateRange } from '@/shared/domain/value-objects/date-range';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

import { MovementEntity } from '../domain/entities/movement.entity';
import {
  MovementPaginatedExtraReadModel,
  MovementPaginatedReadModel,
  MovementReadModel,
  MovementStatisticsModel,
} from '../domain/movement-read-models';
import {
  FindMovementsForStatisticsParams,
  MovementRepository,
} from '../domain/movement.repository';
import { PrismaMovementMapper } from './prisma-movement.mapper';

const SYSTEM_START_DATE = '2022-01-01';

@Injectable()
export class PrismaMovementRepository implements MovementRepository {
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly movementMapper: PrismaMovementMapper,
  ) {}

  public async findByCategory(params: {
    dateRange?: [string, string];
    type?: MovementType;
  }): Promise<MovementByCategoryDto> {
    const where: MovementWhereInput = {
      status: MovementStatus.REGISTERED,
    };

    if (params.dateRange) {
      where.date = { gte: params.dateRange[0], lte: params.dateRange[1] };
    }

    if (params.type === MovementType.INFLOW) {
      where.amount = { gt: 0 };
    } else if (params.type === MovementType.OUTFLOW) {
      where.amount = { lt: 0 };
    }

    const groups = await this.prismaService.movement.groupBy({
      _count: { _all: true },
      _sum: { amount: true },
      by: ['category'],
      where,
    });

    const total = groups.reduce(
      (sum, g) => sum + Math.abs(g._sum.amount ?? 0),
      0,
    );

    const categories = groups
      .map((g) => ({
        amount: Math.abs(g._sum.amount ?? 0),
        category: g.category as MovementCategory,
        count: g._count._all,
        percentage: MathUtils.percentage(Math.abs(g._sum.amount ?? 0), total),
      }))
      .sort((a, b) => b.amount - a.amount);

    return { categories, total };
  }

  public async findById(id: UniqueId): Promise<MovementEntity | null> {
    const movement = await this.prismaService.movement.findUnique({
      where: { id: id.value },
    });

    return movement ? this.movementMapper.toDomain(movement) : null;
  }

  public async findByIdOrThrow(id: UniqueId): Promise<MovementEntity> {
    const movement = await this.prismaService.movement.findUniqueOrThrow({
      where: { id: id.value },
    });

    return this.movementMapper.toDomain(movement);
  }

  public async findByIdReadModel(
    id: UniqueId,
  ): Promise<MovementReadModel | null> {
    const movement = await this.prismaService.movement.findUnique({
      include: { payment: true },
      where: { id: id.value },
    });

    return movement ? this.toReadModel(movement) : null;
  }

  public async findByIds(ids: UniqueId[]): Promise<MovementEntity[]> {
    const movements = await this.prismaService.movement.findMany({
      where: {
        id: { in: ids.map((id) => id.value) },
      },
    });

    return movements.map((m) => this.movementMapper.toDomain(m));
  }

  public async findByPaymentId(
    paymentId: UniqueId,
  ): Promise<MovementEntity | null> {
    const movement = await this.prismaService.movement.findFirst({
      where: {
        paymentId: paymentId.value,
      },
    });

    return movement ? this.movementMapper.toDomain(movement) : null;
  }

  public async findForExport(
    params: ExportDataDto,
  ): Promise<MovementPaginatedReadModel[]> {
    const { orderBy, where } = this.buildWhereAndOrderBy(params);

    const movements = await this.prismaService.movement.findMany({
      include: { payment: true },
      orderBy,
      where,
    });

    return movements.map((m) => this.toReadModel(m));
  }

  public async findForStatistics(
    params: FindMovementsForStatisticsParams,
  ): Promise<MovementStatisticsModel> {
    const where: MovementWhereInput = {
      status: MovementStatus.REGISTERED,
    };

    if (params.dateRange) {
      where.date = {
        gte: params.dateRange[0],
        lte: params.dateRange[1],
      };
    }

    const [inflowSum, outflowSum] = await Promise.all([
      this.prismaService.movement.aggregate({
        _sum: { amount: true },
        where: { ...where, amount: { gt: 0 } },
      }),
      this.prismaService.movement.aggregate({
        _sum: { amount: true },
        where: { ...where, amount: { lt: 0 } },
      }),
    ]);

    const totalInflow = inflowSum._sum.amount ?? 0;
    const totalOutflow = outflowSum._sum.amount ?? 0;
    const balance = totalInflow + totalOutflow;

    let cumulativeTotal = balance;

    if (params.includePreviousBalance && params.dateRange) {
      const to = DateOnly.raw({ value: params.dateRange[0] }).subtractDays(1);

      const { balance: previousBalance } = await this.findForStatistics({
        dateRange: [SYSTEM_START_DATE, to.value],
        includePreviousBalance: false,
      });
      cumulativeTotal += previousBalance;
    }

    return {
      balance,
      cumulativeTotal,
      totalInflow,
      totalOutflow,
    };
  }

  public async findMonthlyTrend(
    months: number,
  ): Promise<MovementMonthlyTrendItemDto[]> {
    interface RawRow {
      month: string;
      total_inflow: bigint | null;
      total_outflow: bigint | null;
    }

    const rows = await this.prismaService.$queryRaw<RawRow[]>(Prisma.sql`
      SELECT
        LEFT(date, 7) AS month,
        SUM(CASE WHEN amount > 0 THEN amount ELSE 0 END) AS total_inflow,
        SUM(CASE WHEN amount < 0 THEN amount ELSE 0 END) AS total_outflow
      FROM "movement"
      WHERE status = ${MovementStatus.REGISTERED}
        AND date >= TO_CHAR(
          DATE_TRUNC('month', CURRENT_DATE) - make_interval(months => ${months - 1}),
          'YYYY-MM-DD'
        )
      GROUP BY LEFT(date, 7)
      ORDER BY LEFT(date, 7) ASC
    `);

    return rows.map((row) => {
      const totalInflow = Number(row.total_inflow ?? 0);
      const totalOutflow = Number(row.total_outflow ?? 0);

      return {
        balance: totalInflow + totalOutflow,
        month: row.month,
        totalInflow,
        totalOutflow,
      };
    });
  }

  public async findPaginated(
    params: GetPaginatedDataDto,
  ): Promise<
    PaginatedDataResultDto<
      MovementPaginatedReadModel,
      MovementPaginatedExtraReadModel
    >
  > {
    const { orderBy, where } = this.buildWhereAndOrderBy(params);

    const query = {
      include: { payment: true },
      orderBy,
      skip: (params.page - 1) * params.pageSize,
      take: params.pageSize,
      where,
    } satisfies MovementFindManyArgs;

    const [movements, total, inflow, outflow] = await Promise.all([
      this.prismaService.movement.findMany(query),
      this.prismaService.movement.count({ where }),
      this.prismaService.movement.aggregate({
        _sum: { amount: true },
        where: { ...where, amount: { gt: 0 } },
      }),
      this.prismaService.movement.aggregate({
        _sum: { amount: true },
        where: { ...where, amount: { lt: 0 } },
      }),
    ]);

    const totalInflow = inflow._sum.amount ?? 0;
    const totalOutflow = outflow._sum.amount ?? 0;
    const totalAmount = totalInflow + totalOutflow;

    return {
      data: movements.map((m) => this.toReadModel(m)),
      extra: {
        totalAmount,
        totalAmountInflow: totalInflow,
        totalAmountOutflow: totalOutflow,
      },
      total,
    };
  }

  public async save(
    entity: MovementEntity,
    tx?: PrismaClientLike,
  ): Promise<void> {
    const client = tx ?? this.prismaService;

    const create = this.movementMapper.toCreateInput(entity);
    const update = this.movementMapper.toUpdateInput(entity);

    await client.movement.upsert({
      create,
      update,
      where: { id: entity.id.value },
    });
  }

  private buildWhereAndOrderBy(params: ExportDataDto): {
    orderBy: MovementOrderByWithRelationInput[];
    where: MovementWhereInput;
  } {
    const where: MovementWhereInput = {
      status: MovementStatus.REGISTERED,
    };

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

    if (params.filters?.category) {
      where.category = { in: params.filters.category };
    }

    if (params.filters?.status) {
      where.status = { in: params.filters.status };
    }

    if (params.filters?.mode) {
      where.mode = { in: params.filters.mode };
    }

    const orderBy: MovementOrderByWithRelationInput[] = [
      ...params.sort.map(({ field, order }) => ({ [field]: order })),
      { createdAt: 'desc' },
    ];

    return { orderBy, where };
  }

  private toReadModel(
    model: MovementGetPayload<{ include: { payment: true } }>,
  ): MovementReadModel {
    return {
      amount: model.amount,
      category: model.category as MovementCategory,
      createdAt: model.createdAt,
      createdBy: model.createdBy,
      date: model.date,
      id: model.id,
      mode: model.mode as MovementMode,
      notes: model.notes,
      payment: model.payment
        ? {
            id: model.payment.id,
            receiptNumber: model.payment.receiptNumber,
          }
        : null,
      status: model.status as MovementStatus,
      updatedAt: model.updatedAt,
      updatedBy: model.updatedBy,
      voidedAt: model.voidedAt,
      voidedBy: model.voidedBy,
      voidReason: model.voidReason,
    };
  }
}
