import { MemberEntity } from '@infra/mongo/entities/member.entity';
import { PaginatedMongoAggregationResult } from '@infra/mongo/repositories/types/paginated-mongo-aggregation.interface';

export type MemberEntityWithDues = MemberEntity & {
  pendingElectricity: number;
  pendingGuest: number;
  pendingMembership: number;
  pendingTotal: number;
};

export type FindPaginatedMembersAggregationResult =
  PaginatedMongoAggregationResult<MemberEntityWithDues>;
