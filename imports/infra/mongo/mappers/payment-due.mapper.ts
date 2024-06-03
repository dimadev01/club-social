import { singleton } from 'tsyringe';

import { Money } from '@domain/common/value-objects/money.value-object';
import { PaymentDue } from '@domain/payments/models/payment-due.model';
import { Mapper } from '@infra/mongo/common/mappers/mapper';
import { PaymentDueEntity } from '@infra/mongo/entities/payment-due.entity';
import { DueMapper } from '@infra/mongo/mappers/due.mapper';

@singleton()
export class PaymentDueMapper extends Mapper<PaymentDue, PaymentDueEntity> {
  public constructor(private readonly _dueMapper: DueMapper) {
    super();
  }

  public toDomain(orm: PaymentDueEntity): PaymentDue {
    return new PaymentDue(
      {
        _id: orm._id,
        amount: new Money({ amount: orm.amount }),
        createdAt: orm.createdAt,
        createdBy: orm.createdBy,
        deletedAt: orm.deletedAt,
        deletedBy: orm.deletedBy,
        dueId: orm.dueId,
        isDeleted: orm.isDeleted,
        paymentId: orm.paymentId,
        updatedAt: orm.updatedAt,
        updatedBy: orm.updatedBy,
      },
      orm.due ? this._dueMapper.toDomain(orm.due) : undefined,
    );
  }

  protected getEntity(model: PaymentDue): PaymentDueEntity {
    return new PaymentDueEntity({
      _id: model._id,
      amount: model.amount.amount,
      createdAt: model.createdAt,
      createdBy: model.createdBy,
      deletedAt: model.deletedAt,
      deletedBy: model.deletedBy,
      dueId: model.dueId,
      isDeleted: model.isDeleted,
      paymentId: model.paymentId,
      updatedAt: model.updatedAt,
      updatedBy: model.updatedBy,
    });
  }
}
