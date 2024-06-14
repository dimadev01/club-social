import { injectable } from 'tsyringe';

import { DateUtcVo } from '@domain/common/value-objects/date-utc.value-object';
import { Money } from '@domain/common/value-objects/money.value-object';
import { IDuePayment } from '@domain/dues/due.interface';
import { Due } from '@domain/dues/models/due.model';
import { Mapper } from '@infra/mongo/common/mappers/mapper';
import { DuePaymentEntity } from '@infra/mongo/entities/due-payment.entity';
import { DueEntity } from '@infra/mongo/entities/due.entity';
import { MemberMapper } from '@infra/mongo/mappers/member.mapper';

@injectable()
export class DueMapper extends Mapper<Due, DueEntity> {
  public constructor(private readonly _memberMapper: MemberMapper) {
    super();
  }

  public toDomain(entity: DueEntity): Due {
    return new Due(
      {
        _id: entity._id,
        amount: new Money({ amount: entity.amount }),
        category: entity.category,
        createdAt: entity.createdAt,
        createdBy: entity.createdBy,
        date: new DateUtcVo(entity.date),
        deletedAt: entity.deletedAt,
        deletedBy: entity.deletedBy,
        isDeleted: entity.isDeleted,
        memberId: entity.memberId,
        notes: entity.notes,
        payments: entity.payments.map<IDuePayment>((payment) => ({
          creditAmount: new Money({ amount: payment.creditAmount }),
          directAmount: new Money({ amount: payment.directAmount }),
          paymentDate: new DateUtcVo(payment.paymentDate),
          paymentId: payment.paymentId,
          paymentReceiptNumber: payment.paymentReceiptNumber,
          paymentStatus: payment.paymentStatus,
          source: payment.source,
          totalAmount: new Money({ amount: payment.totalAmount }),
        })),
        status: entity.status,
        totalPaidAmount: new Money({ amount: entity.totalPaidAmount }),
        totalPendingAmount: new Money({ amount: entity.totalPendingAmount }),
        updatedAt: entity.updatedAt,
        updatedBy: entity.updatedBy,
        voidReason: entity.voidReason,
        voidedAt: entity.voidedAt ? new DateUtcVo(entity.voidedAt) : null,
        voidedBy: entity.voidedBy,
      },
      entity.member ? this._memberMapper.toDomain(entity.member) : undefined,
    );
  }

  protected getEntity(domain: Due): DueEntity {
    return new DueEntity({
      _id: domain._id,
      amount: domain.amount.value,
      category: domain.category,
      createdAt: domain.createdAt,
      createdBy: domain.createdBy,
      date: domain.date.toDate(),
      deletedAt: domain.deletedAt,
      deletedBy: domain.deletedBy,
      isDeleted: domain.isDeleted,
      memberId: domain.memberId,
      notes: domain.notes,
      payments: domain.payments.map<DuePaymentEntity>((payment) => ({
        creditAmount: payment.creditAmount.value,
        directAmount: payment.directAmount.value,
        paymentDate: payment.paymentDate.toDate(),
        paymentId: payment.paymentId,
        paymentReceiptNumber: payment.paymentReceiptNumber,
        paymentStatus: payment.paymentStatus,
        source: payment.source,
        totalAmount: payment.totalAmount.value,
      })),
      status: domain.status,
      totalPaidAmount: domain.totalPaidAmount.value,
      totalPendingAmount: domain.totalPendingAmount.value,
      updatedAt: domain.updatedAt,
      updatedBy: domain.updatedBy,
      voidReason: domain.voidReason,
      voidedAt: domain.voidedAt?.toDate() ?? null,
      voidedBy: domain.voidedBy,
    });
  }
}
