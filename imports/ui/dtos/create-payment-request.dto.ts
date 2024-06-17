import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';

import { CreatePaymentRequest } from '@application/payments/use-cases/create-payment/create-payment.request';
import { IsNullable } from '@ui/common/class-validator/is-nullable';
import { CreatePaymentDueRequestDto } from '@ui/dtos/create-payment-due-request.dto';

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

  @IsBoolean()
  public sendEmail!: boolean;
}
