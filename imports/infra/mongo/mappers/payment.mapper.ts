import { injectable } from 'tsyringe';

import { DateUtcVo } from '@domain/common/value-objects/date-utc.value-object';
import { Money } from '@domain/common/value-objects/money.value-object';
import { Payment } from '@domain/payments/models/payment.model';
import { Mapper } from '@infra/mongo/common/mappers/mapper';
import { PaymentEntity } from '@infra/mongo/entities/payment.entity';
import { MemberMapper } from '@infra/mongo/mappers/member.mapper';

@injectable()
export class PaymentMapper extends Mapper<Payment, PaymentEntity> {
  public constructor(private readonly _memberMapper: MemberMapper) {
    super();
  }

  public toDomain(orm: PaymentEntity): Payment {
    return new Payment(
      {
        _id: orm._id,
        amount: new Money({ amount: orm.amount }),
        createdAt: orm.createdAt,
        createdBy: orm.createdBy,
        date: new DateUtcVo(orm.date),
        deletedAt: orm.deletedAt,
        deletedBy: orm.deletedBy,
        dues: orm.dues.map((due) => ({
          amount: new Money({ amount: due.amount }),
          dueAmount: new Money({ amount: due.dueAmount }),
          dueCategory: due.dueCategory,
          dueDate: new DateUtcVo(due.dueDate),
          dueId: due.dueId,
          source: due.source,
        })),
        isDeleted: orm.isDeleted,
        memberId: orm.memberId,
        notes: orm.notes,
        receiptNumber: orm.receiptNumber,
        status: orm.status,
        updatedAt: orm.updatedAt,
        updatedBy: orm.updatedBy,
        voidReason: orm.voidReason,
        voidedAt: orm.voidedAt ? new DateUtcVo(orm.voidedAt) : null,
        voidedBy: orm.voidedBy,
      },
      orm.member ? this._memberMapper.toDomain(orm.member) : undefined,
    );
  }

  protected getEntity(model: Payment): PaymentEntity {
    return new PaymentEntity({
      _id: model._id,
      amount: model.amount.value,
      createdAt: model.createdAt,
      createdBy: model.createdBy,
      date: model.date.toDate(),
      deletedAt: model.deletedAt,
      deletedBy: model.deletedBy,
      dues: model.dues.map((due) => ({
        amount: due.amount.value,
        dueAmount: due.dueAmount.value,
        dueCategory: due.dueCategory,
        dueDate: due.dueDate.toDate(),
        dueId: due.dueId,
        source: due.source,
      })),
      isDeleted: model.isDeleted,
      memberId: model.memberId,
      notes: model.notes,
      receiptNumber: model.receiptNumber,
      status: model.status,
      updatedAt: model.updatedAt,
      updatedBy: model.updatedBy,
      voidReason: model.voidReason,
      voidedAt: model.voidedAt ? model.voidedAt.toDate() : null,
      voidedBy: model.voidedBy,
    });
  }
}
