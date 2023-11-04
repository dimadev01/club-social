export class FindPaginatedAggregationResult<T> {
  public total: Array<{ count: number }>;

  public data: T[];
}
