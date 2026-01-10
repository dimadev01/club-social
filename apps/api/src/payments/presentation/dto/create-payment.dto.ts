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

export class CreatePaymentDueDto implements CreatePaymentDueDto {
  @IsNumber()
  @IsOptional()
  @IsPositive()
  public balanceAmount: null | number;

  @IsNumber()
  @IsOptional()
  @IsPositive()
  public cashAmount: null | number;

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
  @Type(() => CreatePaymentDueDto)
  @ValidateNested({ each: true })
  public dues: CreatePaymentDueDto[];

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

  @IsNumber()
  @IsOptional()
  @IsPositive()
  public surplusToCreditAmount: null | number;
}
