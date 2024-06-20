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

  private _dueId: string;

  private _memberId: string;

  private _paymentId: string;

  private _type: MemberCreditTypeEnum;

  public constructor(props?: IMemberCredit) {
    super(props);

    this._amount = props?.amount ?? Money.from();

    this._memberId = props?.memberId ?? '';

    this._paymentId = props?.paymentId ?? '';

    this._dueId = props?.dueId ?? '';

    this._type = props?.type ?? MemberCreditTypeEnum.CREDIT;
  }

  public get amount(): Money {
    return this._amount;
  }

  public get dueId(): string {
    return this._dueId;
  }

  public get memberId(): string {
    return this._memberId;
  }

  public get paymentId(): string {
    return this._paymentId;
  }

  public get type(): MemberCreditTypeEnum {
    return this._type;
  }

  public static create(props: CreateMemberCredit): Result<MemberCredit, Error> {
    const memberCredit = new MemberCredit();

    const result = Result.combine([
      memberCredit.setAmount(props.amount),
      memberCredit.setMemberId(props.memberId),
      memberCredit.setPaymentId(props.paymentId),
      memberCredit.setDueId(props.dueId),
      memberCredit.setType(props.type),
    ]);

    if (result.isErr()) {
      return err(result.error);
    }

    return ok(memberCredit);
  }

  private setAmount(value: Money): Result<null, Error> {
    if (value.isNegative()) {
      return err(new Error('El monto no puede ser negativo'));
    }

    this._amount = value;

    return ok(null);
  }

  private setMemberId(value: string): Result<null, Error> {
    this._memberId = value;

    return ok(null);
  }

  private setPaymentId(value: string): Result<null, Error> {
    this._paymentId = value;

    return ok(null);
  }

  private setDueId(value: string): Result<null, Error> {
    this._dueId = value;

    return ok(null);
  }

  private setType(value: MemberCreditTypeEnum): Result<null, Error> {
    this._type = value;

    return ok(null);
  }
}
