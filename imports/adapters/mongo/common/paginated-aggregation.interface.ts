export interface PaginatedAggregationResult<TEntity> {
  entities: TEntity[];
  totalCount: number;
}
