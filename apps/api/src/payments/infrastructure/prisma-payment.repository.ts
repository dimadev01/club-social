import type {
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
import { FindForStatisticsParams } from '@/shared/domain/repository-types';
import { DateRange } from '@/shared/domain/value-objects/date-range';
import { Name } from '@/shared/domain/value-objects/name/name.vo';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

import { PaymentEntity } from '../domain/entities/payment.entity';
import {
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

  public async findById(id: UniqueId): Promise<null | PaymentEntity> {
    const payment = await this.prismaService.payment.findUnique({
      where: { id: id.value },
    });

    if (!payment) {
      return null;
    }

    return this.paymentMapper.toDomain(payment);
  }

  public async findByIdOrThrow(id: UniqueId): Promise<PaymentEntity> {
    const payment = await this.prismaService.payment.findUniqueOrThrow({
      include: { settlements: true },
      where: { id: id.value },
    });

    return this.paymentMapper.toDomain(payment);
  }

  public async findByIdReadModel(
    id: UniqueId,
  ): Promise<null | PaymentReadModel> {
    const payment = await this.prismaService.payment.findUnique({
      include: {
        member: { include: { user: true } },
        settlements: {
          include: { due: true, memberLedgerEntry: true },
          orderBy: { memberLedgerEntry: { date: 'desc' } },
        },
      },
      where: { id: id.value },
    });

    return payment ? this.toReadModel(payment) : null;
  }

  public async findByIds(ids: UniqueId[]): Promise<PaymentEntity[]> {
    const payments = await this.prismaService.payment.findMany({
      where: {
        id: { in: ids.map((id) => id.value) },
      },
    });

    return payments.map((payment) => this.paymentMapper.toDomain(payment));
  }

  public async findForExport(
    params: ExportDataDto,
  ): Promise<PaymentPaginatedReadModel[]> {
    const { orderBy, where } = this.buildWhereAndOrderBy(params);

    const payments = await this.prismaService.payment.findMany({
      include: { member: { include: { user: true } } },
      orderBy,
      where,
    });

    return payments.map((payment) => this.toPaginatedReadModel(payment));
  }

  public async findForStatistics(
    params: FindForStatisticsParams,
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
  ): Promise<
    PaginatedDataResultDto<
      PaymentPaginatedReadModel,
      PaymentPaginatedExtraReadModel
    >
  > {
    const { orderBy, where } = this.buildWhereAndOrderBy(params);

    const query = {
      include: { member: { include: { user: true } } },
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

  public async save(entity: PaymentEntity): Promise<void> {
    const create = this.paymentMapper.toCreateInput(entity);
    const update = this.paymentMapper.toUpdateInput(entity);

    await this.prismaService.payment.upsert({
      create,
      update,
      where: { id: entity.id.value },
    });
  }

  private buildWhereAndOrderBy(params: ExportDataDto): {
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

  private toPaginatedReadModel(
    payment: PaymentGetPayload<{
      include: { member: { include: { user: true } } };
    }>,
  ): PaymentPaginatedReadModel {
    return {
      amount: payment.amount,
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
