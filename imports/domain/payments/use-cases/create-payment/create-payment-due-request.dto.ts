import { IsInt, IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class CreatePaymentDueRequestDto {
  @IsInt()
  @IsPositive()
  public amount: number;

  @IsNotEmpty()
  @IsString()
  public dueId: string;
}
