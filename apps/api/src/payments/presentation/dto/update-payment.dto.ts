import { IUpdatePaymentDto } from '@club-social/shared/payments';
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

export class UpdatePaymentDueDto {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  public amount: number;

  @IsNotEmpty()
  @IsString()
  @IsUUID()
  public dueId: string;
}

export class UpdatePaymentDto implements IUpdatePaymentDto {
  @IsDateString()
  @IsNotEmpty()
  public date: string;

  @IsOptional()
  @IsString()
  public notes: null | string;

  @ArrayMinSize(1)
  @IsArray()
  @Type(() => UpdatePaymentDueDto)
  @ValidateNested({ each: true })
  public paymentDues: UpdatePaymentDueDto[];
}
