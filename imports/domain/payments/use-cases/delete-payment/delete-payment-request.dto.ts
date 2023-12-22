import { IsNotEmpty, IsString } from 'class-validator';

export class DeletePaymentRequestDto {
  @IsNotEmpty()
  @IsString()
  id: string;
}
