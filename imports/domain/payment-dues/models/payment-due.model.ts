import { Result, err, ok } from 'neverthrow';

import { Model } from '@domain/common/models/model';
import { IPaymentDueModel } from '@domain/payment-dues/models/payment-due-model.interface';

export class PaymentDueModel extends Model implements IPaymentDueModel {
  private _amount: number;

  private _dueId: string;

  private _paymentId: string;

  public constructor(props?: IPaymentDueModel) {
    super(props);

    this._amount = props?.amount ?? 0;

    this._dueId = props?.dueId ?? '';

    this._paymentId = props?.paymentId ?? '';
  }

  public get amount(): number {
    return this._amount;
  }

  public get dueId(): string {
    return this._dueId;
  }

  public get paymentId(): string {
    return this._paymentId;
  }

  public static createOne(
    props: IPaymentDueModel,
  ): Result<PaymentDueModel, Error> {
    const paymentDue = new PaymentDueModel();

    const result = Result.combine([
      paymentDue.setAmount(props.amount),
      paymentDue.setDueId(props.dueId),
      paymentDue.setPaymentId(props.paymentId),
    ]);

    if (result.isErr()) {
      return err(result.error);
    }

    return ok(paymentDue);
  }

  public setAmount(value: number): Result<null, Error> {
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
