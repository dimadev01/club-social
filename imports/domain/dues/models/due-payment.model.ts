import { Result, err, ok } from 'neverthrow';

import { DateUtcVo } from '@domain/common/value-objects/date-utc.value-object';
import { Money } from '@domain/common/value-objects/money.value-object';
import { CreateDuePayment, IDuePayment } from '@domain/dues/due.interface';
import {
  PaymentDueSourceEnum,
  PaymentStatusEnum,
} from '@domain/payments/payment.enum';

export class DuePayment implements IDuePayment {
  private _amount: Money;

  private _creditAmount: Money;

  private _paymentDate: DateUtcVo;

  private _debitAmount: Money;

  private _paymentId: string;

  private _paymentReceiptNumber: number | null;

  private _source: PaymentDueSourceEnum;

  private _paymentStatus: PaymentStatusEnum;

  public constructor(props?: IDuePayment) {
    this._amount = props?.totalAmount ?? new Money();

    this._paymentDate = props?.paymentDate ?? new DateUtcVo();

    this._paymentId = props?.paymentId ?? '';

    this._paymentReceiptNumber = props?.paymentReceiptNumber ?? null;

    this._creditAmount = props?.creditAmount ?? new Money();

    this._debitAmount = props?.directAmount ?? new Money();

    this._source = props?.source ?? PaymentDueSourceEnum.MIXED;

    this._paymentStatus = props?.paymentStatus ?? PaymentStatusEnum.PAID;
  }

  public get creditAmount(): Money {
    return this._creditAmount;
  }

  public get paymentDate(): DateUtcVo {
    return this._paymentDate;
  }

  public get directAmount(): Money {
    return this._debitAmount;
  }

  public get paymentId(): string {
    return this._paymentId;
  }

  public get paymentReceiptNumber(): number | null {
    return this._paymentReceiptNumber;
  }

  public get source(): PaymentDueSourceEnum {
    return this._source;
  }

  public get paymentStatus(): PaymentStatusEnum {
    return this._paymentStatus;
  }

  public get totalAmount(): Money {
    return this._amount;
  }

  public static createOne(props: CreateDuePayment): Result<DuePayment, Error> {
    const duePayment = new DuePayment();

    const result = Result.combine([
      duePayment.setTotalAmount(props.totalAmount),
      duePayment.setPaymentDate(props.date),
      duePayment.setPaymentId(props.paymentId),
      duePayment.setPaymentReceiptNumber(props.receiptNumber),
      duePayment.setPaymentStatus(PaymentStatusEnum.PAID),
      duePayment.setCreditAmount(props.creditAmount),
      duePayment.setDebitAmount(props.directAmount),
      duePayment.setSource(props.source),
    ]);

    if (result.isErr()) {
      return err(result.error);
    }

    return ok(duePayment);
  }

  public void(): Result<null, Error> {
    return this.setPaymentStatus(PaymentStatusEnum.VOIDED);
  }

  private setCreditAmount(value: Money): Result<null, Error> {
    this._creditAmount = value;

    return ok(null);
  }

  private setPaymentDate(value: DateUtcVo): Result<null, Error> {
    this._paymentDate = value;

    return ok(null);
  }

  private setDebitAmount(value: Money): Result<null, Error> {
    this._debitAmount = value;

    return ok(null);
  }

  private setPaymentId(value: string): Result<null, Error> {
    this._paymentId = value;

    return ok(null);
  }

  private setPaymentReceiptNumber(value: number | null): Result<null, Error> {
    this._paymentReceiptNumber = value;

    return ok(null);
  }

  private setSource(value: PaymentDueSourceEnum): Result<null, Error> {
    this._source = value;

    return ok(null);
  }

  private setPaymentStatus(value: PaymentStatusEnum): Result<null, Error> {
    this._paymentStatus = value;

    return ok(null);
  }

  private setTotalAmount(value: Money): Result<null, Error> {
    this._amount = value;

    return ok(null);
  }
}
