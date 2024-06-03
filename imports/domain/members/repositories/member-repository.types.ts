import {
  FindPaginatedRequest,
  FindPaginatedResponse,
} from '@domain/common/repositories/grid.repository';
import {
  MemberCategoryEnum,
  MemberStatusEnum,
} from '@domain/members/member.enum';
import { Member } from '@domain/members/models/member.model';

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
export interface FindPaginatedMembersResponseTotals {
  electricity: number;
  guest: number;
  membership: number;
  total: number;
}

export interface FindPaginatedMembersRequest extends FindPaginatedRequest {
  filterByCategory: MemberCategoryEnum[] | undefined;
  filterByDebtStatus: string[] | undefined;
  filterById: string[] | undefined;
  filterByStatus: MemberStatusEnum[] | undefined;
}

export interface FindPaginatedMembersResponse<T = Member>
  extends FindPaginatedResponse<T> {
  totals: FindPaginatedMembersResponseTotals;
}

/**
 * FindMembersToExport
 */
export type FindMembersToExportRequest = FindPaginatedMembersRequest;
