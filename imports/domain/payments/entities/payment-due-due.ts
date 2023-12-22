import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';
import { ok, Result } from 'neverthrow';
import { DueCategoryEnum } from '@domain/dues/due.enum';
import { CreatePaymentDueDue } from '@domain/payments/payment.types';
import { MoneyUtils } from '@shared/utils/currency.utils';
import { DateFormatEnum, DateUtils } from '@shared/utils/date.utils';

export class PaymentDueDue {
  @IsNotEmpty()
  @IsString()
  public _id: string;

  @IsNumber()
  @IsPositive()
  public amount: number;

  @IsEnum(DueCategoryEnum)
  public category: DueCategoryEnum;

  @IsDate()
  public date: Date;

  public get amountFormatted() {
    return MoneyUtils.formatCents(this.amount);
  }

  public get dateFormatted(): string {
    return DateUtils.formatUtc(this.date, DateFormatEnum.Date);
  }

  public get membershipMonth(): string {
    if (this.category === DueCategoryEnum.Membership) {
      return DateUtils.utc(this.date).format('MMMM');
    }

    return '-';
  }

  public static create(
    props: CreatePaymentDueDue
  ): Result<PaymentDueDue, Error> {
    const paymentDue = new PaymentDueDue();

    paymentDue._id = props.dueId;

    paymentDue.date = props.date;

    paymentDue.amount = props.amount;

    paymentDue.category = props.category;

    return ok(paymentDue);
  }
}
