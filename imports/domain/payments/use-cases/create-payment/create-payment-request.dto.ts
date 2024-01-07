import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  ValidateNested,
} from 'class-validator';
import { CreatePaymentDuesByMemberRequestDto } from '@domain/payments/use-cases/create-payment/create-payment-dues-by-member.request';

export class CreatePaymentRequestDto {
  @IsDateString()
  public date: string;

  @ValidateNested({ each: true })
  @Type(() => CreatePaymentDuesByMemberRequestDto)
  @ArrayMinSize(1)
  @IsArray()
  public memberDues: CreatePaymentDuesByMemberRequestDto[];
}
