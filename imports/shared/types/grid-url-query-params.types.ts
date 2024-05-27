import { SortOrder } from 'antd/es/table/interface';

export class GridUrlQueryParams {
  public filters: Record<string, string[]>;

  public page: number;

  public pageSize: number;

  public search: string;

  public sortField: string;

  public sortOrder: SortOrder;
}
