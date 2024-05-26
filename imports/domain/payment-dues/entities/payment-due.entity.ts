import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';
import { Entity } from '@domain/common/entity';
import { Result, ok } from 'neverthrow';

export interface CreatePaymentDue {
  amount: number;
  dueId: string;
  paymentId: string;
}

export class PaymentDue extends Entity {
  @IsPositive()
  @IsNumber()
  public amount: number;

  @IsNotEmpty()
  @IsString()
  public dueId: string;

  @IsNotEmpty()
  @IsString()
  public paymentId: string;

  public constructor() {
    super();
  }

  public static createOne(props: CreatePaymentDue): Result<PaymentDue, Error> {
    const paymentDue = new PaymentDue();

    paymentDue.amount = props.amount;

    paymentDue.dueId = props.dueId;

    paymentDue.paymentId = props.paymentId;

    return ok(paymentDue);
  }
}
