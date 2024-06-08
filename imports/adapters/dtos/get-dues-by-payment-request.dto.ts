import { IsNotEmpty, IsString } from 'class-validator';

import { FindDuesByPayment } from '@domain/dues/due.repository';

export class GetDuesByPaymentRequestDto implements FindDuesByPayment {
  @IsNotEmpty()
  @IsString()
  public paymentId!: string;
}
