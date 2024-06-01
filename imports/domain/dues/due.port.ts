import {
  FindPaginatedDuesRequest,
  FindPaginatedDuesResponse,
  FindPaidRequest,
  FindPendingByMemberRequest,
} from '@adapters/repositories/dues/due-repository.types';
import { ICrudPort } from '@application/ports/crud.port';
import { IPaginatedPort } from '@application/ports/paginated.port';
import { Due } from '@domain/dues/entities/due.entity';

export interface IDuePort extends ICrudPort<Due>, IPaginatedPort<Due> {
  findPaginated(
    request: FindPaginatedDuesRequest,
  ): Promise<FindPaginatedDuesResponse>;
  findPaid(request: FindPaidRequest): Promise<Due[]>;
  findPendingByMember(request: FindPendingByMemberRequest): Promise<Due[]>;
}
