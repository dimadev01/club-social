import { ICreatePaymentDto } from '@club-social/shared/payments';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

import { PaymentDueItemDto } from './payment-due-item.dto';

export class CreatePaymentRequestDto implements ICreatePaymentDto {
  @IsDateString()
  @IsNotEmpty()
  public date: string;

  @IsNotEmpty()
  @IsString()
  @IsUUID()
  public memberId: string;

  @IsOptional()
  @IsString()
  public notes: null | string;

  @ArrayMinSize(1)
  @IsArray()
  @Type(() => PaymentDueItemDto)
  @ValidateNested({ each: true })
  public paymentDues: PaymentDueItemDto[];

  @IsOptional()
  @IsString()
  public receiptNumber: null | string;
}
