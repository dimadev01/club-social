import {
  FindPaginatedRequestNewV,
  FindPaginatedResponseNewV,
} from '@domain/common/repositories/queryable-grid-repository.interface';

export interface FindPaginatedPaymentsRequest extends FindPaginatedRequestNewV {
  filterByMember: string[] | null;
}

export type FindPaginatedPaymentsResponse<T = unknown> =
  FindPaginatedResponseNewV<T>;
