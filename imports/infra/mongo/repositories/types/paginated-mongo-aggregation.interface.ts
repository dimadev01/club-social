export interface PaginatedMongoAggregationResult<TEntity> {
  entities: TEntity[];
  totalCount: number;
}
