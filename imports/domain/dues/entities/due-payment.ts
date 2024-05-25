import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';
import { ok, Result } from 'neverthrow';
import { CreateDuePayment } from '@domain/dues/due.types';
import { MoneyUtils } from '@shared/utils/money.utils';
import { DateUtils } from '@shared/utils/date.utils';

export class DuePayment {
  @IsNotEmpty()
  @IsString()
  public _id: string;

  @IsPositive()
  @IsNumber()
  public amount: number;

  @IsDate()
  public date: Date;

  public get amountFormatted(): string {
    return MoneyUtils.formatCents(this.amount);
  }

  public get dateFormatted(): string {
    return DateUtils.formatUtc(this.date);
  }

  public static create(props: CreateDuePayment): Result<DuePayment, Error> {
    const duePayment = new DuePayment();

    duePayment._id = props._id;

    duePayment.amount = props.amount;

    duePayment.date = props.date;

    return ok(duePayment);
  }
}
