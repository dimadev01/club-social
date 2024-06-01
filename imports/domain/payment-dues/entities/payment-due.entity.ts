import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';
import { Result, ok } from 'neverthrow';

import { EntityOld } from '@domain/common/entity.old';

export interface CreatePaymentDue {
  amount: number;
  dueId: string;
  paymentId: string;
}

export class PaymentDueOld extends EntityOld {
  @IsPositive()
  @IsNumber()
  public amount!: number;

  @IsNotEmpty()
  @IsString()
  public dueId!: string;

  @IsNotEmpty()
  @IsString()
  public paymentId!: string;

  public constructor() {
    super();
  }

  public static createOne(
    props: CreatePaymentDue,
  ): Result<PaymentDueOld, Error> {
    const paymentDue = new PaymentDueOld();

    paymentDue.amount = props.amount;

    paymentDue.dueId = props.dueId;

    paymentDue.paymentId = props.paymentId;

    return ok(paymentDue);
  }
}
