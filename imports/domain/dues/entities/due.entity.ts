import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsInt, ValidateNested } from 'class-validator';
import { err, ok, Result } from 'neverthrow';
import { Entity } from '@domain/common/entity';
import { DueCategoryEnum, DueStatusEnum } from '@domain/dues/due.enum';
import { CreateDue } from '@domain/dues/due.types';
import { DueMember } from '@domain/dues/entities/due-member';
import { MoneyUtils } from '@shared/utils/currency.utils';
import { DateFormatEnum, DateUtils } from '@shared/utils/date.utils';

export class Due extends Entity {
  @IsInt()
  public amount: number;

  @IsEnum(DueCategoryEnum)
  public category: DueCategoryEnum;

  @IsEnum(DueStatusEnum)
  public status: DueStatusEnum;

  @IsDate()
  public date: Date;

  @ValidateNested()
  @Type(() => DueMember)
  public member: DueMember;

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

    const updateResult: Result<[null], Error> = Result.combine([
      due.setAmount(props.amount),
    ]);

    if (updateResult.isErr()) {
      return err(updateResult.error);
    }

    const dueMember = DueMember.create({ _id: props.memberId });

    if (dueMember.isErr()) {
      return err(dueMember.error);
    }

    due.status = DueStatusEnum.Pending;

    due.date = DateUtils.utc(props.date).toDate();

    return ok(due);
  }

  public setAmount(amount: number): Result<null, Error> {
    this.amount = amount;

    return ok(null);
  }
}
