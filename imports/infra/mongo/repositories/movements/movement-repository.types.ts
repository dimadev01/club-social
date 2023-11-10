import { FindPaginatedAggregationResult } from '@application/pagination/find-paginated-aggregation.result';
import { FindPaginatedRequest } from '@application/pagination/find-paginated.request';
import { FindPaginatedResponse } from '@application/pagination/find-paginated.response';
import { Movement } from '@domain/movements/entities/movement.entity';

export type FindPaginatedMovementsRequest = FindPaginatedRequest & {
  from: string | null;
  memberIds: string[];
  showDeleted: boolean | null;
  sortField: 'createdAt';
  to: string | null;
};

export type FindPaginatedMovement = Movement;

export type FindPaginatedMovementsResponse =
  FindPaginatedResponse<FindPaginatedMovement> & {
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
