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

  public toDomain(orm: DueEntity): Due {
    return new Due(
      {
        _id: orm._id,
        amount: new Money({ amount: orm.amount }),
        category: orm.category,
        createdAt: orm.createdAt,
        createdBy: orm.createdBy,
        date: new DateUtcVo(orm.date),
        deletedAt: orm.deletedAt,
        deletedBy: orm.deletedBy,
        isDeleted: orm.isDeleted,
        memberId: orm.memberId,
        notes: orm.notes,
        payments: orm.payments.map((payment) => ({
          amount: new Money({ amount: payment.amount }),
          date: new DateUtcVo(payment.date),
          paymentId: payment.paymentId,
          receiptNumber: payment.receiptNumber,
          status: payment.status,
        })),
        status: orm.status,
        totalPaidAmount: new Money({ amount: orm.totalPaidAmount }),
        totalPendingAmount: new Money({ amount: orm.totalPendingAmount }),
        updatedAt: orm.updatedAt,
        updatedBy: orm.updatedBy,
        voidReason: orm.voidReason,
        voidedAt: orm.voidedAt ? new DateUtcVo(orm.voidedAt) : null,
        voidedBy: orm.voidedBy,
      },
      orm.member ? this._memberMapper.toDomain(orm.member) : undefined,
    );
  }

  protected getEntity(model: Due): DueEntity {
    return new DueEntity({
      _id: model._id,
      amount: model.amount.value,
      category: model.category,
      createdAt: model.createdAt,
      createdBy: model.createdBy,
      date: model.date.toDate(),
      deletedAt: model.deletedAt,
      deletedBy: model.deletedBy,
      isDeleted: model.isDeleted,
      memberId: model.memberId,
      notes: model.notes,
      payments: model.payments.map((payment) => ({
        amount: payment.amount.value,
        date: payment.date.toDate(),
        paymentId: payment.paymentId,
        receiptNumber: payment.receiptNumber,
        status: payment.status,
      })),
      status: model.status,
      totalPaidAmount: model.totalPaidAmount.value,
      totalPendingAmount: model.totalPendingAmount.value,
      updatedAt: model.updatedAt,
      updatedBy: model.updatedBy,
      voidReason: model.voidReason,
      voidedAt: model.voidedAt ? model.voidedAt.toDate() : null,
      voidedBy: model.voidedBy,
    });
  }
}
