import { Injectable } from '@nestjs/common';

import { PaymentModel } from '@/infrastructure/database/prisma/generated/models';
import { Mapper } from '@/infrastructure/repositories/mapper';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

import { PaymentEntity } from '../domain/entities/payment.entity';

@Injectable()
export class PrismaPaymentMapper extends Mapper<PaymentEntity, PaymentModel> {
  public toDomain(payment: PaymentModel): PaymentEntity {
    return PaymentEntity.fromPersistence(
      {
        amount: payment.amount,
        createdBy: payment.createdBy,
        date: payment.date,
        dueId: UniqueId.raw({ value: payment.dueId }),
        notes: payment.notes,
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
      amount: payment.amount,
      createdAt: payment.createdAt,
      createdBy: payment.createdBy,
      date: payment.date,
      deletedAt: payment.deletedAt,
      deletedBy: payment.deletedBy,
      dueId: payment.dueId.value,
      id: payment.id.value,
      notes: payment.notes,
      updatedAt: payment.updatedAt,
      updatedBy: payment.updatedBy,
    };
  }
}
