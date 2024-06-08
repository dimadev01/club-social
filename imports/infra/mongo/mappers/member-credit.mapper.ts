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
  public toDomain(memberCredit: MemberCreditEntity): MemberCredit {
    return new MemberCredit({
      _id: memberCredit._id,
      amount: new Money({ amount: memberCredit.amount }),
      createdAt: memberCredit.createdAt,
      createdBy: memberCredit.createdBy,
      deletedAt: memberCredit.deletedAt,
      deletedBy: memberCredit.deletedBy,
      dueId: memberCredit.dueId,
      isDeleted: memberCredit.isDeleted,
      memberId: memberCredit.memberId,
      paymentId: memberCredit.paymentId,
      type: memberCredit.type,
      updatedAt: memberCredit.updatedAt,
      updatedBy: memberCredit.updatedBy,
    });
  }

  protected getEntity(memberCredit: MemberCredit): MemberCreditEntity {
    return new MemberCreditEntity({
      _id: memberCredit._id,
      amount: memberCredit.amount.value,
      createdAt: memberCredit.createdAt,
      createdBy: memberCredit.createdBy,
      deletedAt: memberCredit.deletedAt,
      deletedBy: memberCredit.deletedBy,
      dueId: memberCredit.dueId,
      isDeleted: memberCredit.isDeleted,
      memberId: memberCredit.memberId,
      paymentId: memberCredit.paymentId,
      type: memberCredit.type,
      updatedAt: memberCredit.updatedAt,
      updatedBy: memberCredit.updatedBy,
    });
  }
}
