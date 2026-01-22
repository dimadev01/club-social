import { MemberCategory } from '@club-social/shared/members';

export interface PreviewBulkDuesMemberResponse {
  amount: number;
  baseAmount: number;
  discountPercent: number;
  isGroupPricing: boolean;
  memberCategory: MemberCategory;
  memberId: string;
  memberName: string;
}

export interface PreviewBulkDuesParams {
  memberCategory: MemberCategory;
}

export interface PreviewBulkDuesResponse {
  members: PreviewBulkDuesMemberResponse[];
  summary: PreviewBulkDuesSummaryResponse;
}

export interface PreviewBulkDuesSummaryResponse {
  totalAmount: number;
  totalMembers: number;
}
