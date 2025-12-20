import { IPaymentDueItemDto } from '@club-social/shared/payments';
import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';

export class UpdatePaymentDueDto implements IPaymentDueItemDto {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  public amount: number;

  @IsNotEmpty()
  @IsString()
  @IsUUID()
  public dueId: string;
}
