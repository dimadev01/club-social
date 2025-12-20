import { IUpdatePaymentDto } from '@club-social/shared/payments';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class UpdatePaymentRequestDto implements IUpdatePaymentDto {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  public amount: number;

  @IsDateString()
  @IsNotEmpty()
  public date: string;

  @IsOptional()
  @IsString()
  public notes: null | string;
}
