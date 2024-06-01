import { singleton } from 'tsyringe';

import { Mapper } from '@adapters/common/mappers/mapper';
import { PaymentDueMapper } from '@adapters/mappers/payment-due.mapper';
import { MemberMapper } from '@adapters/members/mappers/member.mapper';
import { PaymentEntity } from '@adapters/mongo/entities/payment.entity';
import { DateUtcVo } from '@domain/common/value-objects/date-utc.value-object';
import { PaymentModel } from '@domain/payments/models/payment.model';

@singleton()
export class PaymentMapper extends Mapper<PaymentModel, PaymentEntity> {
  public constructor(
    private readonly _memberMapper: MemberMapper,
    private readonly _paymentDueMapper: PaymentDueMapper,
  ) {
    super();
  }

  public toModel(orm: PaymentEntity): PaymentModel {
    return new PaymentModel({
      _id: orm._id,
      createdAt: orm.createdAt,
      createdBy: orm.createdBy,
      date: new DateUtcVo(orm.date),
      deletedAt: orm.deletedAt,
      deletedBy: orm.deletedBy,
      dues: orm.dues.map((due) => this._paymentDueMapper.toModel(due)),
      isDeleted: orm.isDeleted,
      member: orm.member ? this._memberMapper.toModel(orm.member) : undefined,
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
      dues: [],
      isDeleted: model.isDeleted,
      member: undefined,
      memberId: model.memberId,
      notes: model.notes,
      receiptNumber: model.receiptNumber,
      status: model.status,
      updatedAt: model.updatedAt,
      updatedBy: model.updatedBy,
    });
  }
}
