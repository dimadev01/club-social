import {
  FindPaginatedRequest,
  FindPaginatedResponse,
} from '@domain/common/repositories/grid.repository';

export interface FindPaginatedPaymentsRequest extends FindPaginatedRequest {
  filterByMember?: string[];
}

export type FindPaginatedPaymentsResponse<T> = FindPaginatedResponse<T>;
