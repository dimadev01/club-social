import { DueCategory } from '@club-social/shared/dues';
import { MemberCategory } from '@club-social/shared/members';
import { FindPricingDto } from '@club-social/shared/pricing';
import { IsEnum, IsUUID } from 'class-validator';

export class FindMembershipPricingRequestDto implements FindPricingDto {
  @IsEnum(DueCategory)
  public dueCategory: DueCategory;

  @IsEnum(MemberCategory)
  public memberCategory: MemberCategory;

  @IsUUID()
  public memberId: string;
}
