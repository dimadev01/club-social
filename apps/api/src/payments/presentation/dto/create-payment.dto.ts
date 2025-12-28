import { CreatePaymentDto } from '@club-social/shared/payments';
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
  IsUUID,
  ValidateNested,
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

export class CreatePaymentRequestDto implements CreatePaymentDto {
  @IsDateString()
  @IsNotEmpty()
  public date: string;

  @ArrayMinSize(1)
  @IsArray()
  @Type(() => PaymentDueItemDto)
  @ValidateNested({ each: true })
  public dues: PaymentDueItemDto[];

  @IsNotEmpty()
  @IsString()
  @IsUUID()
  public memberId: string;

  @IsOptional()
  @IsString()
  public notes: null | string;

  @IsOptional()
  @IsString()
  public receiptNumber: null | string;
}
