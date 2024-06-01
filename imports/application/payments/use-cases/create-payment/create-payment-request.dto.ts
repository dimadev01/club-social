import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';

import { CreatePaymentDueRequestDto } from './create-payment-due-request.dto';

import { IsNullable } from '@shared/class-validator/is-nullable';

export class CreatePaymentRequestDto {
  @IsDateString()
  public date: string;

  @ValidateNested({ each: true })
  @Type(() => CreatePaymentDueRequestDto)
  @ArrayMinSize(1)
  @IsArray()
  public dues: CreatePaymentDueRequestDto[];

  @IsNotEmpty()
  @IsString()
  public memberId: string;

  @IsNotEmpty()
  @IsString()
  @IsNullable()
  @IsOptional()
  public notes: string | null;

  @IsPositive()
  @IsNumber()
  public receiptNumber: number;
}
