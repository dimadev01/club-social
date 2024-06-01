import { singleton } from 'tsyringe';

import { PaymentDueModel } from '@domain/payment-dues/models/payment-due.model';
import { Mapper } from '@infra/mappers/mapper';
import { PaymentDueEntity } from '@infra/mongo/entities/payment-due/payment-due.entity';

@singleton()
export class PaymentDueMapper extends Mapper<
  PaymentDueModel,
  PaymentDueEntity
> {
  public toModel(orm: PaymentDueEntity): PaymentDueModel {
    return new PaymentDueModel({
      _id: orm._id,
      amount: orm.amount,
      createdAt: orm.createdAt,
      createdBy: orm.createdBy,
      deletedAt: orm.deletedAt,
      deletedBy: orm.deletedBy,
      dueId: orm.dueId,
      isDeleted: orm.isDeleted,
      paymentId: orm.paymentId,
      updatedAt: orm.updatedAt,
      updatedBy: orm.updatedBy,
    });
  }

  protected getEntity(model: PaymentDueModel): PaymentDueEntity {
    return new PaymentDueEntity({
      _id: model._id,
      amount: model.amount,
      createdAt: model.createdAt,
      createdBy: model.createdBy,
      deletedAt: model.deletedAt,
      deletedBy: model.deletedBy,
      due: undefined,
      dueId: model.dueId,
      isDeleted: model.isDeleted,
      payment: undefined,
      paymentId: model.paymentId,
      updatedAt: model.updatedAt,
      updatedBy: model.updatedBy,
    });
  }
}
