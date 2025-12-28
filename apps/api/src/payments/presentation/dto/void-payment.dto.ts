import { VoidPaymentDto } from '@club-social/shared/payments';
import { IsNotEmpty, IsString } from 'class-validator';

export class VoidPaymentRequestDto implements VoidPaymentDto {
  @IsNotEmpty()
  @IsString()
  public voidReason: string;
}
