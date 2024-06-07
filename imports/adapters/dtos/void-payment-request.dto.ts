import { IsNotEmpty, IsString } from 'class-validator';

import { GetOneByIdRequestDto } from '@adapters/common/dtos/get-one-dto-request.dto';
import { VoidPaymentRequest } from '@application/payments/use-cases/void-payment/void-payment.request';

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
