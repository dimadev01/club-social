import { IsNotEmpty, IsString } from 'class-validator';

export class RestorePaymentRequestDto {
  @IsNotEmpty()
  @IsString()
  id: string;
}
