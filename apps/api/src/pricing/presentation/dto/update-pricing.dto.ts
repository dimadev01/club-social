import { IUpdatePricingDto } from '@club-social/shared/pricing';
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
} from 'class-validator';

export class UpdatePricingRequestDto implements IUpdatePricingDto {
  @IsInt()
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  public amount: number;

  @IsDateString()
  public effectiveFrom: string;
}
