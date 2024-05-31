import { Result, err, ok } from 'neverthrow';

import { Model } from '@domain/common/models/model';
import { DayjsDate } from '@domain/common/value-objects/dayjs-date.value-object';
import {
  CreatePayment,
  IPaymentModel,
} from '@domain/payments/models/payment-model.interface';
import { PaymentStatusEnum } from '@domain/payments/payment.enum';

export class PaymentModel extends Model implements IPaymentModel {
  private _date: DayjsDate;

  private _memberId: string;

  private _notes: string | null;

  private _receiptNumber: number | null;

  private _status: PaymentStatusEnum;

  public constructor(props?: IPaymentModel) {
    super(props);

    this._date = props?.date ?? new DayjsDate();

    this._memberId = props?.memberId ?? '';

    this._notes = props?.notes ?? null;

    this._receiptNumber = props?.receiptNumber ?? null;

    this._status = props?.status ?? PaymentStatusEnum.PAID;
  }

  public get date(): DayjsDate {
    return this._date;
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

  public static createOne(props: CreatePayment): Result<PaymentModel, Error> {
    const payment = new PaymentModel();

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

  public setDate(value: DayjsDate): Result<null, Error> {
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
