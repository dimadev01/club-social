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
    | 'electricityBalance'
    | 'guestBalance'
    | 'membershipBalance';
};

export type FindPaginatedMember = Pick<
  Member,
  '_id' | 'category' | 'user' | 'fileStatus' | 'status'
> & {
  electricityBalance: number;
  guestBalance: number;
  membershipBalance: number;
};

export type FindPaginatedMembersResponse =
  FindPaginatedResponse<FindPaginatedMember>;

export type FindPaginatedMembersAggregationResult =
  FindPaginatedAggregationResult<FindPaginatedMember>;
