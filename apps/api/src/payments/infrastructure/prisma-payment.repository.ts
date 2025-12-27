import type {
  ExportRequest,
  PaginatedRequest,
  PaginatedResponse,
} from '@club-social/shared/types';

import { PaymentDueStatus } from '@club-social/shared/payment-due';
import { PaymentStatus } from '@club-social/shared/payments';
import { Injectable } from '@nestjs/common';

import {
  DueSettlementWhereInput,
  PaymentFindManyArgs,
  PaymentOrderByWithRelationInput,
  PaymentWhereInput,
} from '@/infrastructure/database/prisma/generated/models';
import { PrismaMappers } from '@/infrastructure/database/prisma/prisma.mappers';
import { PrismaService } from '@/infrastructure/database/prisma/prisma.service';
import { Guard } from '@/shared/domain/guards';
import { FindForStatisticsParams } from '@/shared/domain/repository-types';
import { DateRange } from '@/shared/domain/value-objects/date-range';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

import { PaymentEntity } from '../domain/entities/payment.entity';
import { PaymentRepository } from '../domain/payment.repository';
import {
  PaymentDetailModel,
  PaymentDueDetailModel,
  PaymentPaginatedExtraModel,
  PaymentPaginatedModel,
  PaymentStatisticsModel,
} from '../domain/payment.types';

@Injectable()
export class PrismaPaymentRepository implements PaymentRepository {
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly mapper: PrismaMappers,
  ) {}

  public async findForExport(
    params: ExportRequest,
  ): Promise<PaymentPaginatedModel[]> {
    const { orderBy, where } = this.buildWhereAndOrderBy(params);

    const payments = await this.prismaService.payment.findMany({
      include: { member: { include: { user: true } } },
      orderBy,
      where,
    });

    return payments.map((payment) => ({
      member: this.mapper.member.toDomain(payment.member),
      payment: this.mapper.payment.toDomain(payment),
      user: this.mapper.user.toDomain(payment.member.user),
    }));
  }

  public async findForStatistics(
    params: FindForStatisticsParams,
  ): Promise<PaymentStatisticsModel[]> {
    const where: DueSettlementWhereInput = {
      payment: {
        deletedAt: null,
        status: PaymentStatus.PAID,
      },
      status: PaymentDueStatus.REGISTERED,
    };

    if (params.dateRange) {
      Guard.defined(where.payment);

      where.payment.date = {
        gte: params.dateRange[0],
        lte: params.dateRange[1],
      };
    }

    const settlements = await this.prismaService.dueSettlement.findMany({
      include: { due: true, payment: true },
      where: where,
    });

    return settlements.map((paymentDue) => {
      Guard.defined(paymentDue.payment);

      return {
        due: this.mapper.due.toDomain(paymentDue.due),
        dueSettlement: this.mapper.dueSettlement.toDomain(paymentDue),
        payment: this.mapper.payment.toDomain(paymentDue.payment),
      };
    });
  }

  public async findOneModel(id: UniqueId): Promise<null | PaymentDetailModel> {
    const payment = await this.prismaService.payment.findUnique({
      include: { member: { include: { user: true } } },
      where: { deletedAt: null, id: id.value },
    });

    if (!payment) {
      return null;
    }

    return {
      member: this.mapper.member.toDomain(payment.member),
      payment: this.mapper.payment.toDomain(payment),
      user: this.mapper.user.toDomain(payment.member.user),
    };
  }

  public async findPaginated(
    params: PaginatedRequest,
  ): Promise<
    PaginatedResponse<PaymentPaginatedModel, PaymentPaginatedExtraModel>
  > {
    const { orderBy, where } = this.buildWhereAndOrderBy(params);

    const query = {
      include: {
        member: { include: { user: true } },
      },
      orderBy,
      skip: (params.page - 1) * params.pageSize,
      take: params.pageSize,
      where,
    } satisfies PaymentFindManyArgs;

    const [payments, total, totalAmount] = await Promise.all([
      this.prismaService.payment.findMany(query),
      this.prismaService.payment.count({ where }),
      this.prismaService.payment.aggregate({ _sum: { amount: true }, where }),
    ]);

    return {
      data: payments.map((payment) => ({
        member: this.mapper.member.toDomain(payment.member),
        payment: this.mapper.payment.toDomain(payment),
        user: this.mapper.user.toDomain(payment.member.user),
      })),
      extra: {
        totalAmount: totalAmount._sum.amount ?? 0,
      },
      total,
    };
  }

  public async findPaymentDuesModel(
    paymentId: UniqueId,
  ): Promise<PaymentDueDetailModel[]> {
    const settlements = await this.prismaService.dueSettlement.findMany({
      include: { due: true },
      where: { paymentId: paymentId.value },
    });

    return settlements.map((settlement) => ({
      due: this.mapper.due.toDomain(settlement.due),
      dueSettlement: this.mapper.dueSettlement.toDomain(settlement),
    }));
  }

  public async findUniqueById(id: UniqueId): Promise<null | PaymentEntity> {
    const payment = await this.prismaService.payment.findUnique({
      include: { settlements: true },
      where: { deletedAt: null, id: id.value },
    });

    if (!payment) {
      return null;
    }

    return this.mapper.payment.toDomain(payment);
  }

  public async findUniqueByIds(ids: UniqueId[]): Promise<PaymentEntity[]> {
    const payments = await this.prismaService.payment.findMany({
      include: { settlements: true },
      where: {
        deletedAt: null,
        id: { in: ids.map((id) => id.value) },
      },
    });

    return payments.map((payment) => this.mapper.payment.toDomain(payment));
  }

  public async findUniqueOrThrow(id: UniqueId): Promise<PaymentEntity> {
    const payment = await this.prismaService.payment.findUniqueOrThrow({
      include: { settlements: true },
      where: { deletedAt: null, id: id.value },
    });

    return this.mapper.payment.toDomain(payment);
  }

  public async save(entity: PaymentEntity): Promise<void> {
    const data = this.mapper.payment.toPersistence(entity);

    await this.prismaService.payment.upsert({
      create: data,
      update: data,
      where: { id: entity.id.value },
    });
  }

  private buildWhereAndOrderBy(params: ExportRequest): {
    orderBy: PaymentOrderByWithRelationInput[];
    where: PaymentWhereInput;
  } {
    const where: PaymentWhereInput = {
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
      where.settlements = {
        some: { due: { memberId: { in: params.filters.memberId } } },
      };
    }

    if (params.filters?.status) {
      where.status = { in: params.filters.status };
    }

    if (params.filters?.dueCategory) {
      where.settlements = {
        some: { due: { category: { in: params.filters.dueCategory } } },
      };
    }

    const orderBy: PaymentOrderByWithRelationInput[] = [];

    params.sort.forEach(({ field, order }) => {
      orderBy.push({ [field]: order });
    });

    return { orderBy, where };
  }
}
