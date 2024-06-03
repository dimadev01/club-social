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

import { IsNullable } from '@adapters/common/class-validator/is-nullable';
import { CreatePaymentDueRequestDto } from '@adapters/dtos/create-payment-due-request.dto';
import { CreatePaymentRequest } from '@application/payments/use-cases/create-payment/create-payment.request';

export class CreatePaymentRequestDto implements CreatePaymentRequest {
  @IsDateString()
  public date!: string;

  @ValidateNested({ each: true })
  @Type(() => CreatePaymentDueRequestDto)
  @ArrayMinSize(1)
  @IsArray()
  public dues!: CreatePaymentDueRequestDto[];

  @IsNotEmpty()
  @IsString()
  public memberId!: string;

  @IsNotEmpty()
  @IsString()
  @IsNullable()
  @IsOptional()
  public notes!: string | null;

  @IsPositive()
  @IsNumber()
  public receiptNumber!: number;
}
