import { MemberEntity } from '@infra/mongo/entities/member.entity';
import { PaginatedMongoAggregationResult } from '@infra/mongo/repositories/types/paginated-mongo-aggregation.interface';

export type MemberEntityWithDues = MemberEntity & {
  availableCredit?: { amount: number };
  pendingElectricity: number;
  pendingGuest: number;
  pendingMembership: number;
  pendingTotal: number;
};

export type FindPaginatedMembersAggregationResult =
  PaginatedMongoAggregationResult<MemberEntityWithDues>;
