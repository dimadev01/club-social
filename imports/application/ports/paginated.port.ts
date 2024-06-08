import { FindPaginatedRequestOld } from '@application/pagination/find-paginated.request';
import { FindPaginatedResponseOld } from '@application/pagination/find-paginated.response';

export interface IPaginatedPort<T> {
  findPaginated(
    request: FindPaginatedRequestOld,
  ): Promise<FindPaginatedResponseOld<T>>;
}
