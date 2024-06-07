import { Result, err, ok } from 'neverthrow';

import { Model } from '@domain/common/models/model';
import { DateUtcVo } from '@domain/common/value-objects/date-utc.value-object';
import { Money } from '@domain/common/value-objects/money.value-object';
import { Member } from '@domain/members/models/member.model';
import { PaymentDue } from '@domain/payments/models/payment-due.model';
import { PaymentStatusEnum } from '@domain/payments/payment.enum';
import {
  CreatePayment,
  CreatePaymentDue,
  IPayment,
} from '@domain/payments/payment.interface';

export class Payment extends Model implements IPayment {
  private _amount: Money;

  private _date: DateUtcVo;

  private _dues: PaymentDue[];

  private _memberId: string;

  private _notes: string | null;

  private _receiptNumber: number | null;

  private _status: PaymentStatusEnum;

  private _voidReason: string | null;

  private _voidedAt: DateUtcVo | null;

  private _voidedBy: string | null;

  public member?: Member;

  public constructor(props?: IPayment, member?: Member) {
    super(props);

    this._date = props?.date ?? new DateUtcVo();

    this._memberId = props?.memberId ?? '';

    this._notes = props?.notes ?? null;

    this._receiptNumber = props?.receiptNumber ?? null;

    this._status = props?.status ?? PaymentStatusEnum.PAID;

    this._dues = props?.dues.map((due) => new PaymentDue(due)) ?? [];

    this._amount = props?.amount ?? new Money({ amount: 0 });

    this._voidedAt = props?.voidedAt ?? null;

    this._voidedBy = props?.voidedBy ?? null;

    this._voidReason = props?.voidReason ?? null;

    this.member = member;
  }

  public get amount(): Money {
    return this._amount;
  }

  public get date(): DateUtcVo {
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

  public get receiptNumber(): number | null {
    return this._receiptNumber;
  }

  public get status(): PaymentStatusEnum {
    return this._status;
  }

  public get voidReason(): string | null {
    return this._voidReason;
  }

  public get voidedAt(): DateUtcVo | null {
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

    const addDues = props.dues.map((due) => payment.addDue(due));

    const addDuesResult = Result.combine(addDues);

    if (addDuesResult.isErr()) {
      return err(addDuesResult.error);
    }

    return ok(payment);
  }

  public addDue(props: CreatePaymentDue): Result<PaymentDue, Error> {
    const paymentDue = PaymentDue.createOne(props);

    if (paymentDue.isErr()) {
      return err(paymentDue.error);
    }

    this._dues.push(paymentDue.value);

    this._amount = this._amount.add(paymentDue.value.amount);

    return ok(paymentDue.value);
  }

  public void(voidedBy: string, voidReason: string): Result<null, Error> {
    this._voidedAt = new DateUtcVo();

    this._voidedBy = voidedBy;

    this._voidReason = voidReason;

    return this.setStatus(PaymentStatusEnum.VOIDED);
  }

  private setDate(value: DateUtcVo): Result<null, Error> {
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

  private setReceiptNumber(value: number | null): Result<null, Error> {
    this._receiptNumber = value;

    return ok(null);
  }

  private setStatus(value: PaymentStatusEnum): Result<null, Error> {
    this._status = value;

    return ok(null);
  }
}
