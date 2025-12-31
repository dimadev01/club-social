export interface ExportDataDto {
  filters?: Record<string, string[]>;
  sort: PaginatedRequestSort[];
}

export interface GetPaginatedDataDto {
  filters?: Record<string, string[]>;
  page: number;
  pageSize: number;
  sort: PaginatedRequestSort[];
}

export interface PaginatedDataResultDto<TData, TExtra = never> {
  data: TData[];
  extra?: TExtra;
  total: number;
}

export interface PaginatedRequestSort {
  field: string;
  order: SortOrder;
}

export const SortOrder = {
  ASC: 'asc',
  DESC: 'desc',
} as const;

export interface DateRangeDto {
  dateRange?: [string, string];
}

export interface ParamIdDto {
  id: string;
}

export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];
