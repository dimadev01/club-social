import type { PaginatedResponse } from '@club-social/shared/types';

import { Injectable } from '@nestjs/common';

import {
  DueFindManyArgs,
  DueWhereInput,
} from '@/infrastructure/database/prisma/generated/models';
import { PrismaService } from '@/infrastructure/database/prisma/prisma.service';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

import { DuePaginatedRequest, DueRepository } from '../domain/due.repository';
import { DueEntity } from '../domain/entities/due.entity';
import { PrismaDueMapper } from './prisma-due.mapper';

@Injectable()
export class PrismaDueRepository implements DueRepository {
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly mapper: PrismaDueMapper,
  ) {}

  public async findByMemberId(memberId: UniqueId): Promise<DueEntity[]> {
    const dues = await this.prismaService.due.findMany({
      where: {
        deletedAt: null,
        memberId: memberId.value,
      },
    });

    return dues.map((due) => this.mapper.toDomain(due));
  }

  public async findManyByIds(ids: UniqueId[]): Promise<DueEntity[]> {
    const dues = await this.prismaService.due.findMany({
      where: {
        deletedAt: null,
        id: { in: ids.map((id) => id.value) },
      },
    });

    return dues.map((due) => this.mapper.toDomain(due));
  }

  public async findOneById(id: UniqueId): Promise<DueEntity | null> {
    const due = await this.prismaService.due.findUnique({
      where: { deletedAt: null, id: id.value },
    });

    if (!due) {
      return null;
    }

    return this.mapper.toDomain(due);
  }

  public async findOneByIdOrThrow(id: UniqueId): Promise<DueEntity> {
    const due = await this.prismaService.due.findUniqueOrThrow({
      where: { deletedAt: null, id: id.value },
    });

    return this.mapper.toDomain(due);
  }

  public async findPaginated(
    params: DuePaginatedRequest,
  ): Promise<PaginatedResponse<DueEntity>> {
    const where: DueWhereInput = {
      deletedAt: null,
      ...(params.category && { category: params.category }),
      ...(params.memberId && { memberId: params.memberId }),
      ...(params.status && { status: params.status }),
    };

    const query: DueFindManyArgs = {
      orderBy: [
        ...params.sort.map(({ field, order }) => ({ [field]: order })),
        { createdAt: 'desc' },
      ],
      skip: (params.page - 1) * params.pageSize,
      take: params.pageSize,
      where,
    };

    const [dues, total] = await Promise.all([
      this.prismaService.due.findMany(query),
      this.prismaService.due.count({ where }),
    ]);

    return {
      data: dues.map((due) => this.mapper.toDomain(due)),
      total,
    };
  }

  public async save(entity: DueEntity): Promise<DueEntity> {
    const data = this.mapper.toPersistence(entity);

    const due = await this.prismaService.due.upsert({
      create: data,
      update: data,
      where: { id: entity.id.value },
    });

    return this.mapper.toDomain(due);
  }
}
