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
import { CreatePaymentDue } from '@domain/payments/payment.types';

export class PaymentDue {
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

  public static create(props: CreatePaymentDue): Result<PaymentDue, Error> {
    const paymentDue = new PaymentDue();

    paymentDue._id = props._id;

    paymentDue.amount = props.amount;

    paymentDue.category = props.category;

    paymentDue.date = props.date;

    return ok(paymentDue);
  }
}
