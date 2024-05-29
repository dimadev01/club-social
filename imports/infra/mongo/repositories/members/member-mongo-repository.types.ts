import { FindPaginatedAggregationResult } from '@application/pagination/find-paginated-aggregation.result';
import { FindPaginatedRequest } from '@application/pagination/find-paginated.request';
import { FindPaginatedResponse } from '@application/pagination/find-paginated.response';
import { MemberOld } from '@domain/members/models/member.old';

export type FindPaginatedMembersRequest = FindPaginatedRequest & {
  findForCsv: boolean;
  sortField:
    | 'name'
    | 'user.profile.lastName'
    | 'electricityDebt'
    | 'guestDebt'
    | 'membershipDebt';
};

export type FindPaginatedMemberOld = Pick<
  MemberOld,
  '_id' | 'category' | 'user' | 'fileStatus' | 'status' | 'phones'
> & {
  pendingGuest: number;
  pendingGuest: number;
  pendingMembership: number;
  pendingTotal: number;
};

export type FindPaginatedMembersResponse =
  FindPaginatedResponse<FindPaginatedMemberOld>;

export type FindPaginatedMembersAggregationResult =
  FindPaginatedAggregationResult<FindPaginatedMemberOld>;
