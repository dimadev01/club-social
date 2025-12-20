import { PaymentStatus } from '@club-social/shared/payments';
import { Injectable } from '@nestjs/common';

import { PaymentModel } from '@/infrastructure/database/prisma/generated/models';
import { Mapper } from '@/infrastructure/repositories/mapper';
import { Amount } from '@/shared/domain/value-objects/amount/amount.vo';
import { DateOnly } from '@/shared/domain/value-objects/date-only/date-only.vo';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

import { PaymentEntity } from '../domain/entities/payment.entity';

@Injectable()
export class PrismaPaymentMapper extends Mapper<PaymentEntity, PaymentModel> {
  public toDomain(payment: PaymentModel): PaymentEntity {
    return PaymentEntity.fromPersistence(
      {
        amount: Amount.raw({ cents: payment.amount }),
        createdBy: payment.createdBy,
        date: DateOnly.raw({ value: payment.date }),
        dueId: UniqueId.raw({ value: payment.dueId }),
        notes: payment.notes,
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

  public toPersistence(payment: PaymentEntity): PaymentModel {
    return {
      amount: payment.amount.toCents(),
      createdAt: payment.createdAt,
      createdBy: payment.createdBy,
      date: payment.date.value,
      deletedAt: payment.deletedAt,
      deletedBy: payment.deletedBy,
      dueId: payment.dueId.value,
      id: payment.id.value,
      notes: payment.notes,
      status: payment.status,
      updatedAt: payment.updatedAt,
      updatedBy: payment.updatedBy,
      voidedAt: payment.voidedAt,
      voidedBy: payment.voidedBy,
      voidReason: payment.voidReason,
    };
  }
}
