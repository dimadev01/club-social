import { FindPaginatedAggregationResult } from '@application/pagination/find-paginated-aggregation.result';
import { FindPaginatedRequestOld } from '@application/pagination/find-paginated.request';
import { FindPaginatedResponseOld } from '@application/pagination/find-paginated.response';
import { Due } from '@domain/dues/entities/due.entity';

export type FindPaginatedDuesRequest = FindPaginatedRequestOld & {
  from: string | null;
  memberIds: string[];
  showDeleted: boolean | null;
  sortField: string;
  to: string | null;
};

export type FindPaginatedDuesResponse = FindPaginatedResponseOld<Due> & {
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

export type FindPendingByMemberRequest = {
  memberId: string;
};

export type FindByIdsRequest = {
  dueIds: string[];
};
