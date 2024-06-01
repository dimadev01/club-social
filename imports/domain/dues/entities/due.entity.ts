import { IsDate, IsEnum, IsInt, IsNotEmpty, IsString } from 'class-validator';
import { Result, err, ok } from 'neverthrow';

import { EntityOld } from '@domain/common/entity.old';
import { Money } from '@domain/common/value-objects/money.value-object';
import { DueCategoryEnum, DueStatusEnum } from '@domain/dues/due.enum';
import { CreateDue, CreateDuePayment } from '@domain/dues/due.types';
import { IsNullable } from '@shared/class-validator/is-nullable';
import { DateFormatEnum, DateUtils } from '@shared/utils/date.utils';
import { MoneyUtils } from '@shared/utils/money.utils';

export class Due extends EntityOld {
  @IsInt()
  public amount: number;

  @IsEnum(DueCategoryEnum)
  public category: DueCategoryEnum;

  @IsDate()
  public date: Date;

  @IsNotEmpty()
  @IsString()
  public memberId: string;

  @IsNotEmpty()
  @IsString()
  @IsNullable()
  public notes: string | null;

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
    if (this.category === DueCategoryEnum.MEMBERSHIP) {
      return DateUtils.formatUtc(this.date, DateFormatEnum.MMMM_YYYY);
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

    due.memberId = props.memberId;

    due.status = DueStatusEnum.PENDING;

    return ok(due);
  }

  public getPendingAmount(): number {
    if (this.isPending()) {
      return this.amount;
    }

    if (this.isPaid()) {
      return 0;
    }

    return this.amount;
  }

  public getAmountFormatted(): string {
    return new Money(this.amount).formatWithCurrency();
  }

  public isPaid() {
    return this.status === DueStatusEnum.PAID;
  }

  public isPartiallyPaid() {
    return this.status === DueStatusEnum.PARTIALLY_PAID;
  }

  public isPending() {
    return this.status === DueStatusEnum.PENDING;
  }

  public partiallyPaid(): Result<null, Error> {
    this.status = DueStatusEnum.PARTIALLY_PAID;

    return ok(null);
  }

  public pay(props: CreateDuePayment): Result<null, Error> {
    if (props.amount >= this.getPendingAmount()) {
      this.status = DueStatusEnum.PAID;
    } else {
      this.status = DueStatusEnum.PARTIALLY_PAID;
    }

    return ok(null);
  }

  public pending(): Result<null, Error> {
    this.status = DueStatusEnum.PENDING;

    return ok(null);
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

  public setMemberId(memberId: string): Result<null, Error> {
    this.memberId = memberId;

    return ok(null);
  }

  public setNotes(notes: string | null): Result<null, Error> {
    this.notes = notes;

    return ok(null);
  }
}
