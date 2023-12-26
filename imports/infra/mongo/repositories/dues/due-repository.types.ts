import { FindPaginatedAggregationResult } from '@application/pagination/find-paginated-aggregation.result';
import { FindPaginatedRequest } from '@application/pagination/find-paginated.request';
import { FindPaginatedResponse } from '@application/pagination/find-paginated.response';
import { Due } from '@domain/dues/entities/due.entity';

export type FindPaginatedDuesRequest = FindPaginatedRequest & {
  from: string | null;
  memberIds: string[];
  showDeleted: boolean | null;
  sortField: 'createdAt';
  to: string | null;
};

export type FindPaginatedDuesResponse = FindPaginatedResponse<Due> & {
  balance: number;
  totalDues: number;
  totalPayments: number;
};

export type FindPaginatedDuesAggregationResult =
  FindPaginatedAggregationResult<Due> & {
    balance: number;
    totalDues: number;
    totalPayments: number;
  };

export type FindPaidRequest = {
  memberId?: string;
};

export type FindPendingRequest = {
  memberIds: string[];
};

export type FindByIdsRequest = {
  dueIds: string[];
};
