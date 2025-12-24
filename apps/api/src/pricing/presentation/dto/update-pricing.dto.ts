import { IUpdatePricingDto } from '@club-social/shared/pricing';
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
} from 'class-validator';

export class UpdatePricingRequestDto implements IUpdatePricingDto {
  @IsInt()
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  public amount: number;

  @IsDateString()
  @IsOptional()
  public effectiveTo: null | string;
}
