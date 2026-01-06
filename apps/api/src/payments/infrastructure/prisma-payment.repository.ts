import type {
  DateRangeDto,
  ExportDataDto,
  GetPaginatedDataDto,
  PaginatedDataResultDto,
} from '@club-social/shared/types';

import { DueCategory, DueSettlementStatus } from '@club-social/shared/dues';
import { PaymentStatus } from '@club-social/shared/payments';
import { Injectable } from '@nestjs/common';

import {
  PaymentFindManyArgs,
  PaymentGetPayload,
  PaymentOrderByWithRelationInput,
  PaymentWhereInput,
} from '@/infrastructure/database/prisma/generated/models';
import { PrismaService } from '@/infrastructure/database/prisma/prisma.service';
import { PrismaClientLike } from '@/infrastructure/database/prisma/prisma.types';
import { QueryContext } from '@/shared/domain/repository';
import { DateOnly } from '@/shared/domain/value-objects/date-only/date-only.vo';
import { DateRange } from '@/shared/domain/value-objects/date-range';
import { Name } from '@/shared/domain/value-objects/name/name.vo';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

import { PaymentEntity } from '../domain/entities/payment.entity';
import {
  PaymentDailyStatisticsReadModel,
  PaymentPaginatedExtraReadModel,
  PaymentPaginatedReadModel,
  PaymentReadModel,
  PaymentStatisticsReadModel,
} from '../domain/payment-read-models';
import { PaymentRepository } from '../domain/payment.repository';
import { PrismaPaymentMapper } from './prisma-payment.mapper';

@Injectable()
export class PrismaPaymentRepository implements PaymentRepository {
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly paymentMapper: PrismaPaymentMapper,
  ) {}

  public async findById(
    id: UniqueId,
    context?: QueryContext,
  ): Promise<null | PaymentEntity> {
    const where: PaymentWhereInput = { id: id.value };

    if (context?.memberId) {
      where.memberId = context.memberId.value;
    }

    const payment = await this.prismaService.payment.findFirst({
      include: { settlements: true },
      where,
    });

    if (!payment) {
      return null;
    }

    return this.paymentMapper.toDomain(payment);
  }

  public async findByIdOrThrow(
    id: UniqueId,
    context?: QueryContext,
  ): Promise<PaymentEntity> {
    const where: PaymentWhereInput = { id: id.value };

    if (context?.memberId) {
      where.memberId = context.memberId.value;
    }

    const payment = await this.prismaService.payment.findFirstOrThrow({
      include: { settlements: true },
      where,
    });

    return this.paymentMapper.toDomain(payment);
  }

  public async findByIdReadModel(
    id: UniqueId,
    context?: QueryContext,
  ): Promise<null | PaymentReadModel> {
    const where: PaymentWhereInput = { id: id.value };

    if (context?.memberId) {
      where.memberId = context.memberId.value;
    }

    const payment = await this.prismaService.payment.findFirst({
      include: {
        member: { include: { user: true } },
        settlements: {
          include: { due: true, memberLedgerEntry: true },
          orderBy: { memberLedgerEntry: { date: 'desc' } },
        },
      },
      where,
    });

    return payment ? this.toReadModel(payment) : null;
  }

  public async findByIds(
    ids: UniqueId[],
    context?: QueryContext,
  ): Promise<PaymentEntity[]> {
    const where: PaymentWhereInput = { id: { in: ids.map((id) => id.value) } };

    if (context?.memberId) {
      where.memberId = context.memberId.value;
    }

    const payments = await this.prismaService.payment.findMany({
      include: { settlements: true },
      where,
    });

    return payments.map((payment) => this.paymentMapper.toDomain(payment));
  }

  public async findDailyStatistics(
    date: DateOnly,
  ): Promise<PaymentDailyStatisticsReadModel[]> {
    const endDate = date.endOfMonth();

    const result = await this.prismaService.payment.groupBy({
      _count: {
        id: true,
      },
      _sum: {
        amount: true,
      },
      by: ['date'],
      orderBy: {
        date: 'asc',
      },
      where: {
        date: {
          gte: date.value,
          lte: endDate.value,
        },
        status: PaymentStatus.PAID,
      },
    });

    return result.map((row) => ({
      amount: row._sum.amount ?? 0,
      count: row._count.id,
      date: row.date,
    }));
  }

  public async findForExport(
    params: ExportDataDto,
    context?: QueryContext,
  ): Promise<PaymentPaginatedReadModel[]> {
    const { orderBy, where } = this.buildWhereAndOrderBy(params, context);

    const payments = await this.prismaService.payment.findMany({
      include: {
        member: { include: { user: true } },
        settlements: { include: { due: true } },
      },
      orderBy,
      where,
    });

    return payments.map((payment) => this.toPaginatedReadModel(payment));
  }

  public async findForStatistics(
    params: DateRangeDto,
  ): Promise<PaymentStatisticsReadModel[]> {
    const where: PaymentWhereInput = {
      settlements: {
        every: {
          status: DueSettlementStatus.APPLIED,
        },
      },
      status: PaymentStatus.PAID,
    };

    if (params.dateRange) {
      where.date = {
        gte: params.dateRange[0],
        lte: params.dateRange[1],
      };
    }

    const payments = await this.prismaService.payment.findMany({
      include: { settlements: { include: { due: true } } },
      where,
    });

    return payments.map((payment) => ({
      amount: payment.amount,
      dueSettlements: payment.settlements.map((settlement) => ({
        amount: settlement.amount,
        due: {
          category: settlement.due.category as DueCategory,
          id: settlement.due.id,
        },
      })),
    }));
  }

  public async findPaginated(
    params: GetPaginatedDataDto,
    context?: QueryContext,
  ): Promise<
    PaginatedDataResultDto<
      PaymentPaginatedReadModel,
      PaymentPaginatedExtraReadModel
    >
  > {
    const { orderBy, where } = this.buildWhereAndOrderBy(params, context);

    const query = {
      include: {
        member: { include: { user: true } },
        settlements: { include: { due: true } },
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
      data: payments.map((payment) => this.toPaginatedReadModel(payment)),
      extra: {
        totalAmount: totalAmount._sum.amount ?? 0,
      },
      total,
    };
  }

  public async save(
    entity: PaymentEntity,
    tx?: PrismaClientLike,
  ): Promise<void> {
    const client = tx ?? this.prismaService;

    const create = this.paymentMapper.toCreateInput(entity);
    const update = this.paymentMapper.toUpdateInput(entity);

    await client.payment.upsert({
      create,
      update,
      where: { id: entity.id.value },
    });
  }

  private buildWhereAndOrderBy(
    params: ExportDataDto,
    context?: QueryContext,
  ): {
    orderBy: PaymentOrderByWithRelationInput[];
    where: PaymentWhereInput;
  } {
    const where: PaymentWhereInput = {};

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

    if (context?.memberId) {
      where.memberId = context.memberId.value;
    } else if (params.filters?.memberId) {
      where.memberId = { in: params.filters.memberId };
    }

    if (params.filters?.status) {
      where.status = { in: params.filters.status };
    }

    if (params.filters?.categories) {
      where.settlements = {
        some: { due: { category: { in: params.filters.categories } } },
      };
    }

    const orderBy: PaymentOrderByWithRelationInput[] = [
      ...params.sort.map(({ field, order }) => ({ [field]: order })),
      { createdAt: 'desc' },
    ];

    return { orderBy, where };
  }

  private toPaginatedReadModel(
    payment: PaymentGetPayload<{
      include: {
        member: { include: { user: true } };
        settlements: { include: { due: true } };
      };
    }>,
  ): PaymentPaginatedReadModel {
    const categoriesPaid = new Set<DueCategory>();

    for (const settlement of payment.settlements) {
      categoriesPaid.add(settlement.due.category as DueCategory);
    }

    return {
      amount: payment.amount,
      categories: Array.from(categoriesPaid).sort(),
      createdAt: payment.createdAt,
      createdBy: payment.createdBy,
      date: payment.date,
      id: payment.id,
      member: {
        id: payment.member.id,
        name: Name.raw({
          firstName: payment.member.user.firstName,
          lastName: payment.member.user.lastName,
        }).fullName,
      },
      receiptNumber: payment.receiptNumber,
      status: payment.status as PaymentStatus,
    };
  }

  private toReadModel(
    payment: PaymentGetPayload<{
      include: {
        member: { include: { user: true } };
        settlements: { include: { due: true; memberLedgerEntry: true } };
      };
    }>,
  ): PaymentReadModel {
    return {
      amount: payment.amount,
      createdAt: payment.createdAt,
      createdBy: payment.createdBy,
      date: payment.date,
      dueSettlements: payment.settlements.map((settlement) => ({
        amount: settlement.amount,
        due: {
          amount: settlement.due.amount,
          category: settlement.due.category as DueCategory,
          date: settlement.due.date,
          id: settlement.due.id,
        },
        memberLedgerEntry: {
          date: settlement.memberLedgerEntry.date,
          id: settlement.memberLedgerEntry.id,
        },
        status: settlement.status as DueSettlementStatus,
      })),
      id: payment.id,
      member: {
        id: payment.member.id,
        name: payment.member.user.name,
      },
      notes: payment.notes,
      receiptNumber: payment.receiptNumber,
      status: payment.status as PaymentStatus,
      updatedAt: payment.updatedAt,
      updatedBy: payment.updatedBy,
      voidedAt: payment.voidedAt,
      voidedBy: payment.voidedBy,
      voidReason: payment.voidReason,
    };
  }
}
