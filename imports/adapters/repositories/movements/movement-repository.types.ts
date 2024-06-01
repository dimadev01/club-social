import { FindPaginatedAggregationResult } from '@application/pagination/find-paginated-aggregation.result';
import { FindPaginatedRequestOld } from '@application/pagination/find-paginated.request';
import { FindPaginatedResponseOld } from '@application/pagination/find-paginated.response';
import { Movement } from '@domain/movements/entities/movement.entity';

export type FindPaginatedMovementsRequest = FindPaginatedRequestOld & {
  from: string | null;
  memberIds: string[];
  showDeleted: boolean | null;
  sortField: 'createdAt';
  to: string | null;
};

export type FindPaginatedMovement = Movement & {
  balance: number;
};

export type FindPaginatedMovementsResponse =
  FindPaginatedResponseOld<FindPaginatedMovement> & {
    balance: number;
    debt: number;
    expenses: number;
    income: number;
  };

export type FindPaginatedMovementsAggregationResult =
  FindPaginatedAggregationResult<FindPaginatedMovement> & {
    allDebt: number;
    allDebtIncome: number;
    allExpenses: number;
    allIncome: number;
  };
