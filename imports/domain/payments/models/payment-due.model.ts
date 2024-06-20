import { Result, err, ok } from 'neverthrow';

import { DomainError } from '@domain/common/errors/domain.error';
import { DateVo } from '@domain/common/value-objects/date.value-object';
import { Money } from '@domain/common/value-objects/money.value-object';
import { DueCategoryEnum } from '@domain/dues/due.enum';
import { PaymentDueSourceEnum } from '@domain/payments/payment.enum';
import {
  CreatePaymentDue,
  IPaymentDue,
} from '@domain/payments/payment.interface';

export class PaymentDue implements IPaymentDue {
  private _creditAmount: Money;

  private _debitAmount: Money;

  private _dueAmount: Money;

  private _dueCategory: DueCategoryEnum;

  private _dueDate: DateVo;

  private _dueId: string;

  private _duePendingAmount: Money;

  private _source: PaymentDueSourceEnum;

  private _totalAmount: Money;

  public constructor(props?: IPaymentDue) {
    this._debitAmount = props?.directAmount ?? Money.from();

    this._dueAmount = props?.dueAmount ?? Money.from();

    this._dueCategory = props?.dueCategory ?? DueCategoryEnum.MEMBERSHIP;

    this._dueDate = props?.dueDate ?? new DateVo();

    this._dueId = props?.dueId ?? '';

    this._creditAmount = props?.creditAmount ?? Money.from();

    this._debitAmount = props?.directAmount ?? Money.from();

    this._totalAmount = props?.totalAmount ?? Money.from();

    this._duePendingAmount = props?.duePendingAmount ?? Money.from();

    this._source = props?.source ?? PaymentDueSourceEnum.DIRECT;
  }

  public get creditAmount(): Money {
    return this._creditAmount;
  }

  public get directAmount(): Money {
    return this._debitAmount;
  }

  public get dueAmount(): Money {
    return this._dueAmount;
  }

  public get dueCategory(): DueCategoryEnum {
    return this._dueCategory;
  }

  public get dueDate(): DateVo {
    return this._dueDate;
  }

  public get dueId(): string {
    return this._dueId;
  }

  public get duePendingAmount(): Money {
    return this._duePendingAmount;
  }

  public get source(): PaymentDueSourceEnum {
    return this._source;
  }

  public get totalAmount(): Money {
    return this._totalAmount;
  }

  public static create(props: CreatePaymentDue): Result<PaymentDue, Error> {
    const paymentDue = new PaymentDue();

    let source: PaymentDueSourceEnum;

    if (props.creditAmount.isZero()) {
      source = PaymentDueSourceEnum.DIRECT;
    } else if (props.directAmount.isZero()) {
      source = PaymentDueSourceEnum.CREDIT;
    } else {
      source = PaymentDueSourceEnum.MIXED;
    }

    const totalAmount = props.directAmount.add(props.creditAmount);

    const result = Result.combine([
      paymentDue.setDebitAmount(props.directAmount),
      paymentDue.setCreditAmount(props.creditAmount),
      paymentDue.setDueAmount(props.dueAmount),
      paymentDue.setDueCategory(props.dueCategory),
      paymentDue.setDueDate(props.dueDate),
      paymentDue.setDueId(props.dueId),
      paymentDue.setSource(source),
      paymentDue.setDuePendingAmount(props.duePendingAmount),
      paymentDue.setTotalAmount(totalAmount),
    ]);

    if (result.isErr()) {
      return err(result.error);
    }

    return ok(paymentDue);
  }

  private setCreditAmount(value: Money): Result<null, Error> {
    this._creditAmount = value;

    return ok(null);
  }

  private setDebitAmount(value: Money): Result<null, Error> {
    this._debitAmount = value;

    return ok(null);
  }

  private setDueAmount(value: Money): Result<null, Error> {
    this._dueAmount = value;

    return ok(null);
  }

  private setDueCategory(value: DueCategoryEnum): Result<null, Error> {
    this._dueCategory = value;

    return ok(null);
  }

  private setDueDate(value: DateVo): Result<null, Error> {
    this._dueDate = value;

    return ok(null);
  }

  private setDueId(value: string): Result<null, Error> {
    this._dueId = value;

    return ok(null);
  }

  private setDuePendingAmount(value: Money): Result<null, Error> {
    this._duePendingAmount = value;

    return ok(null);
  }

  private setSource(value: PaymentDueSourceEnum): Result<null, Error> {
    this._source = value;

    return ok(null);
  }

  private setTotalAmount(value: Money): Result<null, Error> {
    if (value.isZero()) {
      return err(new DomainError('Total amount cannot be zero'));
    }

    this._totalAmount = value;

    return ok(null);
  }
}
