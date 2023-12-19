import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { err, ok, Result } from 'neverthrow';
import { Entity } from '@domain/common/entity';
import { PaymentDue } from '@domain/payments/entities/payment-due';
import { PaymentMember } from '@domain/payments/entities/payment-member';
import { PaymentStatusEnum } from '@domain/payments/payment.enum';
import { CreatePayment } from '@domain/payments/payment.types';
import { IsNullable } from '@shared/class-validator/is-nullable';
import { DateFormatEnum, DateUtils } from '@shared/utils/date.utils';

export class Payment extends Entity {
  @IsDate()
  public date: Date;

  @ValidateNested({ each: true })
  @Type(() => PaymentDue)
  @ArrayMinSize(1)
  @IsArray()
  public dues: PaymentDue[];

  @ValidateNested()
  @Type(() => PaymentMember)
  public member: PaymentMember;

  @IsString()
  @IsNotEmpty()
  @IsNullable()
  public notes: string | null;

  @IsEnum(PaymentStatusEnum)
  public status: PaymentStatusEnum;

  public constructor() {
    super();
  }

  public get dateFormatted(): string {
    return DateUtils.formatUtc(this.date, DateFormatEnum.DDMMYYYY);
  }

  public static create(props: CreatePayment): Result<Payment, Error> {
    const payment = new Payment();

    const updateResult: Result<[null, null], Error> = Result.combine([
      payment.setDate(DateUtils.utc(props.date).toDate()),
      payment.setNotes(props.notes),
    ]);

    if (updateResult.isErr()) {
      return err(updateResult.error);
    }

    payment.dues = props.dues;

    payment.member = props.member;

    payment.status = PaymentStatusEnum.Paid;

    return ok(payment);
  }

  public cancel(): Result<null, Error> {
    this.status = PaymentStatusEnum.Canceled;

    return ok(null);
  }

  public setDate(date: Date): Result<null, Error> {
    this.date = date;

    return ok(null);
  }

  public setNotes(notes: string | null): Result<null, Error> {
    this.notes = notes;

    return ok(null);
  }
}
