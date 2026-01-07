import { DueCategory } from '@club-social/shared/dues';
import { MemberCategory } from '@club-social/shared/members';
import { CreatePricingDto } from '@club-social/shared/pricing';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  ValidateIf,
} from 'class-validator';

export class CreatePricingRequestDto implements CreatePricingDto {
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
  @IsOptional()
  @ValidateIf((o) => o.memberCategory !== null)
  public memberCategory: MemberCategory | null;
}
