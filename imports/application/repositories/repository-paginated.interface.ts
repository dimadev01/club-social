import { FullEntity } from '@domain/common/full-entity.base';
import { PaginatedRequestDto } from '@infra/pagination/paginated-request.dto';
import { PaginatedResponse } from '@infra/pagination/paginated-response.dto';

export interface IPaginatedRepository<T extends FullEntity> {
  findPaginated(request: PaginatedRequestDto): Promise<PaginatedResponse<T>>;
}
