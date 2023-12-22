import { IsNotEmpty, IsString } from 'class-validator';

export class GetPaymentRequestDto {
  @IsNotEmpty()
  @IsString()
  id: string;
}
