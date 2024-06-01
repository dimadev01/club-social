import {
  FindPaginatedRequest,
  FindPaginatedResponse,
} from '@domain/common/repositories/grid.repository';
import {
  MemberCategoryEnum,
  MemberStatusEnum,
} from '@domain/members/member.enum';

export interface FindMembersRequest {
  category?: MemberCategoryEnum[];
  status?: MemberStatusEnum[];
}

export interface GetBalanceResponse {
  _id: string;
  electricity: number;
  guest: number;
  membership: number;
  total: number;
}

/**
 * FindPaginatedMembers
 */
export interface Totals {
  electricity: number;
  guest: number;
  membership: number;
  total: number;
}

export interface FindPaginatedMembersRequest extends FindPaginatedRequest {
  filterByCategory?: MemberCategoryEnum[];
  filterByDebtStatus?: string[];
  filterById?: string[];
  filterByStatus?: MemberStatusEnum[];
}

export interface FindPaginatedMembersResponse<T>
  extends FindPaginatedResponse<T> {
  totals: Totals;
}

/**
 * FindMembersToExport
 */
export type FindMembersToExportRequest = FindPaginatedMembersRequest;
