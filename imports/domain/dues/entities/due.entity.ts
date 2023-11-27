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
import { Entity } from '@domain/common/entity';
import { DueCategoryEnum, DueStatusEnum } from '@domain/dues/due.enum';
import { CreateDue } from '@domain/dues/due.types';
import { DueMember } from '@domain/dues/entities/due-member';
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

  @IsString()
  @IsNotEmpty()
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
    return DateUtils.formatUtc(this.date, DateFormatEnum.DDMMYYYY);
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

    due.status = DueStatusEnum.Pending;

    return ok(due);
  }

  public setAmount(amount: number): Result<null, Error> {
    this.amount = amount;

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
