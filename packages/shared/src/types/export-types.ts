import type { PaginatedRequestSort } from './paginated-types';

/**
 * Export request mirrors PaginatedRequest but WITHOUT page/pageSize.
 * Used for exporting all filtered/sorted data as a file.
 */
export interface ExportRequest {
  filters?: Record<string, string[]>;
  sort: PaginatedRequestSort[];
}
