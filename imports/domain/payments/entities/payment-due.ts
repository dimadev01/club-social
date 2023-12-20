import { Type } from 'class-transformer';
import { IsNumber, IsPositive, ValidateNested } from 'class-validator';
import { ok, Result } from 'neverthrow';
import { PaymentDueDue } from '@domain/payments/entities/payment-due-due';
import { CreatePaymentDue } from '@domain/payments/payment.types';
import { MoneyUtils } from '@shared/utils/currency.utils';

export class PaymentDue {
  @ValidateNested()
  @Type(() => PaymentDueDue)
  public due: PaymentDueDue;

  @IsNumber()
  @IsPositive()
  public amount: number;

  public get amountFormatted() {
    return MoneyUtils.formatCents(this.amount);
  }

  public static create(props: CreatePaymentDue): Result<PaymentDue, Error> {
    const paymentDue = new PaymentDue();

    paymentDue.amount = props.amount;

    paymentDue.due = props.due;

    return ok(paymentDue);
  }
}
