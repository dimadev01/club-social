import { FindPaginatedAggregationResult } from '@application/pagination/find-paginated-aggregation.result';
import { FindPaginatedRequestOld } from '@application/pagination/find-paginated.request';
import { FindPaginatedResponseOld } from '@application/pagination/find-paginated.response';
import { MemberOld } from '@domain/members/models/member.old';

export type FindPaginatedMembersRequest = FindPaginatedRequestOld & {
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
  pendingElectricity: number;
  pendingGuest: number;
  pendingMembership: number;
  pendingTotal: number;
};

export type FindPaginatedMembersResponseOld =
  FindPaginatedResponseOld<FindPaginatedMemberOld>;

export type FindPaginatedMembersAggregationResult =
  FindPaginatedAggregationResult<FindPaginatedMemberOld>;
