import type {
  ExportRequest,
  PaginatedRequest,
  PaginatedResponse,
} from '@club-social/shared/types';

import { DueStatus } from '@club-social/shared/dues';
import { Injectable } from '@nestjs/common';

import {
  DueFindManyArgs,
  DueOrderByWithRelationInput,
  DueWhereInput,
} from '@/infrastructure/database/prisma/generated/models';
import { PrismaMappers } from '@/infrastructure/database/prisma/prisma.mappers';
import { PrismaService } from '@/infrastructure/database/prisma/prisma.service';
import { DateRange } from '@/shared/domain/value-objects/date-range';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

import { DueRepository } from '../domain/due.repository';
import {
  DueDetailModel,
  DuePaginatedModel,
  PaymentDueDetailModel,
} from '../domain/due.types';
import { DueEntity } from '../domain/entities/due.entity';

@Injectable()
export class PrismaDueRepository implements DueRepository {
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly mapper: PrismaMappers,
  ) {}

  public async findByMemberId(memberId: UniqueId): Promise<DueEntity[]> {
    const dues = await this.prismaService.due.findMany({
      include: { paymentDues: true },
      where: {
        deletedAt: null,
        memberId: memberId.value,
      },
    });

    return dues.map((due) => this.mapper.due.toDomain(due));
  }

  public async findForExport(
    params: ExportRequest,
  ): Promise<DuePaginatedModel[]> {
    const { orderBy, where } = this.buildWhereAndOrderBy(params);

    const dues = await this.prismaService.due.findMany({
      include: { member: { include: { user: true } }, paymentDues: true },
      orderBy,
      where,
    });

    return dues.map((due) => ({
      due: this.mapper.due.toDomain(due),
      member: this.mapper.member.toDomain(due.member),
      user: this.mapper.user.toDomain(due.member.user),
    }));
  }

  public async findManyByIdsModels(ids: UniqueId[]): Promise<DueDetailModel[]> {
    const dues = await this.prismaService.due.findMany({
      include: { member: { include: { user: true } }, paymentDues: true },
      where: {
        deletedAt: null,
        id: { in: ids.map((id) => id.value) },
      },
    });

    return dues.map((due) => ({
      due: this.mapper.due.toDomain(due),
      member: this.mapper.member.toDomain(due.member),
      user: this.mapper.user.toDomain(due.member.user),
    }));
  }

  public async findOneModel(id: UniqueId): Promise<DueDetailModel | null> {
    const due = await this.prismaService.due.findUnique({
      include: { member: { include: { user: true } }, paymentDues: true },
      where: { deletedAt: null, id: id.value },
    });

    if (!due) {
      return null;
    }

    return {
      due: this.mapper.due.toDomain(due),
      member: this.mapper.member.toDomain(due.member),
      user: this.mapper.user.toDomain(due.member.user),
    };
  }

  public async findPaginated(
    params: PaginatedRequest,
  ): Promise<PaginatedResponse<DuePaginatedModel>> {
    const { orderBy, where } = this.buildWhereAndOrderBy(params);

    const query = {
      include: { member: { include: { user: true } } },
      orderBy,
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

  public async findPaymentDuesModel(
    dueId: UniqueId,
  ): Promise<PaymentDueDetailModel[]> {
    const paymentDues = await this.prismaService.paymentDue.findMany({
      include: { payment: true },
      where: { dueId: dueId.value },
    });

    return paymentDues.map((pd) => ({
      payment: this.mapper.payment.toDomain(pd.payment),
      paymentDue: this.mapper.paymentDue.toDomain(pd),
    }));
  }

  public async findPendingByMemberId(memberId: UniqueId): Promise<DueEntity[]> {
    const dues = await this.prismaService.due.findMany({
      include: { paymentDues: true },
      where: {
        deletedAt: null,
        memberId: memberId.value,
        status: {
          in: [DueStatus.PENDING, DueStatus.PARTIALLY_PAID],
        },
      },
    });

    return dues.map((due) => this.mapper.due.toDomain(due));
  }

  public async findUniqueById(id: UniqueId): Promise<DueEntity | null> {
    const due = await this.prismaService.due.findUnique({
      include: { paymentDues: true },
      where: { deletedAt: null, id: id.value },
    });

    if (!due) {
      return null;
    }

    return this.mapper.due.toDomain(due);
  }

  public async findUniqueByIds(ids: UniqueId[]): Promise<DueEntity[]> {
    const dues = await this.prismaService.due.findMany({
      include: { paymentDues: true },
      where: {
        deletedAt: null,
        id: { in: ids.map((id) => id.value) },
      },
    });

    return dues.map((due) => this.mapper.due.toDomain(due));
  }

  public async findUniqueOrThrow(id: UniqueId): Promise<DueEntity> {
    const due = await this.prismaService.due.findUniqueOrThrow({
      include: { paymentDues: true },
      where: { deletedAt: null, id: id.value },
    });

    return this.mapper.due.toDomain(due);
  }

  public async save(entity: DueEntity): Promise<DueEntity> {
    const data = this.mapper.due.toPersistence(entity);
    const { member: _member, paymentDues, ...dueData } = data;

    await this.prismaService.$transaction(async (tx) => {
      await tx.due.upsert({
        create: dueData,
        update: dueData,
        where: { id: entity.id.value },
      });

      await Promise.all(
        (paymentDues ?? []).map((pd) =>
          tx.paymentDue.upsert({
            create: {
              amount: pd.amount,
              dueId: entity.id.value,
              paymentId: pd.paymentId,
              status: pd.status,
            },
            update: {
              amount: pd.amount,
              status: pd.status,
            },
            where: {
              paymentId_dueId: {
                dueId: entity.id.value,
                paymentId: pd.paymentId,
              },
            },
          }),
        ),
      );
    });

    return entity;
  }

  private buildWhereAndOrderBy(params: ExportRequest): {
    orderBy: DueOrderByWithRelationInput[];
    where: DueWhereInput;
  } {
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

    const orderBy: DueOrderByWithRelationInput[] = [];

    params.sort.forEach(({ field, order }) => {
      orderBy.push({ [field]: order });
    });

    return { orderBy, where };
  }
}
