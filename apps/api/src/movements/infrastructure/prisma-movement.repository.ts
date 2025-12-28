import type {
  ExportDataDto,
  GetPaginatedDataDto,
  PaginatedDataResultDto,
} from '@club-social/shared/types';

import {
  MovementCategory,
  MovementMode,
  MovementStatus,
  MovementType,
} from '@club-social/shared/movements';
import { Injectable } from '@nestjs/common';

import {
  MovementFindManyArgs,
  MovementModel,
  MovementOrderByWithRelationInput,
  MovementWhereInput,
} from '@/infrastructure/database/prisma/generated/models';
import { PrismaMappers } from '@/infrastructure/database/prisma/prisma.mappers';
import { PrismaService } from '@/infrastructure/database/prisma/prisma.service';
import { FindForStatisticsParams } from '@/shared/domain/repository-types';
import { DateOnly } from '@/shared/domain/value-objects/date-only/date-only.vo';
import { DateRange } from '@/shared/domain/value-objects/date-range';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

import { MovementEntity } from '../domain/entities/movement.entity';
import {
  MovementPaginatedExtraReadModel,
  MovementPaginatedReadModel,
  MovementReadModel,
} from '../domain/movement-read-models';
import { MovementRepository } from '../domain/movement.repository';
import { MovementStatisticsModel } from '../domain/movement.types';

const SYSTEM_START_DATE = '2022-01-01';

@Injectable()
export class PrismaMovementRepository implements MovementRepository {
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly mapper: PrismaMappers,
  ) {}

  public async findById(id: UniqueId): Promise<MovementEntity | null> {
    const movement = await this.prismaService.movement.findUnique({
      where: { id: id.value },
    });

    return movement ? this.mapper.movement.toDomain(movement) : null;
  }

  public async findByIdOrThrow(id: UniqueId): Promise<MovementEntity> {
    const movement = await this.prismaService.movement.findUniqueOrThrow({
      where: { id: id.value },
    });

    return this.mapper.movement.toDomain(movement);
  }

  public async findByIdReadModel(
    id: UniqueId,
  ): Promise<MovementReadModel | null> {
    const movement = await this.prismaService.movement.findUnique({
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

    return movements.map((m) => this.mapper.movement.toDomain(m));
  }

  public async findByPaymentId(
    paymentId: UniqueId,
  ): Promise<MovementEntity | null> {
    const movement = await this.prismaService.movement.findFirst({
      where: {
        paymentId: paymentId.value,
      },
    });

    return movement ? this.mapper.movement.toDomain(movement) : null;
  }

  public async findForExport(
    params: ExportDataDto,
  ): Promise<MovementPaginatedReadModel[]> {
    const { orderBy, where } = this.buildWhereAndOrderBy(params);

    const movements = await this.prismaService.movement.findMany({
      orderBy,
      where,
    });

    return movements.map((m) => this.toReadModel(m));
  }

  public async findForStatistics(
    params: FindForStatisticsParams,
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
        where: { ...where, type: MovementType.INFLOW },
      }),
      this.prismaService.movement.aggregate({
        _sum: { amount: true },
        where: { ...where, type: MovementType.OUTFLOW },
      }),
    ]);

    const totalInflow = inflowSum._sum.amount ?? 0;
    const totalOutflow = outflowSum._sum.amount ?? 0;
    const balance = totalInflow - totalOutflow;

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
      orderBy,
      skip: (params.page - 1) * params.pageSize,
      take: params.pageSize,
      where,
    } satisfies MovementFindManyArgs;

    const [movements, total, totalAmountInflow, totalAmountOutflow] =
      await Promise.all([
        this.prismaService.movement.findMany(query),
        this.prismaService.movement.count({ where }),
        this.prismaService.movement.aggregate({
          _sum: { amount: true },
          where: { ...where, type: MovementType.INFLOW },
        }),
        this.prismaService.movement.aggregate({
          _sum: { amount: true },
          where: { ...where, type: MovementType.OUTFLOW },
        }),
      ]);

    const totalInflow = totalAmountInflow._sum.amount ?? 0;
    const totalOutflow = totalAmountOutflow._sum.amount ?? 0;
    const totalAmount = totalInflow - totalOutflow;

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

  public async save(entity: MovementEntity): Promise<void> {
    const create = this.mapper.movement.toCreateInput(entity);
    const update = this.mapper.movement.toUpdateInput(entity);

    await this.prismaService.movement.upsert({
      create,
      update,
      where: { id: entity.id.value },
    });
  }

  private buildWhereAndOrderBy(params: ExportDataDto): {
    orderBy: MovementOrderByWithRelationInput[];
    where: MovementWhereInput;
  } {
    const where: MovementWhereInput = {};

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

    if (params.filters?.type) {
      where.type = { in: params.filters.type };
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

    const orderBy: MovementOrderByWithRelationInput[] = params.sort.map(
      ({ field, order }) => ({ [field]: order }),
    );

    return { orderBy, where };
  }

  private toReadModel(model: MovementModel): MovementReadModel {
    return {
      amount: model.amount,
      category: model.category as MovementCategory,
      createdAt: model.createdAt,
      createdBy: model.createdBy,
      date: model.date,
      id: model.id,
      mode: model.mode as MovementMode,
      notes: model.notes,
      paymentId: model.paymentId,
      status: model.status as MovementStatus,
      type: model.type as MovementType,
      updatedAt: model.updatedAt,
      updatedBy: model.updatedBy,
      voidedAt: model.voidedAt,
      voidedBy: model.voidedBy,
      voidReason: model.voidReason,
    };
  }
}
