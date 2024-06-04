import { Result, err, ok } from 'neverthrow';
import invariant from 'tiny-invariant';

import { Model } from '@domain/common/models/model';
import { DateUtcVo } from '@domain/common/value-objects/date-utc.value-object';
import { Member } from '@domain/members/models/member.model';
import { PaymentDue } from '@domain/payments/models/payment-due.model';
import { PaymentStatusEnum } from '@domain/payments/payment.enum';
import { CreatePayment, IPayment } from '@domain/payments/payment.interface';

export class Payment extends Model implements IPayment {
  private _date: DateUtcVo;

  private _paymentDues: PaymentDue[] | undefined;

  private _member?: Member;

  private _memberId: string;

  private _notes: string | null;

  private _receiptNumber: number | null;

  private _status: PaymentStatusEnum;

  public constructor(props?: IPayment, member?: Member, dues?: PaymentDue[]) {
    super(props);

    this._date = props?.date ?? new DateUtcVo();

    this._memberId = props?.memberId ?? '';

    this._notes = props?.notes ?? null;

    this._receiptNumber = props?.receiptNumber ?? null;

    this._status = props?.status ?? PaymentStatusEnum.PAID;

    this._member = member;

    this.paymentDues = dues;
  }

  public get date(): DateUtcVo {
    return this._date;
  }

  public get paymentDues(): PaymentDue[] | undefined {
    return this._paymentDues;
  }

  public set paymentDues(value: PaymentDue[] | undefined) {
    this._paymentDues = value;
  }

  public get member(): Member | undefined {
    return this._member;
  }

  public set member(value: Member | undefined) {
    this._member = value;
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

  public static createOne(props: CreatePayment): Result<Payment, Error> {
    const payment = new Payment();

    const result = Result.combine([
      payment.setDate(props.date),
      payment.setMemberId(props.memberId),
      payment.setNotes(props.notes),
      payment.setReceiptNumber(props.receiptNumber),
    ]);

    if (result.isErr()) {
      return err(result.error);
    }

    return ok(payment);
  }

  public getTotalAmountOfDues(): number {
    invariant(this.paymentDues);

    return this.paymentDues.reduce((acc, due) => acc + due.amount.amount, 0);
  }

  public setDate(value: DateUtcVo): Result<null, Error> {
    this._date = value;

    return ok(null);
  }

  public setMemberId(value: string): Result<null, Error> {
    this._memberId = value;

    return ok(null);
  }

  public setNotes(value: string | null): Result<null, Error> {
    this._notes = value;

    return ok(null);
  }

  public setReceiptNumber(value: number | null): Result<null, Error> {
    this._receiptNumber = value;

    return ok(null);
  }

  public setStatus(value: PaymentStatusEnum): Result<null, Error> {
    this._status = value;

    return ok(null);
  }
}
