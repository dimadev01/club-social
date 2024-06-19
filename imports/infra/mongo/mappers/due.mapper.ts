import { injectable } from 'tsyringe';

import { DateTimeVo } from '@domain/common/value-objects/date-time.value-object';
import { DateVo } from '@domain/common/value-objects/date.value-object';
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
        createdAt: new DateTimeVo(entity.createdAt),
        createdBy: entity.createdBy,
        date: new DateVo(entity.date),
        deletedAt: entity.deletedAt ? new DateTimeVo(entity.deletedAt) : null,
        deletedBy: entity.deletedBy,
        isDeleted: entity.isDeleted,
        memberId: entity.memberId,
        notes: entity.notes,
        payments: entity.payments.map<IDuePayment>((payment) => ({
          creditAmount: new Money({ amount: payment.creditAmount }),
          directAmount: new Money({ amount: payment.directAmount }),
          paymentDate: new DateVo(payment.paymentDate),
          paymentId: payment.paymentId,
          paymentReceiptNumber: payment.paymentReceiptNumber,
          paymentStatus: payment.paymentStatus,
          source: payment.source,
          totalAmount: new Money({ amount: payment.totalAmount }),
        })),
        status: entity.status,
        totalPaidAmount: new Money({ amount: entity.totalPaidAmount }),
        totalPendingAmount: new Money({ amount: entity.totalPendingAmount }),
        updatedAt: new DateTimeVo(entity.updatedAt),
        updatedBy: entity.updatedBy,
        voidReason: entity.voidReason,
        voidedAt: entity.voidedAt ? new DateVo(entity.voidedAt) : null,
        voidedBy: entity.voidedBy,
      },
      entity.member ? this._memberMapper.toDomain(entity.member) : undefined,
    );
  }

  protected getEntity(domain: Due): DueEntity {
    return new DueEntity({
      _id: domain._id,
      amount: domain.amount.amount,
      category: domain.category,
      createdAt: domain.createdAt.date,
      createdBy: domain.createdBy,
      date: domain.date.date,
      deletedAt: domain.deletedAt?.date ?? null,
      deletedBy: domain.deletedBy,
      isDeleted: domain.isDeleted,
      memberId: domain.memberId,
      notes: domain.notes,
      payments: domain.payments.map<DuePaymentEntity>((payment) => ({
        creditAmount: payment.creditAmount.amount,
        directAmount: payment.directAmount.amount,
        paymentDate: payment.paymentDate.date,
        paymentId: payment.paymentId,
        paymentReceiptNumber: payment.paymentReceiptNumber,
        paymentStatus: payment.paymentStatus,
        source: payment.source,
        totalAmount: payment.totalAmount.amount,
      })),
      status: domain.status,
      totalPaidAmount: domain.totalPaidAmount.amount,
      totalPendingAmount: domain.totalPendingAmount.amount,
      updatedAt: domain.updatedAt.date,
      updatedBy: domain.updatedBy,
      voidReason: domain.voidReason,
      voidedAt: domain.voidedAt?.date ?? null,
      voidedBy: domain.voidedBy,
    });
  }
}
