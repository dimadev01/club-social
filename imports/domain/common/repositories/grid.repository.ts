import { Model } from '@domain/common/models/model';

export const DEFAULT_PAGE_SIZE = 10;

export type PaginatedSorter = Record<
  string,
  'ascend' | 'descend' | 1 | -1 | null
>;

export interface FindPaginatedRequest {
  limit: number;
  page: number;
  sorter: PaginatedSorter;
}

export interface FindPaginatedResponse<T = Model> {
  items: T[];
  totalCount: number;
}

export interface IGridRepository<
  TDomain = Model,
  TRequest extends FindPaginatedRequest = FindPaginatedRequest,
  TResponse extends
    FindPaginatedResponse<TDomain> = FindPaginatedResponse<TDomain>,
> {
  findPaginated(request: TRequest): Promise<TResponse>;
}
