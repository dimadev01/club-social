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
  meta: PaginatedResponseMeta;
}

export interface PaginatedResponseMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export type SortOrder = 'asc' | 'desc';
