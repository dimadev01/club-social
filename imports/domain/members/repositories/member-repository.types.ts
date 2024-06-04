import {
  FindPaginatedRequest,
  FindPaginatedResponse,
} from '@domain/common/repositories/grid.repository';
import {
  MemberCategoryEnum,
  MemberStatusEnum,
} from '@domain/members/member.enum';
import { Member } from '@domain/members/models/member.model';

export interface FindMembers {
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
export interface FindPaginatedMembersResponseTotals {
  electricity: number;
  guest: number;
  membership: number;
  total: number;
}

export interface FindPaginatedMembersRequest extends FindPaginatedRequest {
  filterByCategory: MemberCategoryEnum[];
  filterByDebtStatus: string[];
  filterById: string[];
  filterByStatus: MemberStatusEnum[];
}

export interface FindPaginatedMembersResponse<T = Member>
  extends FindPaginatedResponse<T> {
  totals: FindPaginatedMembersResponseTotals;
}

/**
 * FindMembersToExport
 */
export type FindMembersToExport = FindPaginatedMembersRequest;
