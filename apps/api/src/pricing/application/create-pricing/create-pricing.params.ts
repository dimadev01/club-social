import { DueCategory } from '@club-social/shared/dues';
import { MemberCategory } from '@club-social/shared/members';

export interface CreatePricingParams {
  amount: number;
  createdBy: string;
  dueCategory: DueCategory;
  effectiveFrom: string;
  memberCategory: MemberCategory;
}
