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

  public toDomain(payment: PaymentEntity): Payment {
    return new Payment(
      {
        _id: payment._id,
        amount: new Money({ amount: payment.amount }),
        createdAt: payment.createdAt,
        createdBy: payment.createdBy,
        date: new DateUtcVo(payment.date),
        deletedAt: payment.deletedAt,
        deletedBy: payment.deletedBy,
        dues: payment.dues.map((due) => ({
          amount: new Money({ amount: due.amount }),
          dueAmount: new Money({ amount: due.dueAmount }),
          dueCategory: due.dueCategory,
          dueDate: new DateUtcVo(due.dueDate),
          dueId: due.dueId,
          source: due.source,
        })),
        isDeleted: payment.isDeleted,
        memberId: payment.memberId,
        notes: payment.notes,
        receiptNumber: payment.receiptNumber,
        status: payment.status,
        updatedAt: payment.updatedAt,
        updatedBy: payment.updatedBy,
        voidReason: payment.voidReason,
        voidedAt: payment.voidedAt ? new DateUtcVo(payment.voidedAt) : null,
        voidedBy: payment.voidedBy,
      },
      payment.member ? this._memberMapper.toDomain(payment.member) : undefined,
    );
  }

  protected getEntity(payment: Payment): PaymentEntity {
    return new PaymentEntity({
      _id: payment._id,
      amount: payment.amount.value,
      createdAt: payment.createdAt,
      createdBy: payment.createdBy,
      date: payment.date.toDate(),
      deletedAt: payment.deletedAt,
      deletedBy: payment.deletedBy,
      dues: payment.dues.map((due) => ({
        amount: due.amount.value,
        dueAmount: due.dueAmount.value,
        dueCategory: due.dueCategory,
        dueDate: due.dueDate.toDate(),
        dueId: due.dueId,
        source: due.source,
      })),
      isDeleted: payment.isDeleted,
      memberId: payment.memberId,
      notes: payment.notes,
      receiptNumber: payment.receiptNumber,
      status: payment.status,
      updatedAt: payment.updatedAt,
      updatedBy: payment.updatedBy,
      voidReason: payment.voidReason,
      voidedAt: payment.voidedAt ? payment.voidedAt.toDate() : null,
      voidedBy: payment.voidedBy,
    });
  }
}
