import { DueCategory } from '@club-social/shared/dues';
import { MemberCategory } from '@club-social/shared/members';
import { IPricingDetailDto } from '@club-social/shared/pricing';

export class PricingDetailDto implements IPricingDetailDto {
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
