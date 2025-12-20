import { ICreatePaymentDto } from '@club-social/shared/payments';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreatePaymentRequestDto implements ICreatePaymentDto {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  public amount: number;

  @IsDateString()
  @IsNotEmpty()
  public date: string;

  @IsNotEmpty()
  @IsString()
  @IsUUID()
  public dueId: string;

  @IsOptional()
  @IsString()
  public notes: null | string;
}
