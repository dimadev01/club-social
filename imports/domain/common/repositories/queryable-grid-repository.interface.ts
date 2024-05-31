import { Model } from '@domain/common/models/model';

export type PaginatedSorter = Record<
  string,
  'ascend' | 'descend' | 1 | -1 | null
>;

export interface FindPaginatedRequest {
  limit: number;
  page: number;
  sorter: PaginatedSorter;
}

export interface FindPaginatedResponse<T = unknown> {
  items: T[];
  totalCount: number;
}

export const DEFAULT_PAGE_SIZE = 25;

export interface IQueryableGridRepository<
  TModel extends Model,
  TRequest extends FindPaginatedRequest,
> {
  findPaginated(request: TRequest): Promise<FindPaginatedResponse<TModel>>;
}
