import type {
  PaginatedRequest,
  PaginatedResponse,
} from '@club-social/shared/types';

import { Injectable } from '@nestjs/common';

import {
  MovementOrderByWithRelationInput,
  MovementWhereInput,
} from '@/infrastructure/database/prisma/generated/models';
import { PrismaMappers } from '@/infrastructure/database/prisma/prisma.mappers';
import { PrismaService } from '@/infrastructure/database/prisma/prisma.service';
import { DateRange } from '@/shared/domain/value-objects/date-range';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

import { MovementEntity } from '../domain/entities/movement.entity';
import { MovementRepository } from '../domain/movement.repository';

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

  public async findPaginated(
    params: PaginatedRequest,
  ): Promise<PaginatedResponse<MovementEntity>> {
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

    const [movements, total] = await Promise.all([
      this.prismaService.movement.findMany({
        orderBy,
        skip: (params.page - 1) * params.pageSize,
        take: params.pageSize,
        where,
      }),
      this.prismaService.movement.count({ where }),
    ]);

    return {
      data: movements.map((m) => this.mapper.movement.toDomain(m)),
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
}
