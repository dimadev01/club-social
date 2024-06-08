export interface PaginatedMongoAggregationResult<T> {
  entities: T[];
  totalCount: number;
}
