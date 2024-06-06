import { Result, err, ok } from 'neverthrow';

import { DateUtcVo } from '@domain/common/value-objects/date-utc.value-object';
import { Money } from '@domain/common/value-objects/money.value-object';
import { DueCategoryEnum } from '@domain/dues/due.enum';
import { PaymentDueSourceEnum } from '@domain/payments/payment.enum';
import {
  CreatePaymentDueNew,
  IPaymentDueNew,
} from '@domain/payments/payment.interface';

export class PaymentDueNew implements IPaymentDueNew {
  private _amount: Money;

  private _dueAmount: Money;

  private _dueCategory: DueCategoryEnum;

  private _dueDate: DateUtcVo;

  private _dueId: string;

  private _source: PaymentDueSourceEnum;

  public constructor(props?: IPaymentDueNew) {
    this._amount = props?.amount ?? new Money({ amount: 0 });

    this._dueAmount = props?.dueAmount ?? new Money({ amount: 0 });

    this._dueCategory = props?.dueCategory ?? DueCategoryEnum.MEMBERSHIP;

    this._dueDate = props?.dueDate ?? new DateUtcVo();

    this._dueId = props?.dueId ?? '';

    this._source = props?.source ?? PaymentDueSourceEnum.DIRECT;
  }

  public get amount(): Money {
    return this._amount;
  }

  public get dueAmount(): Money {
    return this._dueAmount;
  }

  public get dueCategory(): DueCategoryEnum {
    return this._dueCategory;
  }

  public get dueDate(): DateUtcVo {
    return this._dueDate;
  }

  public get dueId(): string {
    return this._dueId;
  }

  public get source(): PaymentDueSourceEnum {
    return this._source;
  }

  public static createOne(
    props: CreatePaymentDueNew,
  ): Result<PaymentDueNew, Error> {
    const paymentDue = new PaymentDueNew();

    const result = Result.combine([
      paymentDue.setAmount(props.amount),
      paymentDue.setDueAmount(props.dueAmount),
      paymentDue.setDueCategory(props.dueCategory),
      paymentDue.setDueDate(props.dueDate),
      paymentDue.setDueId(props.dueId),
      paymentDue.setSource(props.source),
    ]);

    if (result.isErr()) {
      return err(result.error);
    }

    return ok(paymentDue);
  }

  public setAmount(value: Money): Result<null, Error> {
    this._amount = value;

    return ok(null);
  }

  public setDueAmount(value: Money): Result<null, Error> {
    this._dueAmount = value;

    return ok(null);
  }

  public setDueCategory(value: DueCategoryEnum): Result<null, Error> {
    this._dueCategory = value;

    return ok(null);
  }

  public setDueDate(value: DateUtcVo): Result<null, Error> {
    this._dueDate = value;

    return ok(null);
  }

  public setDueId(value: string): Result<null, Error> {
    this._dueId = value;

    return ok(null);
  }

  public setSource(value: PaymentDueSourceEnum): Result<null, Error> {
    this._source = value;

    return ok(null);
  }
}
