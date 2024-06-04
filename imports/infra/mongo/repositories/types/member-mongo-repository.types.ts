import { FindPaginatedMembersResponseTotals } from '@domain/members/member.repository';
import { MemberEntity } from '@infra/mongo/entities/member.entity';
import { PaginatedMongoAggregationResult } from '@infra/mongo/repositories/types/paginated-mongo-aggregation.interface';

export interface FindPaginatedMembersAggregationResult
  extends PaginatedMongoAggregationResult<MemberEntity> {
  totals: FindPaginatedMembersResponseTotals;
}
