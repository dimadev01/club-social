import { DueCategory } from '@club-social/shared/dues';
import { MemberCategory } from '@club-social/shared/members';

export interface FindActivePricingParams {
  dueCategory: DueCategory;
  memberCategory: MemberCategory;
}
