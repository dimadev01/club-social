import { DueCategory } from '@club-social/shared/dues';
import { MemberCategory } from '@club-social/shared/members';

export interface GetPricingHistoryParams {
  dueCategory: DueCategory;
  memberCategory: MemberCategory;
}
