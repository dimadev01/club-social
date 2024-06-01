import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';
import { Result, err, ok } from 'neverthrow';

import { EntityOld } from '@domain/common/entity.old';
import { PaymentStatusEnum } from '@domain/payments/payment.enum';
import { CreatePayment } from '@domain/payments/payment.types';
import { IsNullable } from '@shared/class-validator/is-nullable';
import { DateUtils } from '@shared/utils/date.utils';

export class PaymentOld extends EntityOld {
  @IsDate()
  public date!: Date;

  @IsNotEmpty()
  @IsString()
  public memberId!: string;

  @IsNotEmpty()
  @IsString()
  @IsNullable()
  public notes!: string | null;

  @IsPositive()
  @IsNumber()
  @IsNullable()
  public receiptNumber!: number | null;

  @IsEnum(PaymentStatusEnum)
  public status!: PaymentStatusEnum;

  public constructor() {
    super();
  }

  public get dateFormatted(): string {
    return DateUtils.formatUtc(this.date);
  }

  public static create(props: CreatePayment): Result<PaymentOld, Error> {
    const payment = new PaymentOld();

    const updateResult = Result.combine([
      payment.setDate(DateUtils.utc(props.date).toDate()),
      payment.setNotes(props.notes),
      payment.setReceiptNumber(props.receiptNumber),
    ]);

    if (updateResult.isErr()) {
      return err(updateResult.error);
    }

    payment.memberId = props.memberId;

    payment.status = PaymentStatusEnum.PAID;

    return ok(payment);
  }

  public setDate(date: Date): Result<null, Error> {
    this.date = date;

    return ok(null);
  }

  public setNotes(notes: string | null): Result<null, Error> {
    this.notes = notes;

    return ok(null);
  }

  public setReceiptNumber(receiptNumber: number | null): Result<null, Error> {
    this.receiptNumber = receiptNumber;

    return ok(null);
  }
}
