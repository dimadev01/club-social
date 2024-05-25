import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
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
import { MoneyUtils } from '@shared/utils/money.utils';
import { DateUtils } from '@shared/utils/date.utils';

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

  @IsNotEmpty()
  @IsString()
  @IsNullable()
  public notes: string | null;

  @IsPositive()
  @IsNumber()
  @IsNullable()
  public receiptNumber: number | null;

  @IsEnum(PaymentStatusEnum)
  public status: PaymentStatusEnum;

  public constructor() {
    super();
  }

  public get dateFormatted(): string {
    return DateUtils.formatUtc(this.date);
  }

  public get duesCount(): number {
    return this.dues.length;
  }

  public get totalDuesAmount(): number {
    return this.dues.reduce((acc, due) => acc + due.due.amount, 0);
  }

  public get totalDuesPaidAmount(): number {
    return this.dues.reduce((acc, due) => acc + due.amount, 0);
  }

  public get totalDuesPaidAmountFormatted(): string {
    return MoneyUtils.formatCents(this.totalDuesPaidAmount);
  }

  public static create(props: CreatePayment): Result<Payment, Error> {
    const payment = new Payment();

    const updateResult = Result.combine([
      payment.setDate(DateUtils.utc(props.date).toDate()),
      payment.setNotes(props.notes),
      payment.setDues(props.dues),
      payment.setReceiptNumber(props.receiptNumber),
    ]);

    if (updateResult.isErr()) {
      return err(updateResult.error);
    }

    payment.member = props.member;

    payment.status = PaymentStatusEnum.Paid;

    return ok(payment);
  }

  public setDate(date: Date): Result<null, Error> {
    this.date = date;

    return ok(null);
  }

  public setDues(value: PaymentDue[]): Result<null, Error> {
    this.dues = value;

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
