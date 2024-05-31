import { Model } from '@domain/common/models/model';

export type PaginatedSorter = Record<
  string,
  'ascend' | 'descend' | 1 | -1 | null
>;

export interface FindPaginatedRequestNewV {
  limit: number;
  page: number;
  sorter: PaginatedSorter;
}

export interface FindPaginatedResponseNewV<T = unknown> {
  items: T[];
  totalCount: number;
}

export const DEFAULT_PAGE_SIZE = 25;

export interface IQueryableGridRepository<
  TModel extends Model,
  TRequest extends FindPaginatedRequestNewV = FindPaginatedRequestNewV,
  TResponse extends
    FindPaginatedResponseNewV<TModel> = FindPaginatedResponseNewV<TModel>,
> {
  findPaginated(request: TRequest): Promise<TResponse>;
}
