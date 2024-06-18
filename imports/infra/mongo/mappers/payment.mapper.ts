import { injectable } from 'tsyringe';

import { DateTimeVo } from '@domain/common/value-objects/date-time.value-object';
import { DateVo } from '@domain/common/value-objects/date.value-object';
import { Money } from '@domain/common/value-objects/money.value-object';
import { Payment } from '@domain/payments/models/payment.model';
import { IPaymentDue } from '@domain/payments/payment.interface';
import { Mapper } from '@infra/mongo/common/mappers/mapper';
import { PaymentDueEntity } from '@infra/mongo/entities/payment-due.entity';
import { PaymentEntity } from '@infra/mongo/entities/payment.entity';
import { MemberMapper } from '@infra/mongo/mappers/member.mapper';

@injectable()
export class PaymentMapper extends Mapper<Payment, PaymentEntity> {
  public constructor(private readonly _memberMapper: MemberMapper) {
    super();
  }

  public toDomain(entity: PaymentEntity): Payment {
    return new Payment(
      {
        _id: entity._id,
        amount: new Money({ amount: entity.amount }),
        createdAt: new DateTimeVo(entity.createdAt),
        createdBy: entity.createdBy,
        date: new DateVo(entity.date),
        deletedAt: entity.deletedAt ? new DateTimeVo(entity.deletedAt) : null,
        deletedBy: entity.deletedBy,
        dues: entity.dues.map<IPaymentDue>((due) => ({
          creditAmount: new Money({ amount: due.creditAmount }),
          directAmount: new Money({ amount: due.directAmount }),
          dueAmount: new Money({ amount: due.dueAmount }),
          dueCategory: due.dueCategory,
          dueDate: new DateVo(due.dueDate),
          dueId: due.dueId,
          duePendingAmount: new Money({ amount: due.duePendingAmount }),
          source: due.source,
          totalAmount: new Money({ amount: due.totalAmount }),
        })),
        isDeleted: entity.isDeleted,
        memberId: entity.memberId,
        notes: entity.notes,
        receiptNumber: entity.receiptNumber,
        status: entity.status,
        updatedAt: new DateTimeVo(entity.updatedAt),
        updatedBy: entity.updatedBy,
        voidReason: entity.voidReason,
        voidedAt: entity.voidedAt ? new DateVo(entity.voidedAt) : null,
        voidedBy: entity.voidedBy,
      },
      entity.member ? this._memberMapper.toDomain(entity.member) : undefined,
    );
  }

  protected getEntity(domain: Payment): PaymentEntity {
    return new PaymentEntity({
      _id: domain._id,
      amount: domain.amount.value,
      createdAt: domain.createdAt.toDate(),
      createdBy: domain.createdBy,
      date: domain.date.toDate(),
      deletedAt: domain.deletedAt?.toDate() ?? null,
      deletedBy: domain.deletedBy,
      dues: domain.dues.map<PaymentDueEntity>((due) => ({
        creditAmount: due.creditAmount.value,
        directAmount: due.directAmount.value,
        dueAmount: due.dueAmount.value,
        dueCategory: due.dueCategory,
        dueDate: due.dueDate.toDate(),
        dueId: due.dueId,
        duePendingAmount: due.duePendingAmount.value,
        source: due.source,
        totalAmount: due.totalAmount.value,
      })),
      isDeleted: domain.isDeleted,
      memberId: domain.memberId,
      notes: domain.notes,
      receiptNumber: domain.receiptNumber,
      status: domain.status,
      updatedAt: domain.updatedAt.toDate(),
      updatedBy: domain.updatedBy,
      voidReason: domain.voidReason,
      voidedAt: domain.voidedAt?.toDate() ?? null,
      voidedBy: domain.voidedBy,
    });
  }
}
