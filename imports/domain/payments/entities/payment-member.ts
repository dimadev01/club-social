import { IsNotEmpty, IsString } from 'class-validator';
import { ok, Result } from 'neverthrow';
import { CreatePaymentMember } from '@domain/payments/payment.types';

export class PaymentMember {
  @IsNotEmpty()
  @IsString()
  public _id: string;

  @IsNotEmpty()
  @IsString()
  public name: string;

  public static create(
    props: CreatePaymentMember
  ): Result<PaymentMember, Error> {
    const paymentMember = new PaymentMember();

    paymentMember._id = props._id;

    paymentMember.name = props.name;

    return ok(paymentMember);
  }
}
