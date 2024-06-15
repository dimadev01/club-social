import { IsNotEmpty, IsString } from 'class-validator';

import { FindDuesByPayment } from '@application/dues/repositories/due.repository';

export class GetDuesByPaymentRequestDto implements FindDuesByPayment {
  @IsNotEmpty()
  @IsString()
  public paymentId!: string;
}
