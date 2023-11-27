import { FindPaginatedResponse } from '@application/pagination/find-paginated.response';
import { ICrudPort } from '@application/ports/crud.port';
import { IPaginatedPort } from '@application/ports/paginated.port';
import { Due } from '@domain/dues/entities/due.entity';
import {
  FindPaginatedDuesRequest,
  FindPaidRequest,
} from '@infra/mongo/repositories/dues/due-repository.types';

export interface IDuePort extends ICrudPort<Due>, IPaginatedPort<Due> {
  findPaginated(
    request: FindPaginatedDuesRequest
  ): Promise<FindPaginatedResponse<Due>>;
  findPaid(request: FindPaidRequest): Promise<Due[]>;
}
