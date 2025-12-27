import { DueCategory } from '@club-social/shared/dues';
import { MemberCategory } from '@club-social/shared/members';
import { IPricingPaginatedDto } from '@club-social/shared/pricing';

export class PricingPaginatedDto implements IPricingPaginatedDto {
  public amount: number;
  public createdAt: string;
  public createdBy: string;
  public dueCategory: DueCategory;
  public effectiveFrom: string;
  public effectiveTo: null | string;
  public id: string;
  public memberCategory: MemberCategory;
}
