import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';

export class PaymentDueItemDto {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  public amount: number;

  @IsNotEmpty()
  @IsString()
  @IsUUID()
  public dueId: string;
}
