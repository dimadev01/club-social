import type { PaginatedRequestSort } from './paginated-types';

export interface ExportDataDto {
  filters?: Record<string, string[]>;
  sort: PaginatedRequestSort[];
}
