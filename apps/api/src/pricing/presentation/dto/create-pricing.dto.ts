import { DueCategory } from '@club-social/shared/dues';
import { MemberCategory } from '@club-social/shared/members';
import { ICreatePricingDto } from '@club-social/shared/pricing';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
} from 'class-validator';

export class CreatePricingRequestDto implements ICreatePricingDto {
  @IsInt()
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  public amount: number;

  @IsEnum(DueCategory)
  @IsNotEmpty()
  public dueCategory: DueCategory;

  @IsDateString()
  @IsNotEmpty()
  public effectiveFrom: string;

  @IsEnum(MemberCategory)
  @IsNotEmpty()
  public memberCategory: MemberCategory;
}
