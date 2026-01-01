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
  Min,
  ValidateNested,
} from 'class-validator';

export class CreatePaymentDueDto implements CreatePaymentDueDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  public amount: number;

  @IsNumber()
  @IsOptional()
  @IsPositive()
  public amountFromBalance: null | number;

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
