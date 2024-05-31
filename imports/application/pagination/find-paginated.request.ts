export class FindPaginatedRequestOld {
  public filters: Record<string, string[] | null>;

  public page: number;

  public pageSize: number;

  public search: string;

  public sortField: string;

  public sortOrder: 'ascend' | 'descend' | null;
}
