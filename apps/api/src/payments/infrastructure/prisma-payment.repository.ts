import type {
  PaginatedRequest,
  PaginatedResponse,
} from '@club-social/shared/types';

import { Injectable } from '@nestjs/common';

import {
  PaymentFindManyArgs,
  PaymentWhereInput,
} from '@/infrastructure/database/prisma/generated/models';
import { PrismaMappers } from '@/infrastructure/database/prisma/prisma.mappers';
import { PrismaService } from '@/infrastructure/database/prisma/prisma.service';
import { DateRange } from '@/shared/domain/value-objects/date-range';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

import { PaymentEntity } from '../domain/entities/payment.entity';
import { PaymentRepository } from '../domain/payment.repository';
import {
  PaymentDetailModel,
  PaymentPaginatedModel,
} from '../domain/payment.types';

@Injectable()
export class PrismaPaymentRepository implements PaymentRepository {
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly mapper: PrismaMappers,
  ) {}

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

  public async findPaginatedModel(
    params: PaginatedRequest,
  ): Promise<PaginatedResponse<PaymentPaginatedModel>> {
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

    const query = {
      include: {
        member: { include: { user: true } },
      },
      orderBy: params.sort.map(({ field, order }) => ({ [field]: order })),
      skip: (params.page - 1) * params.pageSize,
      take: params.pageSize,
      where,
    } satisfies PaymentFindManyArgs;

    const [payments, total] = await Promise.all([
      this.prismaService.payment.findMany(query),
      this.prismaService.payment.count({ where }),
    ]);

    return {
      data: payments.map((payment) => ({
        member: this.mapper.member.toDomain(payment.member),
        payment: this.mapper.payment.toDomain(payment),
        user: this.mapper.user.toDomain(payment.member.user),
      })),
      total,
    };
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
}
