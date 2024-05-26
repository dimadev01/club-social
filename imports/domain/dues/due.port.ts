import { ICrudPort } from '@application/ports/crud.port';
import { IPaginatedPort } from '@application/ports/paginated.port';
import { Due } from '@domain/dues/entities/due.entity';
import {
  FindPaginatedDuesRequest,
  FindPaginatedDuesResponse,
  FindPaidRequest,
  FindPendingByMemberRequest,
} from '@infra/mongo/repositories/dues/due-repository.types';

export interface IDuePort extends ICrudPort<Due>, IPaginatedPort<Due> {
  findPaginated(
    request: FindPaginatedDuesRequest,
  ): Promise<FindPaginatedDuesResponse>;
  findPaid(request: FindPaidRequest): Promise<Due[]>;
  findPendingByMember(request: FindPendingByMemberRequest): Promise<Due[]>;
}
