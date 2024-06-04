import { injectable } from 'tsyringe';

import { DateUtcVo } from '@domain/common/value-objects/date-utc.value-object';
import { Payment } from '@domain/payments/models/payment.model';
import { Mapper } from '@infra/mongo/common/mappers/mapper';
import { PaymentEntity } from '@infra/mongo/entities/payment.entity';
import { MemberMapper } from '@infra/mongo/mappers/member.mapper';
import { PaymentDueMapper } from '@infra/mongo/mappers/payment-due.mapper';

@injectable()
export class PaymentMapper extends Mapper<Payment, PaymentEntity> {
  public constructor(
    private readonly _memberMapper: MemberMapper,
    private readonly _paymentDueMapper: PaymentDueMapper,
  ) {
    super();
  }

  public toDomain(orm: PaymentEntity): Payment {
    return new Payment(
      {
        _id: orm._id,
        createdAt: orm.createdAt,
        createdBy: orm.createdBy,
        date: new DateUtcVo(orm.date),
        deletedAt: orm.deletedAt,
        deletedBy: orm.deletedBy,
        isDeleted: orm.isDeleted,
        memberId: orm.memberId,
        notes: orm.notes,
        receiptNumber: orm.receiptNumber,
        status: orm.status,
        updatedAt: orm.updatedAt,
        updatedBy: orm.updatedBy,
      },
      orm.member ? this._memberMapper.toDomain(orm.member) : undefined,
      orm.dues?.map((due) => this._paymentDueMapper.toDomain(due)),
    );
  }

  protected getEntity(model: Payment): PaymentEntity {
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
