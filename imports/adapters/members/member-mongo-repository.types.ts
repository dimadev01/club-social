import { MemberEntity } from '@adapters/members/entities/member.entity';
import { PaginatedAggregationResult } from '@adapters/mongo/common/paginated-aggregation.interface';
import { Totals } from '@domain/members/repositories/member-repository.types';

export interface FindPaginatedMembersAggregationResult
  extends PaginatedAggregationResult<MemberEntity> {
  totals: Totals;
}
