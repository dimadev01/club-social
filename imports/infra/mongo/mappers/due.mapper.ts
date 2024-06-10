import { injectable } from 'tsyringe';

import { DateUtcVo } from '@domain/common/value-objects/date-utc.value-object';
import { Money } from '@domain/common/value-objects/money.value-object';
import { Due } from '@domain/dues/models/due.model';
import { Mapper } from '@infra/mongo/common/mappers/mapper';
import { DueEntity } from '@infra/mongo/entities/due.entity';
import { MemberMapper } from '@infra/mongo/mappers/member.mapper';

@injectable()
export class DueMapper extends Mapper<Due, DueEntity> {
  public constructor(private readonly _memberMapper: MemberMapper) {
    super();
  }

  public toDomain(due: DueEntity): Due {
    return new Due(
      {
        _id: due._id,
        amount: new Money({ amount: due.amount }),
        category: due.category,
        createdAt: due.createdAt,
        createdBy: due.createdBy,
        date: new DateUtcVo(due.date),
        deletedAt: due.deletedAt,
        deletedBy: due.deletedBy,
        isDeleted: due.isDeleted,
        memberId: due.memberId,
        notes: due.notes,
        payments: due.payments.map((payment) => ({
          amount: new Money({ amount: payment.amount }),
          date: new DateUtcVo(payment.date),
          paymentId: payment.paymentId,
          receiptNumber: payment.receiptNumber,
          status: payment.status,
        })),
        status: due.status,
        totalPaidAmount: new Money({ amount: due.totalPaidAmount }),
        totalPendingAmount: new Money({ amount: due.totalPendingAmount }),
        updatedAt: due.updatedAt,
        updatedBy: due.updatedBy,
        voidReason: due.voidReason,
        voidedAt: due.voidedAt ? new DateUtcVo(due.voidedAt) : null,
        voidedBy: due.voidedBy,
      },
      due.member ? this._memberMapper.toDomain(due.member) : undefined,
    );
  }

  protected getEntity(due: Due): DueEntity {
    return new DueEntity({
      _id: due._id,
      amount: due.amount.value,
      category: due.category,
      createdAt: due.createdAt,
      createdBy: due.createdBy,
      date: due.date.toDate(),
      deletedAt: due.deletedAt,
      deletedBy: due.deletedBy,
      isDeleted: due.isDeleted,
      memberId: due.memberId,
      notes: due.notes,
      payments: due.payments.map((payment) => ({
        amount: payment.amount.value,
        date: payment.date.toDate(),
        paymentId: payment.paymentId,
        receiptNumber: payment.receiptNumber,
        status: payment.status,
      })),
      status: due.status,
      totalPaidAmount: due.totalPaidAmount.value,
      totalPendingAmount: due.totalPendingAmount.value,
      updatedAt: due.updatedAt,
      updatedBy: due.updatedBy,
      voidReason: due.voidReason,
      voidedAt: due.voidedAt?.toDate() ?? null,
      voidedBy: due.voidedBy,
    });
  }
}
