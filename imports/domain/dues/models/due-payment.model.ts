import { Result, err, ok } from 'neverthrow';

import { DateUtcVo } from '@domain/common/value-objects/date-utc.value-object';
import { Money } from '@domain/common/value-objects/money.value-object';
import { CreateDuePayment, IDuePayment } from '@domain/dues/due.interface';
import { PaymentStatusEnum } from '@domain/payments/payment.enum';

export class DuePayment implements IDuePayment {
  private _amount: Money;

  private _date: DateUtcVo;

  private _paymentId: string;

  private _receiptNumber: number | null;

  private _status: PaymentStatusEnum;

  public constructor(props?: IDuePayment) {
    this._amount = props?.amount ?? new Money();

    this._date = props?.date ?? new DateUtcVo();

    this._paymentId = props?.paymentId ?? '';

    this._receiptNumber = props?.receiptNumber ?? null;

    this._status = props?.status ?? PaymentStatusEnum.PAID;
  }

  public get amount(): Money {
    return this._amount;
  }

  public get date(): DateUtcVo {
    return this._date;
  }

  public get paymentId(): string {
    return this._paymentId;
  }

  public get receiptNumber(): number | null {
    return this._receiptNumber;
  }

  public get status(): PaymentStatusEnum {
    return this._status;
  }

  public static createOne(props: CreateDuePayment): Result<DuePayment, Error> {
    const duePayment = new DuePayment();

    const result = Result.combine([
      duePayment.setAmount(props.amount),
      duePayment.setDate(props.date),
      duePayment.setPaymentId(props.paymentId),
      duePayment.setReceiptNumber(props.receiptNumber),
      duePayment.setStatus(PaymentStatusEnum.PAID),
    ]);

    if (result.isErr()) {
      return err(result.error);
    }

    return ok(duePayment);
  }

  public void(): Result<null, Error> {
    return this.setStatus(PaymentStatusEnum.VOIDED);
  }

  private setAmount(value: Money): Result<null, Error> {
    this._amount = value;

    return ok(null);
  }

  private setDate(value: DateUtcVo): Result<null, Error> {
    this._date = value;

    return ok(null);
  }

  private setPaymentId(value: string): Result<null, Error> {
    this._paymentId = value;

    return ok(null);
  }

  private setReceiptNumber(value: number | null): Result<null, Error> {
    this._receiptNumber = value;

    return ok(null);
  }

  private setStatus(value: PaymentStatusEnum): Result<null, Error> {
    this._status = value;

    return ok(null);
  }
}
