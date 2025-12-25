import type {
  ExportRequest,
  PaginatedRequest,
  PaginatedResponse,
} from '@club-social/shared/types';

import { DueCategory } from '@club-social/shared/dues';
import { PaymentDueStatus } from '@club-social/shared/payment-due';
import { PaymentStatus } from '@club-social/shared/payments';
import { Injectable } from '@nestjs/common';
import { groupBy, sumBy } from 'es-toolkit/compat';

import {
  PaymentDueWhereInput,
  PaymentFindManyArgs,
  PaymentOrderByWithRelationInput,
  PaymentWhereInput,
} from '@/infrastructure/database/prisma/generated/models';
import { PrismaMappers } from '@/infrastructure/database/prisma/prisma.mappers';
import { PrismaService } from '@/infrastructure/database/prisma/prisma.service';
import { Guard } from '@/shared/domain/guards';
import { DateRange } from '@/shared/domain/value-objects/date-range';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

import { PaymentEntity } from '../domain/entities/payment.entity';
import { PaymentRepository } from '../domain/payment.repository';
import {
  PaymentDetailModel,
  PaymentDueDetailModel,
  PaymentPaginatedExtraModel,
  PaymentPaginatedModel,
  PaymentStatisticsCategoryItemModel,
  PaymentStatisticsModel,
} from '../domain/payment.types';
import { GetPaymentStatisticsParams } from './prisma-payment.types';

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
    const paymentDues = await this.prismaService.paymentDue.findMany({
      include: { due: true },
      where: { paymentId: paymentId.value },
    });

    return paymentDues.map((pd) => ({
      due: this.mapper.due.toDomain(pd.due),
      paymentDue: this.mapper.paymentDue.toDomain(pd),
    }));
  }

  public async findUniqueById(id: UniqueId): Promise<null | PaymentEntity> {
    const payment = await this.prismaService.payment.findUnique({
      include: { paymentDues: true },
      where: { deletedAt: null, id: id.value },
    });

    if (!payment) {
      return null;
    }

    return this.mapper.payment.toDomain(payment);
  }

  public async findUniqueByIds(ids: UniqueId[]): Promise<PaymentEntity[]> {
    const payments = await this.prismaService.payment.findMany({
      include: { paymentDues: true },
      where: {
        deletedAt: null,
        id: { in: ids.map((id) => id.value) },
      },
    });

    return payments.map((payment) => this.mapper.payment.toDomain(payment));
  }

  public async findUniqueOrThrow(id: UniqueId): Promise<PaymentEntity> {
    const payment = await this.prismaService.payment.findUniqueOrThrow({
      include: { paymentDues: true },
      where: { deletedAt: null, id: id.value },
    });

    return this.mapper.payment.toDomain(payment);
  }

  public async getStatistics(
    params: GetPaymentStatisticsParams,
  ): Promise<PaymentStatisticsModel> {
    const paymentDueWhere: PaymentDueWhereInput = {
      payment: {
        deletedAt: null,
        status: PaymentStatus.PAID,
      },
      status: PaymentDueStatus.REGISTERED,
    };

    if (params.dateRange) {
      Guard.defined(paymentDueWhere.payment);

      paymentDueWhere.payment.date = {
        gte: params.dateRange[0],
        lte: params.dateRange[1],
      };
    }

    const paymentDues = await this.prismaService.paymentDue.findMany({
      include: {
        due: { select: { category: true } },
        payment: { select: { date: true, id: true } },
      },
      where: paymentDueWhere,
    });

    const uniquePaymentIds = new Set(paymentDues.map((pd) => pd.payment.id));
    const totalAmount = sumBy(paymentDues, (pd) => pd.amount);
    const paymentCount = uniquePaymentIds.size;

    const paymentDuesByCategory = groupBy(paymentDues, (pd) => pd.due.category);

    const categories = Object.values(DueCategory).reduce(
      (acc, category) => {
        const items = paymentDuesByCategory[category];
        acc[category] = items
          ? {
              amount: sumBy(items, (pd) => pd.amount),
              average: sumBy(items, (pd) => pd.amount) / items.length,
              count: items.length,
            }
          : { amount: 0, average: 0, count: 0 };

        return acc;
      },
      {} as Record<DueCategory, PaymentStatisticsCategoryItemModel>,
    );

    const average =
      paymentCount > 0 ? Math.round(totalAmount / paymentCount) : 0;

    return {
      average,
      categories,
      count: paymentCount,
      total: totalAmount,
    };
  }

  public async save(entity: PaymentEntity): Promise<PaymentEntity> {
    const data = this.mapper.payment.toPersistence(entity);
    const { paymentDues: _paymentDues, ...paymentData } = data;

    const payment = await this.prismaService.payment.upsert({
      create: paymentData,
      update: paymentData,
      where: { id: entity.id.value },
    });

    return this.mapper.payment.toDomain(payment);
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
      where.paymentDues = {
        some: { due: { memberId: { in: params.filters.memberId } } },
      };
    }

    if (params.filters?.status) {
      where.status = { in: params.filters.status };
    }

    if (params.filters?.dueCategory) {
      where.paymentDues = {
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
