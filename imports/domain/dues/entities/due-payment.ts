import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';
import { ok, Result } from 'neverthrow';
import { CreateDuePayment } from '@domain/dues/due.types';
import { MoneyUtils } from '@shared/utils/currency.utils';
import { DateFormatEnum, DateUtils } from '@shared/utils/date.utils';

export class DuePayment {
  @IsNotEmpty()
  @IsString()
  public _id: string;

  @IsDate()
  public date: Date;

  public get dateFormatted(): string {
    return DateUtils.utc(this.date).format(DateFormatEnum.DDMMYYYY);
  }

  @IsPositive()
  @IsNumber()
  public amount: number;

  public get amountFormatted(): string {
    return MoneyUtils.formatCents(this.amount);
  }

  public static create(props: CreateDuePayment): Result<DuePayment, Error> {
    const duePayment = new DuePayment();

    duePayment._id = props._id;

    duePayment.amount = props.amount;

    duePayment.date = props.date;

    return ok(duePayment);
  }
}
