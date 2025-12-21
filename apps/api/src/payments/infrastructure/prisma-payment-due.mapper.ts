import { PaymentDueStatus } from '@club-social/shared/payments';
import { Injectable } from '@nestjs/common';

import { PaymentDueModel } from '@/infrastructure/database/prisma/generated/models';
import { Mapper } from '@/infrastructure/repositories/mapper';
import { Amount } from '@/shared/domain/value-objects/amount/amount.vo';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

import { PaymentDueEntity } from '../domain/entities/payment-due.entity';

@Injectable()
export class PrismaPaymentDueMapper extends Mapper<
  PaymentDueEntity,
  PaymentDueModel
> {
  public toDomain(paymentDue: PaymentDueModel): PaymentDueEntity {
    return PaymentDueEntity.fromPersistence({
      amount: Amount.raw({ cents: paymentDue.amount }),
      dueId: UniqueId.raw({ value: paymentDue.dueId }),
      paymentId: UniqueId.raw({ value: paymentDue.paymentId }),
      status: paymentDue.status as PaymentDueStatus,
    });
  }

  public toPersistence(paymentDue: PaymentDueEntity): PaymentDueModel {
    return {
      amount: paymentDue.amount.toCents(),
      dueId: paymentDue.dueId.value,
      paymentId: paymentDue.paymentId.value,
      status: paymentDue.status,
    };
  }
}
