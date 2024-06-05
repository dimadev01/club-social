import { Result, err, ok } from 'neverthrow';

import { Model } from '@domain/common/models/model';
import { Money } from '@domain/common/value-objects/money.value-object';
import { MemberCreditTypeEnum } from '@domain/members/member.enum';
import {
  CreateMemberCredit,
  IMemberCredit,
} from '@domain/members/member.interface';

export class MemberCredit extends Model implements IMemberCredit {
  private _amount: Money;

  private _memberId: string;

  private _paymentDueId: string;

  private _type: MemberCreditTypeEnum;

  public constructor(props?: IMemberCredit) {
    super(props);

    this._amount = props?.amount ?? new Money({ amount: 0 });

    this._memberId = props?.memberId ?? '';

    this._paymentDueId = props?.paymentDueId ?? '';

    this._type = props?.type ?? MemberCreditTypeEnum.CREDIT;
  }

  public get amount(): Money {
    return this._amount;
  }

  public get memberId(): string {
    return this._memberId;
  }

  public get paymentDueId(): string {
    return this._paymentDueId;
  }

  public get type(): MemberCreditTypeEnum {
    return this._type;
  }

  public static createOne(
    props: CreateMemberCredit,
  ): Result<MemberCredit, Error> {
    const memberCredit = new MemberCredit();

    const result = Result.combine([
      memberCredit.setAmount(props.amount),
      memberCredit.setMemberId(props.memberId),
      memberCredit.setPaymentDueId(props.paymentDueId),
      memberCredit.setType(props.type),
    ]);

    if (result.isErr()) {
      return err(result.error);
    }

    return ok(memberCredit);
  }

  public setAmount(value: Money): Result<null, Error> {
    this._amount = value;

    return ok(null);
  }

  public setMemberId(value: string): Result<null, Error> {
    this._memberId = value;

    return ok(null);
  }

  public setPaymentDueId(value: string): Result<null, Error> {
    this._paymentDueId = value;

    return ok(null);
  }

  public setType(value: MemberCreditTypeEnum): Result<null, Error> {
    this._type = value;

    return ok(null);
  }
}
