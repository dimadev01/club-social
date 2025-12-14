export interface PaginatedRequest {
  page: number;
  pageSize: number;
  sort?: PaginatedRequestSort[];
}

export interface PaginatedRequestSort {
  field: string;
  order: SortOrder;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
}

export const SortOrder = {
  ASC: 'asc',
  DESC: 'desc',
} as const;

export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];
