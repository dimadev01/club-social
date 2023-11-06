import { FindPaginatedAggregationResult } from '@application/pagination/find-paginated-aggregation.result';
import { FindPaginatedRequest } from '@application/pagination/find-paginated.request';
import { FindPaginatedResponse } from '@application/pagination/find-paginated.response';
import { Member } from '@domain/members/entities/member.entity';
import {
  MemberCategoryEnum,
  MemberFileStatusEnum,
  MemberStatusEnum,
} from '@domain/members/member.enum';

export type FindPaginatedMembersRequest = FindPaginatedRequest & {
  filters: {
    category?: MemberCategoryEnum[];
    fileStatus?: MemberFileStatusEnum[];
    status?: MemberStatusEnum[];
  };
  sortField:
    | 'name'
    | 'user.profile.lastName'
    | 'electricityDebt'
    | 'guestDebt'
    | 'membershipDebt';
};

export type FindPaginatedMember = Pick<
  Member,
  '_id' | 'category' | 'user' | 'fileStatus' | 'status'
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
