import { DueCategory } from '@club-social/shared/dues';
import { MemberCategory } from '@club-social/shared/members';
import { PricingDto } from '@club-social/shared/pricing';

export class PricingResponseDto implements PricingDto {
  public amount: number;
  public createdAt: string;
  public createdBy: string;
  public dueCategory: DueCategory;
  public effectiveFrom: string;
  public effectiveTo: null | string;
  public id: string;
  public memberCategory: MemberCategory;
  public updatedAt: string;
  public updatedBy?: null | string;
}
