import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsNumber,
  IsPositive,
  ValidateNested,
} from 'class-validator';
import { CreatePaymentDuesByMemberRequestDto } from '@domain/payments/use-cases/create-payment/create-payment-dues-by-member.request';

export class CreatePaymentRequestDto {
  @IsDateString()
  public date: string;

  @IsPositive()
  @IsNumber()
  public receiptNumber: number;

  @ValidateNested({ each: true })
  @Type(() => CreatePaymentDuesByMemberRequestDto)
  @ArrayMinSize(1)
  @IsArray()
  public memberDues: CreatePaymentDuesByMemberRequestDto[];
}
