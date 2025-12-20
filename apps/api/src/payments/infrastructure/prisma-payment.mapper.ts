import { PaymentStatus } from '@club-social/shared/payments';
import { Injectable } from '@nestjs/common';

import { Mapper } from '@/infrastructure/repositories/mapper';
import { Amount } from '@/shared/domain/value-objects/amount/amount.vo';
import { DateOnly } from '@/shared/domain/value-objects/date-only/date-only.vo';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

import { PaymentEntity } from '../domain/entities/payment.entity';
import { PrismaPaymentDueMapper } from './prisma-payment-due.mapper';
import { PaymentModelWithRelations } from './prisma-payment.types';

@Injectable()
export class PrismaPaymentMapper extends Mapper<
  PaymentEntity,
  PaymentModelWithRelations
> {
  public constructor(
    private readonly paymentDueMapper: PrismaPaymentDueMapper,
  ) {
    super();
  }

  public toDomain(payment: PaymentModelWithRelations): PaymentEntity {
    return PaymentEntity.fromPersistence(
      {
        amount: Amount.raw({ cents: payment.amount }),
        createdBy: payment.createdBy,
        date: DateOnly.raw({ value: payment.date }),
        notes: payment.notes,
        paymentDues: (payment.paymentDues ?? []).map((pd) =>
          this.paymentDueMapper.toDomain(pd),
        ),
        status: payment.status as PaymentStatus,
        voidedAt: payment.voidedAt,
        voidedBy: payment.voidedBy,
        voidReason: payment.voidReason,
      },
      {
        createdAt: payment.createdAt,
        createdBy: payment.createdBy,
        deletedAt: payment.deletedAt,
        deletedBy: payment.deletedBy,
        id: UniqueId.raw({ value: payment.id }),
        updatedAt: payment.updatedAt,
        updatedBy: payment.updatedBy,
      },
    );
  }

  public toPersistence(payment: PaymentEntity): PaymentModelWithRelations {
    return {
      amount: payment.amount.toCents(),
      createdAt: payment.createdAt,
      createdBy: payment.createdBy,
      date: payment.date.value,
      deletedAt: payment.deletedAt,
      deletedBy: payment.deletedBy,
      id: payment.id.value,
      notes: payment.notes,
      paymentDues: payment.paymentDues.map((pd) =>
        this.paymentDueMapper.toPersistence(pd),
      ),
      status: payment.status,
      updatedAt: payment.updatedAt,
      updatedBy: payment.updatedBy,
      voidedAt: payment.voidedAt,
      voidedBy: payment.voidedBy,
      voidReason: payment.voidReason,
    };
  }
}
