import {
  FindPaginatedRequest,
  FindPaginatedResponse,
} from '@domain/common/repositories/queryable-grid-repository.interface';
import {
  MemberCategoryEnum,
  MemberStatusEnum,
} from '@domain/members/member.enum';
import { PaginatedAggregationResult } from '@infra/mongo/common/paginated-aggregation.interface';
import { MemberEntity } from '@infra/mongo/entities/members/member.entity';

export interface FindPaginatedMembersResponse<T = unknown>
  extends FindPaginatedResponse<T> {
  totals: Totals;
}

interface Totals {
  electricity: number;
  guest: number;
  membership: number;
  total: number;
}

export interface FindPaginatedMembersAggregationResult
  extends PaginatedAggregationResult<MemberEntity> {
  totals: Totals;
}

export interface FindPaginatedMembersRequest extends FindPaginatedRequest {
  filterByCategory: MemberCategoryEnum[] | null;
  filterByDebtStatus: string[] | null;
  filterById: string[] | null;
  filterByStatus: MemberStatusEnum[] | null;
}
