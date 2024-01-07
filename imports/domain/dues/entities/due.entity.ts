import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { err, ok, Result } from 'neverthrow';
import invariant from 'ts-invariant';
import { Entity } from '@domain/common/entity';
import { DueCategoryEnum, DueStatusEnum } from '@domain/dues/due.enum';
import { CreateDue, CreateDuePayment } from '@domain/dues/due.types';
import { DueMember } from '@domain/dues/entities/due-member';
import { DuePayment } from '@domain/dues/entities/due-payment';
import { IsNullable } from '@shared/class-validator/is-nullable';
import { MoneyUtils } from '@shared/utils/currency.utils';
import { DateFormatEnum, DateUtils } from '@shared/utils/date.utils';

export class Due extends Entity {
  @IsInt()
  public amount: number;

  @IsEnum(DueCategoryEnum)
  public category: DueCategoryEnum;

  @IsDate()
  public date: Date;

  @ValidateNested()
  @Type(() => DueMember)
  public member: DueMember;

  @IsNotEmpty()
  @IsString()
  @IsNullable()
  public notes: string | null;

  @ValidateNested({ each: true })
  @Type(() => DuePayment)
  @ArrayMinSize(1)
  @IsArray()
  @IsNullable()
  public payments: DuePayment[] | null;

  @IsEnum(DueStatusEnum)
  public status: DueStatusEnum;

  public constructor() {
    super();
  }

  public get amountFormatted(): string {
    return MoneyUtils.formatCents(this.amount);
  }

  public get dateFormatted(): string {
    return DateUtils.formatUtc(this.date);
  }

  public get membershipMonth(): string {
    if (this.category === DueCategoryEnum.Membership) {
      return DateUtils.formatUtc(this.date, DateFormatEnum.MMMM);
    }

    return '-';
  }

  public get paidAmount(): number {
    if (!this.payments) {
      return 0;
    }

    return this.payments.reduce(
      (acc: number, payment: DuePayment) => acc + payment.amount,
      0
    );
  }

  public get paidAmountFormatted(): string {
    return MoneyUtils.formatCents(this.paidAmount);
  }

  public static create(props: CreateDue): Result<Due, Error> {
    const due = new Due();

    const updateResult: Result<[null, null, null], Error> = Result.combine([
      due.setAmount(props.amount),
      due.setDate(DateUtils.utc(props.date).toDate()),
      due.setNotes(props.notes),
    ]);

    if (updateResult.isErr()) {
      return err(updateResult.error);
    }

    due.category = props.category;

    due.member = props.member;

    due.payments = null;

    due.status = DueStatusEnum.Pending;

    return ok(due);
  }

  public getPendingAmount(): number {
    if (this.isPending()) {
      return this.amount;
    }

    if (this.isPaid()) {
      return 0;
    }

    invariant(this.payments);

    const paymentsAmount = this.payments.reduce(
      (acc: number, payment: DuePayment) => acc + payment.amount,
      0
    );

    return this.amount - paymentsAmount;
  }

  public getPendingAmountFormatted(): string {
    return MoneyUtils.formatCents(this.getPendingAmount());
  }

  public isPaid() {
    return this.status === DueStatusEnum.Paid;
  }

  public isPartiallyPaid() {
    return this.status === DueStatusEnum.PartiallyPaid;
  }

  public isPending() {
    return this.status === DueStatusEnum.Pending;
  }

  public partiallyPaid(): Result<null, Error> {
    this.status = DueStatusEnum.PartiallyPaid;

    return ok(null);
  }

  public pay(props: CreateDuePayment): Result<null, Error> {
    const duePayment = DuePayment.create(props);

    if (duePayment.isErr()) {
      return err(duePayment.error);
    }

    if (this.isPending()) {
      this.payments = [duePayment.value];
    } else if (this.isPartiallyPaid()) {
      invariant(this.payments);

      this.payments.push(duePayment.value);
    }

    if (props.amount >= this.getPendingAmount()) {
      this.status = DueStatusEnum.Paid;
    } else {
      this.status = DueStatusEnum.PartiallyPaid;
    }

    return ok(null);
  }

  public pending(): Result<null, Error> {
    this.payments = null;

    this.status = DueStatusEnum.Pending;

    return ok(null);
  }

  public removePayment(paymentId: string): Result<null, Error> {
    invariant(this.payments);

    this.payments = this.payments.filter(
      (payment) => payment._id !== paymentId
    );

    if (this.payments.length === 0) {
      return this.pending();
    }

    return this.partiallyPaid();
  }

  public setAmount(amount: number): Result<null, Error> {
    this.amount = amount;

    return ok(null);
  }

  public setCategory(category: DueCategoryEnum): Result<null, Error> {
    this.category = category;

    return ok(null);
  }

  public setDate(date: Date): Result<null, Error> {
    this.date = date;

    return ok(null);
  }

  public setMember(member: DueMember): Result<null, Error> {
    this.member = member;

    return ok(null);
  }

  public setNotes(notes: string | null): Result<null, Error> {
    this.notes = notes;

    return ok(null);
  }
}
