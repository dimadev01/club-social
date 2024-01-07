import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreatePaymentDueRequestDto } from '@domain/payments/use-cases/create-payment/create-payment-due-request.dto';
import { IsNullable } from '@shared/class-validator/is-nullable';

export class UpdatePaymentRequestDto {
  @IsNotEmpty()
  @IsString()
  public id: string;

  @IsDateString()
  public date: string;

  @ValidateNested({ each: true })
  @Type(() => CreatePaymentDueRequestDto)
  @ArrayMinSize(1)
  @IsArray()
  public dues: CreatePaymentDueRequestDto[];

  @IsNotEmpty()
  @IsString()
  @IsNullable()
  public notes: string | null;
}
