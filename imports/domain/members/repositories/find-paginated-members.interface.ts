import {
  FindPaginatedRequestNewV,
  FindPaginatedResponseNewV,
} from '@domain/common/repositories/queryable-grid-repository.interface';
import {
  MemberCategoryEnum,
  MemberStatusEnum,
} from '@domain/members/member.enum';
import { PaginatedAggregationResult } from '@infra/mongo/common/paginated-aggregation.interface';
import { MemberEntity } from '@infra/mongo/entities/member.entity';

interface Totals {
  electricity: number;
  guest: number;
  membership: number;
  total: number;
}

export interface FindPaginatedMembersRequest extends FindPaginatedRequestNewV {
  filterByCategory?: MemberCategoryEnum[];
  filterByDebtStatus?: string[];
  filterById?: string[];
  filterByStatus?: MemberStatusEnum[];
}

export interface FindPaginatedMembersResponse<T = unknown>
  extends FindPaginatedResponseNewV<T> {
  totals: Totals;
}

export interface FindPaginatedMembersAggregationResult
  extends PaginatedAggregationResult<MemberEntity> {
  totals: Totals;
}
