import { DueCategory } from '@club-social/shared/dues';
import { MemberCategory } from '@club-social/shared/members';
import { IFindActivePricingDto } from '@club-social/shared/pricing';
import { IsDateString, IsEnum, IsNotEmpty } from 'class-validator';

export class FindActivePricingRequestDto implements IFindActivePricingDto {
  @IsDateString()
  @IsNotEmpty()
  public date: string;

  @IsEnum(DueCategory)
  @IsNotEmpty()
  public dueCategory: DueCategory;

  @IsEnum(MemberCategory)
  @IsNotEmpty()
  public memberCategory: MemberCategory;
}
