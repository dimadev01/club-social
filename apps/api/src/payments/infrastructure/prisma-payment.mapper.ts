import { PaymentStatus } from '@club-social/shared/payments';
import { Injectable } from '@nestjs/common';

import {
  PaymentCreateInput,
  PaymentModel,
  PaymentUpdateInput,
} from '@/infrastructure/database/prisma/generated/models';
import { Guard } from '@/shared/domain/guards';
import { Amount } from '@/shared/domain/value-objects/amount/amount.vo';
import { DateOnly } from '@/shared/domain/value-objects/date-only/date-only.vo';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

import { PaymentEntity } from '../domain/entities/payment.entity';

@Injectable()
export class PrismaPaymentMapper {
  public toCreateInput(payment: PaymentEntity): PaymentCreateInput {
    Guard.string(payment.createdBy);

    return {
      amount: payment.amount.toCents(),
      createdBy: payment.createdBy,
      date: payment.date.value,
      id: payment.id.value,
      member: { connect: { id: payment.memberId.value } },
      notes: payment.notes,
      receiptNumber: payment.receiptNumber,
      status: payment.status,
      voidedAt: payment.voidedAt,
      voidedBy: payment.voidedBy,
      voidReason: payment.voidReason,
    };
  }

  public toDomain(payment: PaymentModel): PaymentEntity {
    return PaymentEntity.fromPersistence(
      {
        amount: Amount.raw({ cents: payment.amount }),
        date: DateOnly.raw({ value: payment.date }),
        memberId: UniqueId.raw({ value: payment.memberId }),
        notes: payment.notes,
        receiptNumber: payment.receiptNumber,
        status: payment.status as PaymentStatus,
        voidedAt: payment.voidedAt,
        voidedBy: payment.voidedBy,
        voidReason: payment.voidReason,
      },
      {
        audit: {
          createdAt: payment.createdAt,
          createdBy: payment.createdBy,
          updatedAt: payment.updatedAt,
          updatedBy: payment.updatedBy,
        },
        id: UniqueId.raw({ value: payment.id }),
      },
    );
  }

  public toUpdateInput(payment: PaymentEntity): PaymentUpdateInput {
    return {
      amount: payment.amount.toCents(),
      date: payment.date.value,
      id: payment.id.value,
      notes: payment.notes,
      receiptNumber: payment.receiptNumber,
      status: payment.status,
      updatedBy: payment.updatedBy,
      voidedAt: payment.voidedAt,
      voidedBy: payment.voidedBy,
      voidReason: payment.voidReason,
    };
  }
}
