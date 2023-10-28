import { Entity } from '@domain/common/entity';
import { PaginatedRequestDto } from '@infra/pagination/paginated-request.dto';
import { PaginatedResponse } from '@infra/pagination/paginated-response.dto';

export interface IPaginatedRepository<T extends Entity> {
  findPaginated(request: PaginatedRequestDto): Promise<PaginatedResponse<T>>;
}
