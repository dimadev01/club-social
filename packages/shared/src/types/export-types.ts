import type { PaginatedRequestSort } from './paginated-types';

export interface ExportRequest {
  filters?: Record<string, string[]>;
  sort: PaginatedRequestSort[];
}
