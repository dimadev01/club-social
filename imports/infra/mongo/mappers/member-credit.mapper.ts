import { injectable } from 'tsyringe';

import { Money } from '@domain/common/value-objects/money.value-object';
import { MemberCredit } from '@domain/members/models/member-credit.model';
import { Mapper } from '@infra/mongo/common/mappers/mapper';
import { MemberCreditEntity } from '@infra/mongo/entities/member-credit.entity';

@injectable()
export class MemberCreditMapper extends Mapper<
  MemberCredit,
  MemberCreditEntity
> {
  public toDomain(orm: MemberCreditEntity): MemberCredit {
    return new MemberCredit({
      _id: orm._id,
      amount: new Money({ amount: orm.amount }),
      createdAt: orm.createdAt,
      createdBy: orm.createdBy,
      deletedAt: orm.deletedAt,
      deletedBy: orm.deletedBy,
      dueId: orm.dueId,
      isDeleted: orm.isDeleted,
      memberId: orm.memberId,
      paymentId: orm.paymentId,
      type: orm.type,
      updatedAt: orm.updatedAt,
      updatedBy: orm.updatedBy,
    });
  }

  protected getEntity(domain: MemberCredit): MemberCreditEntity {
    return new MemberCreditEntity({
      _id: domain._id,
      amount: domain.amount.value,
      createdAt: domain.createdAt,
      createdBy: domain.createdBy,
      deletedAt: domain.deletedAt,
      deletedBy: domain.deletedBy,
      dueId: domain.dueId,
      isDeleted: domain.isDeleted,
      memberId: domain.memberId,
      paymentId: domain.paymentId,
      type: domain.type,
      updatedAt: domain.updatedAt,
      updatedBy: domain.updatedBy,
    });
  }
}
