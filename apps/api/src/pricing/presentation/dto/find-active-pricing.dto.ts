import { DueCategory } from '@club-social/shared/dues';
import { MemberCategory } from '@club-social/shared/members';
import { FindActivePricingDto } from '@club-social/shared/pricing';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class FindActivePricingRequestDto implements FindActivePricingDto {
  @IsEnum(DueCategory)
  @IsNotEmpty()
  public dueCategory: DueCategory;

  @IsEnum(MemberCategory)
  @IsNotEmpty()
  public memberCategory: MemberCategory;
}
