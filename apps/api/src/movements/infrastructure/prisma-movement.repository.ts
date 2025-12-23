import type {
  ExportRequest,
  PaginatedRequest,
  PaginatedResponse,
} from '@club-social/shared/types';

import { MovementType } from '@club-social/shared/movements';
import { Injectable } from '@nestjs/common';

import {
  MovementFindManyArgs,
  MovementOrderByWithRelationInput,
  MovementWhereInput,
} from '@/infrastructure/database/prisma/generated/models';
import { PrismaMappers } from '@/infrastructure/database/prisma/prisma.mappers';
import { PrismaService } from '@/infrastructure/database/prisma/prisma.service';
import { DateRange } from '@/shared/domain/value-objects/date-range';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

import { MovementEntity } from '../domain/entities/movement.entity';
import { MovementRepository } from '../domain/movement.repository';
import { MovementPaginatedSummaryModel } from '../domain/movement.types';

@Injectable()
export class PrismaMovementRepository implements MovementRepository {
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly mapper: PrismaMappers,
  ) {}

  public async findByPaymentId(
    paymentId: UniqueId,
  ): Promise<MovementEntity | null> {
    const movement = await this.prismaService.movement.findFirst({
      where: {
        deletedAt: null,
        paymentId: paymentId.value,
      },
    });

    return movement ? this.mapper.movement.toDomain(movement) : null;
  }

  public async findForExport(params: ExportRequest): Promise<MovementEntity[]> {
    const { orderBy, where } = this.buildWhereAndOrderBy(params);

    const movements = await this.prismaService.movement.findMany({
      orderBy,
      where,
    });

    return movements.map((m) => this.mapper.movement.toDomain(m));
  }

  public async findPaginated(
    params: PaginatedRequest,
  ): Promise<PaginatedResponse<MovementEntity, MovementPaginatedSummaryModel>> {
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
      data: movements.map((m) => this.mapper.movement.toDomain(m)),
      summary: {
        totalAmount,
        totalAmountInflow: totalInflow,
        totalAmountOutflow: totalOutflow,
      },
      total,
    };
  }

  public async findUniqueById(id: UniqueId): Promise<MovementEntity | null> {
    const movement = await this.prismaService.movement.findUnique({
      where: { deletedAt: null, id: id.value },
    });

    return movement ? this.mapper.movement.toDomain(movement) : null;
  }

  public async findUniqueByIds(ids: UniqueId[]): Promise<MovementEntity[]> {
    const movements = await this.prismaService.movement.findMany({
      where: {
        deletedAt: null,
        id: { in: ids.map((id) => id.value) },
      },
    });

    return movements.map((m) => this.mapper.movement.toDomain(m));
  }

  public async findUniqueOrThrow(id: UniqueId): Promise<MovementEntity> {
    const movement = await this.prismaService.movement.findUniqueOrThrow({
      where: { deletedAt: null, id: id.value },
    });

    return this.mapper.movement.toDomain(movement);
  }

  public async save(entity: MovementEntity): Promise<MovementEntity> {
    const data = this.mapper.movement.toPersistence(entity);

    const movement = await this.prismaService.movement.upsert({
      create: data,
      update: data,
      where: { id: entity.id.value },
    });

    return this.mapper.movement.toDomain(movement);
  }

  private buildWhereAndOrderBy(params: ExportRequest): {
    orderBy: MovementOrderByWithRelationInput[];
    where: MovementWhereInput;
  } {
    const where: MovementWhereInput = { deletedAt: null };

    if (params.filters?.createdAt) {
      const dateRangeResult = DateRange.fromUserInput(
        params.filters.createdAt[0],
        params.filters.createdAt[1],
      );

      if (dateRangeResult.isErr()) {
        throw dateRangeResult.error;
      }

      where.createdAt = dateRangeResult.value.toPrismaFilter();
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

    const orderBy: MovementOrderByWithRelationInput[] = params.sort.map(
      ({ field, order }) => ({ [field]: order }),
    );

    return { orderBy, where };
  }
}
