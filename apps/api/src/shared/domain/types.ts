export interface PaginatedRequestParams {
  page: number;
  pageSize: number;
  sort?: PaginatedRequestSortParams[];
}

export interface PaginatedRequestSortParams {
  field: string;
  order: SortOrder;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
}

export type SortOrder = 'asc' | 'desc';
