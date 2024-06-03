import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreatePaymentDueRequestDto {
  @IsInt()
  @IsPositive()
  @IsNumber()
  public amount!: number;

  @IsNotEmpty()
  @IsString()
  public dueId!: string;
}
