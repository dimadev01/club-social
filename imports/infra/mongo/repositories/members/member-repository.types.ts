import { FindPaginatedAggregationResult } from '@application/pagination/find-paginated-aggregation.result';
import { FindPaginatedRequest } from '@application/pagination/find-paginated.request';
import { FindPaginatedResponse } from '@application/pagination/find-paginated.response';
import { Member } from '@domain/members/entities/member.entity';

export type FindPaginatedMembersRequest = FindPaginatedRequest & {
  findForCsv: boolean;
  sortField:
    | 'name'
    | 'user.profile.lastName'
    | 'electricityDebt'
    | 'guestDebt'
    | 'membershipDebt';
};

export type FindPaginatedMember = Pick<
  Member,
  '_id' | 'category' | 'user' | 'fileStatus' | 'status' | 'phones'
> & {
  electricityDebt: number;
  guestDebt: number;
  membershipDebt: number;
  totalDebt: number;
};

export type FindPaginatedMembersResponse =
  FindPaginatedResponse<FindPaginatedMember>;

export type FindPaginatedMembersAggregationResult =
  FindPaginatedAggregationResult<FindPaginatedMember>;
