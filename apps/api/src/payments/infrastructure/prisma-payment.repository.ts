import type { PaginatedResponse } from '@club-social/shared/types';

import { Injectable } from '@nestjs/common';

import {
  PaymentFindManyArgs,
  PaymentWhereInput,
} from '@/infrastructure/database/prisma/generated/models';
import { PrismaService } from '@/infrastructure/database/prisma/prisma.service';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

import { PaymentEntity } from '../domain/entities/payment.entity';
import {
  PaymentListParams,
  PaymentRepository,
} from '../domain/payment.repository';
import { PrismaPaymentMapper } from './prisma-payment.mapper';

@Injectable()
export class PrismaPaymentRepository implements PaymentRepository {
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly mapper: PrismaPaymentMapper,
  ) {}

  public async findByDueId(dueId: UniqueId): Promise<PaymentEntity[]> {
    const payments = await this.prismaService.payment.findMany({
      where: {
        deletedAt: null,
        dueId: dueId.value,
      },
    });

    return payments.map((payment) => this.mapper.toDomain(payment));
  }

  public async findManyByIds(ids: UniqueId[]): Promise<PaymentEntity[]> {
    const payments = await this.prismaService.payment.findMany({
      where: {
        deletedAt: null,
        id: { in: ids.map((id) => id.value) },
      },
    });

    return payments.map((payment) => this.mapper.toDomain(payment));
  }

  public async findOneById(id: UniqueId): Promise<null | PaymentEntity> {
    const payment = await this.prismaService.payment.findUnique({
      where: { deletedAt: null, id: id.value },
    });

    if (!payment) {
      return null;
    }

    return this.mapper.toDomain(payment);
  }

  public async findOneByIdOrThrow(id: UniqueId): Promise<PaymentEntity> {
    const payment = await this.prismaService.payment.findUniqueOrThrow({
      where: { deletedAt: null, id: id.value },
    });

    return this.mapper.toDomain(payment);
  }

  public async findPaginated(
    params: PaymentListParams,
  ): Promise<PaginatedResponse<PaymentEntity>> {
    const where: PaymentWhereInput = {
      deletedAt: null,
      ...(params.dueId && { dueId: params.dueId }),
    };

    const query: PaymentFindManyArgs = {
      orderBy: [
        ...params.sort.map(({ field, order }) => ({ [field]: order })),
        { createdAt: 'desc' },
      ],
      skip: (params.page - 1) * params.pageSize,
      take: params.pageSize,
      where,
    };

    const [payments, total] = await Promise.all([
      this.prismaService.payment.findMany(query),
      this.prismaService.payment.count({ where }),
    ]);

    return {
      data: payments.map((payment) => this.mapper.toDomain(payment)),
      total,
    };
  }

  public async save(entity: PaymentEntity): Promise<PaymentEntity> {
    const data = this.mapper.toPersistence(entity);

    const payment = await this.prismaService.payment.upsert({
      create: data,
      update: data,
      where: { id: entity.id.value },
    });

    return this.mapper.toDomain(payment);
  }
}
