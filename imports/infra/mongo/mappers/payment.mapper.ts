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
        amount: Money.from({ amount: entity.amount }),
        createdAt: new DateTimeVo(entity.createdAt),
        createdBy: entity.createdBy,
        date: new DateVo(entity.date),
        deletedAt: entity.deletedAt ? new DateTimeVo(entity.deletedAt) : null,
        deletedBy: entity.deletedBy,
        dues: entity.dues.map<IPaymentDue>((due) => ({
          creditAmount: Money.from({ amount: due.creditAmount }),
          directAmount: Money.from({ amount: due.directAmount }),
          dueAmount: Money.from({ amount: due.dueAmount }),
          dueCategory: due.dueCategory,
          dueDate: new DateVo(due.dueDate),
          dueId: due.dueId,
          duePendingAmount: Money.from({ amount: due.duePendingAmount }),
          source: due.source,
          totalAmount: Money.from({ amount: due.totalAmount }),
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
      amount: domain.amount.amount,
      createdAt: domain.createdAt.date,
      createdBy: domain.createdBy,
      date: domain.date.date,
      deletedAt: domain.deletedAt?.date ?? null,
      deletedBy: domain.deletedBy,
      dues: domain.dues.map<PaymentDueEntity>((due) => ({
        creditAmount: due.creditAmount.amount,
        directAmount: due.directAmount.amount,
        dueAmount: due.dueAmount.amount,
        dueCategory: due.dueCategory,
        dueDate: due.dueDate.date,
        dueId: due.dueId,
        duePendingAmount: due.duePendingAmount.amount,
        source: due.source,
        totalAmount: due.totalAmount.amount,
      })),
      isDeleted: domain.isDeleted,
      memberId: domain.memberId,
      notes: domain.notes,
      receiptNumber: domain.receiptNumber,
      status: domain.status,
      updatedAt: domain.updatedAt.date,
      updatedBy: domain.updatedBy,
      voidReason: domain.voidReason,
      voidedAt: domain.voidedAt?.date ?? null,
      voidedBy: domain.voidedBy,
    });
  }
}
