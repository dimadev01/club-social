import { Result, err, ok } from 'neverthrow';

import { DomainError } from '@domain/common/errors/domain.error';
import { Model } from '@domain/common/models/model';
import { DateVo } from '@domain/common/value-objects/date.value-object';
import { Money } from '@domain/common/value-objects/money.value-object';
import { Member } from '@domain/members/models/member.model';
import { PaymentReceiptNumberError } from '@domain/payments/errors/payment-receipt-number.error';
import { PaymentDue } from '@domain/payments/models/payment-due.model';
import { PaymentStatusEnum } from '@domain/payments/payment.enum';
import { CreatePayment, IPayment } from '@domain/payments/payment.interface';

export class Payment extends Model implements IPayment {
  private _amount: Money;

  private _date: DateVo;

  private _dues: PaymentDue[];

  private _memberId: string;

  private _notes: string | null;

  private _receiptNumber: number;

  private _status: PaymentStatusEnum;

  private _voidReason: string | null;

  private _voidedAt: DateVo | null;

  private _voidedBy: string | null;

  public member?: Member;

  public constructor(props?: IPayment, member?: Member) {
    super(props);

    this._date = props?.date ?? new DateVo();

    this._memberId = props?.memberId ?? '';

    this._notes = props?.notes ?? null;

    this._receiptNumber = props?.receiptNumber ?? 0;

    this._status = props?.status ?? PaymentStatusEnum.PAID;

    this._dues = props?.dues.map((due) => new PaymentDue(due)) ?? [];

    this._amount = props?.amount ?? new Money();

    this._voidedAt = props?.voidedAt ?? null;

    this._voidedBy = props?.voidedBy ?? null;

    this._voidReason = props?.voidReason ?? null;

    this.member = member;
  }

  public get amount(): Money {
    return this._amount;
  }

  public get date(): DateVo {
    return this._date;
  }

  public get dues(): PaymentDue[] {
    return this._dues;
  }

  public get memberId(): string {
    return this._memberId;
  }

  public get notes(): string | null {
    return this._notes;
  }

  public get receiptNumber(): number {
    return this._receiptNumber;
  }

  public get status(): PaymentStatusEnum {
    return this._status;
  }

  public get voidReason(): string | null {
    return this._voidReason;
  }

  public get voidedAt(): DateVo | null {
    return this._voidedAt;
  }

  public get voidedBy(): string | null {
    return this._voidedBy;
  }

  public static createOne(props: CreatePayment): Result<Payment, Error> {
    const payment = new Payment();

    const result = Result.combine([
      payment.setDate(props.date),
      payment.setMemberId(props.memberId),
      payment.setNotes(props.notes),
      payment.setReceiptNumber(props.receiptNumber),
      payment.setStatus(PaymentStatusEnum.PAID),
    ]);

    if (result.isErr()) {
      return err(result.error);
    }

    const addDuesResult = props.createDues.map((createPaymentDue) => {
      const paymentDue = PaymentDue.createOne(createPaymentDue);

      if (paymentDue.isErr()) {
        return err(paymentDue.error);
      }

      const addDueResult = payment.addDue(paymentDue.value);

      if (addDueResult.isErr()) {
        return err(addDueResult.error);
      }

      return ok(paymentDue.value);
    });

    const addPaymentDuesResultCombined = Result.combine(addDuesResult);

    if (addPaymentDuesResultCombined.isErr()) {
      return err(addPaymentDuesResultCombined.error);
    }

    if (payment.amount.isZero()) {
      return err(new DomainError('Payment amount cannot be zero'));
    }

    return ok(payment);
  }

  public isPaid(): boolean {
    return this._status === PaymentStatusEnum.PAID;
  }

  public isVoidable(): boolean {
    return this.isPaid();
  }

  public isVoided(): boolean {
    return this._status === PaymentStatusEnum.VOIDED;
  }

  public void(voidedBy: string, voidReason: string): Result<null, Error> {
    this._voidedAt = new DateVo();

    this._voidedBy = voidedBy;

    this._voidReason = voidReason;

    return this.setStatus(PaymentStatusEnum.VOIDED);
  }

  private addDue(paymentDue: PaymentDue): Result<null, Error> {
    this._dues.push(paymentDue);

    this._amount = this._amount.add(paymentDue.totalAmount);

    return ok(null);
  }

  private setDate(value: DateVo): Result<null, Error> {
    this._date = value;

    return ok(null);
  }

  private setMemberId(value: string): Result<null, Error> {
    this._memberId = value;

    return ok(null);
  }

  private setNotes(value: string | null): Result<null, Error> {
    this._notes = value;

    return ok(null);
  }

  private setReceiptNumber(value: number): Result<null, Error> {
    if (value <= 0) {
      return err(new PaymentReceiptNumberError());
    }

    this._receiptNumber = value;

    return ok(null);
  }

  private setStatus(value: PaymentStatusEnum): Result<null, Error> {
    this._status = value;

    return ok(null);
  }
}
