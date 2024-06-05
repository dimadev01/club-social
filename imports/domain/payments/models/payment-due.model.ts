import { Result, err, ok } from 'neverthrow';

import { Model } from '@domain/common/models/model';
import { Money } from '@domain/common/value-objects/money.value-object';
import { PaymentDueSourceEnum } from '@domain/payments/payment.enum';
import {
  CreatePaymentDue,
  IPaymentDue,
} from '@domain/payments/payment.interface';

export class PaymentDue extends Model implements IPaymentDue {
  private _amount: Money;

  private _dueId: string;

  private _paymentId: string;

  private _source: PaymentDueSourceEnum;

  public constructor(props?: IPaymentDue) {
    super(props);

    this._amount = props?.amount ?? new Money({ amount: 0 });

    this._dueId = props?.dueId ?? '';

    this._paymentId = props?.paymentId ?? '';

    this._source = props?.source ?? PaymentDueSourceEnum.DIRECT;
  }

  public get amount(): Money {
    return this._amount;
  }

  public get dueId(): string {
    return this._dueId;
  }

  public get paymentId(): string {
    return this._paymentId;
  }

  public get source(): PaymentDueSourceEnum {
    return this._source;
  }

  public setSource(value: PaymentDueSourceEnum): Result<null, Error> {
    this._source = value;

    return ok(null);
  }

  public static createOne(props: CreatePaymentDue): Result<PaymentDue, Error> {
    const paymentDue = new PaymentDue();

    const result = Result.combine([
      paymentDue.setAmount(props.amount),
      paymentDue.setDueId(props.dueId),
      paymentDue.setPaymentId(props.paymentId),
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

  public setDueId(value: string): Result<null, Error> {
    this._dueId = value;

    return ok(null);
  }

  public setPaymentId(value: string): Result<null, Error> {
    this._paymentId = value;

    return ok(null);
  }
}
