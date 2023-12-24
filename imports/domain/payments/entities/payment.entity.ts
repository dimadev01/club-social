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
import { MoneyUtils } from '@shared/utils/currency.utils';
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

  public get totalDuesAmount(): string {
    return MoneyUtils.formatCents(
      this.dues.reduce((acc, due) => acc + due.amount, 0)
    );
  }

  public static create(props: CreatePayment): Result<Payment, Error> {
    const payment = new Payment();

    const updateResult: Result<[null, null, null], Error> = Result.combine([
      payment.setDate(DateUtils.utc(props.date).toDate()),
      payment.setNotes(props.notes),
      payment.setDues(props.dues),
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
}
