import { Type } from 'class-transformer';
import {
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

  @ValidateNested()
  @Type(() => DuePayment)
  @IsNullable()
  public payment: DuePayment | null;

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

    due.payment = null;

    due.status = DueStatusEnum.Pending;

    return ok(due);
  }

  public getPendingAmount(): number {
    if (this.isPaid()) {
      return 0;
    }

    if (this.isPending()) {
      return this.amount;
    }

    invariant(this.payment);

    return this.amount - this.payment.amount;
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

  public paid(props: CreateDuePayment): Result<null, Error> {
    const payment = DuePayment.create(props);

    if (payment.isErr()) {
      return err(payment.error);
    }

    this.payment = payment.value;

    if (props.amount >= this.amount) {
      this.status = DueStatusEnum.Paid;
    } else {
      this.status = DueStatusEnum.PartiallyPaid;
    }

    return ok(null);
  }

  public pending(): Result<null, Error> {
    this.payment = null;

    this.status = DueStatusEnum.Pending;

    return ok(null);
  }

  public removePayment() {
    this.payment = null;

    this.status = DueStatusEnum.Pending;
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
