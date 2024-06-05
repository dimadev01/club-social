import { injectable } from 'tsyringe';

import { DateUtcVo } from '@domain/common/value-objects/date-utc.value-object';
import { Money } from '@domain/common/value-objects/money.value-object';
import { Due } from '@domain/dues/models/due.model';
import { Mapper } from '@infra/mongo/common/mappers/mapper';
import { DueEntity } from '@infra/mongo/entities/due.entity';
import { MemberMapper } from '@infra/mongo/mappers/member.mapper';
import { PaymentDueMapper } from '@infra/mongo/mappers/payment-due.mapper';

@injectable()
export class DueMapper extends Mapper<Due, DueEntity> {
  public constructor(
    private readonly _memberMapper: MemberMapper,
    private readonly _paymentDueMapper: PaymentDueMapper,
  ) {
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
        status: orm.status,
        updatedAt: orm.updatedAt,
        updatedBy: orm.updatedBy,
      },
      orm.member ? this._memberMapper.toDomain(orm.member) : undefined,
      orm.payments
        ? orm.payments.map((payment) =>
            this._paymentDueMapper.toDomain(payment),
          )
        : undefined,
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
      status: model.status,
      updatedAt: model.updatedAt,
      updatedBy: model.updatedBy,
    });
  }
}
