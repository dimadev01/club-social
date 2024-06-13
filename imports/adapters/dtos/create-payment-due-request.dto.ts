import { IsInt, IsNotEmpty, IsNumber, IsString } from 'class-validator';

import { CreatePaymentDueRequest } from '@application/payments/use-cases/create-payment/create-payment.request';

export class CreatePaymentDueRequestDto implements CreatePaymentDueRequest {
  @IsInt()
  @IsNumber()
  public directAmount!: number;

  @IsNotEmpty()
  @IsString()
  public dueId!: string;

  @IsInt()
  @IsNumber()
  public creditAmount!: number;
}
