import { PaginatedRequestDto } from '@application/common/paginated-request.dto';
import { PaginatedResponse } from '@application/common/paginated-response.dto';
import { FullEntity } from '@domain/common/full-entity.base';

export interface IPaginatedRepository<T extends FullEntity> {
  findPaginated(request: PaginatedRequestDto): Promise<PaginatedResponse<T>>;
}
