import { FindPaginatedRequest } from '@application/pagination/find-paginated.request';
import { FindPaginatedResponse } from '@application/pagination/find-paginated.response';

export interface IPaginatedPort<T> {
  findPaginated(
    request: FindPaginatedRequest
  ): Promise<FindPaginatedResponse<T>>;
}
