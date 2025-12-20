import type {
  PaginatedRequest,
  PaginatedResponse,
} from '@club-social/shared/types';

import { Injectable } from '@nestjs/common';

import {
  DueFindManyArgs,
  DueWhereInput,
} from '@/infrastructure/database/prisma/generated/models';
import { PrismaMappers } from '@/infrastructure/database/prisma/prisma.mappers';
import { PrismaService } from '@/infrastructure/database/prisma/prisma.service';
import { PaymentDueEntity } from '@/payments/domain/entities/payment-due.entity';
import { DateRange } from '@/shared/domain/value-objects/date-range';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

import { DueRepository } from '../domain/due.repository';
import { DuePaginatedModel } from '../domain/due.types';
import { DueEntity } from '../domain/entities/due.entity';

@Injectable()
export class PrismaDueRepository implements DueRepository {
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly mapper: PrismaMappers,
  ) {}

  public async findByMemberId(memberId: UniqueId): Promise<DueEntity[]> {
    const dues = await this.prismaService.due.findMany({
      where: {
        deletedAt: null,
        memberId: memberId.value,
      },
    });

    return dues.map((due) => this.mapper.due.toDomain(due));
  }

  public async findManyByIds(ids: UniqueId[]): Promise<DueEntity[]> {
    const dues = await this.prismaService.due.findMany({
      where: {
        deletedAt: null,
        id: { in: ids.map((id) => id.value) },
      },
    });

    return dues.map((due) => this.mapper.due.toDomain(due));
  }

  public async findOneById(id: UniqueId): Promise<DueEntity | null> {
    const due = await this.prismaService.due.findUnique({
      where: { deletedAt: null, id: id.value },
    });

    if (!due) {
      return null;
    }

    return this.mapper.due.toDomain(due);
  }

  public async findOneByIdOrThrow(id: UniqueId): Promise<DueEntity> {
    const due = await this.prismaService.due.findUniqueOrThrow({
      where: { deletedAt: null, id: id.value },
    });

    return this.mapper.due.toDomain(due);
  }

  public async findPaginated(
    params: PaginatedRequest,
  ): Promise<PaginatedResponse<DuePaginatedModel>> {
    const where: DueWhereInput = {
      deletedAt: null,
    };

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

    if (params.filters?.memberId) {
      where.memberId = { in: params.filters.memberId };
    } else if (params.filters?.userStatus) {
      where.member = {
        user: { status: { in: params.filters.userStatus } },
      };
    }

    if (params.filters?.category) {
      where.category = { in: params.filters.category };
    }

    if (params.filters?.status) {
      where.status = { in: params.filters.status };
    }

    const query = {
      include: { member: { include: { user: true } } },
      orderBy: params.sort.map(({ field, order }) => ({ [field]: order })),
      skip: (params.page - 1) * params.pageSize,
      take: params.pageSize,
      where,
    } satisfies DueFindManyArgs;

    const [dues, total] = await Promise.all([
      this.prismaService.due.findMany(query),
      this.prismaService.due.count({ where }),
    ]);

    return {
      data: dues.map((due) => ({
        due: this.mapper.due.toDomain(due),
        member: this.mapper.member.toDomain(due.member),
        user: this.mapper.user.toDomain(due.member.user),
      })),
      total,
    };
  }

  public async findPaymentDuesByDueId(
    dueId: UniqueId,
  ): Promise<PaymentDueEntity[]> {
    const paymentDues = await this.prismaService.paymentDue.findMany({
      where: { dueId: dueId.value },
    });

    return paymentDues.map((pd) => this.mapper.paymentDue.toDomain(pd));
  }

  public async save(entity: DueEntity): Promise<DueEntity> {
    const data = this.mapper.due.toPersistence(entity);

    const due = await this.prismaService.due.upsert({
      create: data,
      update: data,
      where: { id: entity.id.value },
    });

    return this.mapper.due.toDomain(due);
  }
}
