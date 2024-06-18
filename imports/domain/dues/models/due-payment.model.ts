import { Result, err, ok } from 'neverthrow';

import { DomainError } from '@domain/common/errors/domain.error';
import { DateVo } from '@domain/common/value-objects/date.value-object';
import { Money } from '@domain/common/value-objects/money.value-object';
import { CreateDuePayment, IDuePayment } from '@domain/dues/due.interface';
import {
  PaymentDueSourceEnum,
  PaymentStatusEnum,
} from '@domain/payments/payment.enum';

export class DuePayment implements IDuePayment {
  private _creditAmount: Money;

  private _directAmount: Money;

  private _paymentDate: DateVo;

  private _paymentId: string;

  private _paymentReceiptNumber: number | null;

  private _paymentStatus: PaymentStatusEnum;

  private _source: PaymentDueSourceEnum;

  private _totalAmount: Money;

  public constructor(props?: IDuePayment) {
    this._totalAmount = props?.totalAmount ?? new Money();

    this._paymentDate = props?.paymentDate ?? new DateVo();

    this._paymentId = props?.paymentId ?? '';

    this._paymentReceiptNumber = props?.paymentReceiptNumber ?? null;

    this._creditAmount = props?.creditAmount ?? new Money();

    this._directAmount = props?.directAmount ?? new Money();

    this._source = props?.source ?? PaymentDueSourceEnum.MIXED;

    this._paymentStatus = props?.paymentStatus ?? PaymentStatusEnum.PAID;
  }

  public get creditAmount(): Money {
    return this._creditAmount;
  }

  public get directAmount(): Money {
    return this._directAmount;
  }

  public get paymentDate(): DateVo {
    return this._paymentDate;
  }

  public get paymentId(): string {
    return this._paymentId;
  }

  public get paymentReceiptNumber(): number | null {
    return this._paymentReceiptNumber;
  }

  public get paymentStatus(): PaymentStatusEnum {
    return this._paymentStatus;
  }

  public get source(): PaymentDueSourceEnum {
    return this._source;
  }

  public get totalAmount(): Money {
    return this._totalAmount;
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
      duePayment.setDirectAmount(props.directAmount),
      duePayment.setSource(props.source),
    ]);

    if (result.isErr()) {
      return err(result.error);
    }

    const creditPlusDirectAmount = duePayment.creditAmount.add(
      duePayment.directAmount,
    );

    if (!creditPlusDirectAmount.isEqual(duePayment.totalAmount)) {
      return err(
        new DomainError(
          'El monto total no coincide con la suma del monto de crédito y directo.',
        ),
      );
    }

    return ok(duePayment);
  }

  public isPaid() {
    return this._paymentStatus === PaymentStatusEnum.PAID;
  }

  public isVoided() {
    return this._paymentStatus === PaymentStatusEnum.VOIDED;
  }

  public void(): Result<null, Error> {
    return this.setPaymentStatus(PaymentStatusEnum.VOIDED);
  }

  private setCreditAmount(value: Money): Result<null, Error> {
    this._creditAmount = value;

    return ok(null);
  }

  private setDirectAmount(value: Money): Result<null, Error> {
    this._directAmount = value;

    return ok(null);
  }

  private setPaymentDate(value: DateVo): Result<null, Error> {
    if (value.isInTheFuture()) {
      return err(new DomainError('El pago no puede estar en el futuro'));
    }

    this._paymentDate = value;

    return ok(null);
  }

  private setPaymentId(value: string): Result<null, Error> {
    this._paymentId = value;

    return ok(null);
  }

  private setPaymentReceiptNumber(value: number | null): Result<null, Error> {
    if (value && value <= 0) {
      return err(new DomainError('El número de recibo no puede ser negativo.'));
    }

    this._paymentReceiptNumber = value;

    return ok(null);
  }

  private setPaymentStatus(value: PaymentStatusEnum): Result<null, Error> {
    if (this.isVoided()) {
      return err(new DomainError('No se puede modificar un pago anulado.'));
    }

    this._paymentStatus = value;

    return ok(null);
  }

  private setSource(value: PaymentDueSourceEnum): Result<null, Error> {
    this._source = value;

    return ok(null);
  }

  private setTotalAmount(value: Money): Result<null, Error> {
    this._totalAmount = value;

    return ok(null);
  }
}
