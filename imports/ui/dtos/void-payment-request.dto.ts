import { IsNotEmpty, IsString } from 'class-validator';

import { VoidPaymentRequest } from '@application/payments/use-cases/void-payment/void-payment.request';
import { GetOneByIdRequestDto } from '@ui/common/dtos/get-one-dto-request.dto';

export class VoidPaymentRequestDto
  extends GetOneByIdRequestDto
  implements VoidPaymentRequest
{
  @IsNotEmpty()
  @IsString()
  public voidedBy!: string;

  @IsNotEmpty()
  @IsString()
  public voidReason!: string;
}
