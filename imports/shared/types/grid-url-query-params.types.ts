import { SortOrder } from 'antd/es/table/interface';

export class GridUrlQueryParams {
  filters?: Partial<Record<string, string[]>>;

  page: number;

  pageSize: number;

  sortField?: string;

  sortOrder?: SortOrder;

  search: string;
}
