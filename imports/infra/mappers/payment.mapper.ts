import { singleton } from 'tsyringe';

import { DayjsDate } from '@domain/common/value-objects/dayjs-date.value-object';
import { PaymentModel } from '@domain/payments/models/payment.model';
import { Mapper } from '@infra/mappers/mapper';
import { PaymentEntity } from '@infra/mongo/entities/payments/payment.entity';

@singleton()
export class PaymentMapper extends Mapper<PaymentModel, PaymentEntity> {
  public toModel(orm: PaymentEntity): PaymentModel {
    return new PaymentModel({
      _id: orm._id,
      createdAt: orm.createdAt,
      createdBy: orm.createdBy,
      date: DayjsDate.utc(orm.date),
      deletedAt: orm.deletedAt,
      deletedBy: orm.deletedBy,
      isDeleted: orm.isDeleted,
      memberId: orm.memberId,
      notes: orm.notes,
      receiptNumber: orm.receiptNumber,
      status: orm.status,
      updatedAt: orm.updatedAt,
      updatedBy: orm.updatedBy,
    });
  }

  protected getEntity(model: PaymentModel): PaymentEntity {
    return new PaymentEntity({
      _id: model._id,
      createdAt: model.createdAt,
      createdBy: model.createdBy,
      date: model.date.toDate(),
      deletedAt: model.deletedAt,
      deletedBy: model.deletedBy,
      isDeleted: model.isDeleted,
      memberId: model.memberId,
      notes: model.notes,
      receiptNumber: model.receiptNumber,
      status: model.status,
      updatedAt: model.updatedAt,
      updatedBy: model.updatedBy,
    });
  }
}
