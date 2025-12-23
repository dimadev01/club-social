export interface PaginatedRequest {
  filters?: Record<string, string[]>;
  page: number;
  pageSize: number;
  sort: PaginatedRequestSort[];
}

export interface PaginatedRequestSort {
  field: string;
  order: SortOrder;
}

export interface PaginatedResponse<T, TSummary = never> {
  data: T[];
  summary?: TSummary;
  total: number;
}

export const SortOrder = {
  ASC: 'asc',
  DESC: 'desc',
} as const;

export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];
