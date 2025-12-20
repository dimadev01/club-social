import { IsNotEmpty, IsString } from 'class-validator';

export class VoidPaymentRequestDto {
  @IsNotEmpty()
  @IsString()
  public voidReason: string;
}
