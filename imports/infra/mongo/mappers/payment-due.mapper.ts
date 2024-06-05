import { injectable } from 'tsyringe';

import { Money } from '@domain/common/value-objects/money.value-object';
import { PaymentDue } from '@domain/payments/models/payment-due.model';
import { Mapper } from '@infra/mongo/common/mappers/mapper';
import { PaymentDueEntity } from '@infra/mongo/entities/payment-due.entity';

@injectable()
export class PaymentDueMapper extends Mapper<PaymentDue, PaymentDueEntity> {
  public toDomain(orm: PaymentDueEntity): PaymentDue {
    return new PaymentDue({
      _id: orm._id,
      amount: new Money({ amount: orm.amount }),
      createdAt: orm.createdAt,
      createdBy: orm.createdBy,
      deletedAt: orm.deletedAt,
      deletedBy: orm.deletedBy,
      dueId: orm.dueId,
      isDeleted: orm.isDeleted,
      paymentId: orm.paymentId,
      source: orm.source,
      updatedAt: orm.updatedAt,
      updatedBy: orm.updatedBy,
    });
  }

  protected getEntity(model: PaymentDue): PaymentDueEntity {
    return new PaymentDueEntity({
      _id: model._id,
      amount: model.amount.value,
      createdAt: model.createdAt,
      createdBy: model.createdBy,
      deletedAt: model.deletedAt,
      deletedBy: model.deletedBy,
      dueId: model.dueId,
      isDeleted: model.isDeleted,
      paymentId: model.paymentId,
      source: model.source,
      updatedAt: model.updatedAt,
      updatedBy: model.updatedBy,
    });
  }
}
